import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import InviteCode from "../models/InviteCode";

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Register with invite code validation
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, username, password, userType, inviteCode } = req.body;

    // Input validation
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email, username, and password are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, error: "Password must be at least 8 characters" });
    }

    if (username.length < 3 || username.length > 25) {
      return res
        .status(400)
        .json({ success: false, error: "Username must be between 3 and 25 characters" });
    }

    // Validate invite code
    let betaAccess = false;
    let inviteCodeRecord = null;

    if (inviteCode) {
      inviteCodeRecord = await InviteCode.findOne({
        code: inviteCode.toUpperCase(),
        active: true,
      });

      if (!inviteCodeRecord) {
        return res.status(400).json({ success: false, error: "Invalid invite code" });
      }

      // Check if code has expired
      if (inviteCodeRecord.expiresAt && new Date() > inviteCodeRecord.expiresAt) {
        return res.status(400).json({ success: false, error: "Invite code has expired" });
      }

      // Check if code has reached max uses
      if (
        inviteCodeRecord.maxUses !== -1 &&
        inviteCodeRecord.usedBy.length >= inviteCodeRecord.maxUses
      ) {
        return res.status(400).json({ success: false, error: "Invite code has reached maximum uses" });
      }

      betaAccess = true;
    } else {
      // Require invite code for registration
      return res.status(400).json({ success: false, error: "Invite code is required to register" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      username,
      password: hashedPassword,
      userType: userType || "creator",
      betaAccess,
      inviteCodeUsed: {
        code: inviteCode.toUpperCase(),
        usedAt: new Date(),
      },
    });

    await user.save();

    // Record usage in invite code
    if (inviteCodeRecord) {
      inviteCodeRecord.usedBy.push({
        userId: user._id,
        usedAt: new Date(),
      });
      await inviteCodeRecord.save();
    }

    // Generate token for newly registered user
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("CRITICAL: JWT_SECRET not set in environment");
      return res.status(500).json({ success: false, error: "Server configuration error: JWT_SECRET missing" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        userType: user.userType,
        betaAccess,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("CRITICAL: JWT_SECRET not set in environment");
      return res
        .status(500)
        .json({ success: false, error: "Server configuration error: JWT_SECRET missing" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

export default router;
