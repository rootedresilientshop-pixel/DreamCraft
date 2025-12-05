import express, { Request, Response } from 'express';

const router = express.Router();

// Validate input body using a simple approach
const validatePayload = (req: Request, res: Response, requiredFields: string[]): boolean => {
  const missing = requiredFields.filter(field => !req.body[field]);
  if (missing.length > 0) {
    res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    return false;
  }
  return true;
};

// Sanitize string inputs (remove leading/trailing whitespace)
const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') return input.trim();
  if (Array.isArray(input)) return input.map(sanitizeInput);
  if (input !== null && typeof input === 'object') {
    return Object.keys(input).reduce((acc, key) => ({
      ...acc,
      [key]: sanitizeInput(input[key]),
    }), {});
  }
  return input;
};

router.use((req, res, next) => {
  req.body = sanitizeInput(req.body);
  next();
});

export { router as validationRouter, validatePayload };
