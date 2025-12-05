const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create({ email, password, firstName, lastName, role = 'creator' }) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, role, subscription_tier, created_at`,
      [email, passwordHash, firstName, lastName, role]
    );
    
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await query(
      'SELECT id, email, first_name, last_name, role, subscription_tier, created_at, email_verified, profile_image_url, bio, location, website FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, passwordHash) {
    return await bcrypt.compare(plainPassword, passwordHash);
  }

  // Update user profile
  static async update(id, updates) {
    const allowedFields = ['first_name', 'last_name', 'bio', 'location', 'website', 'profile_image_url'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updates[field])];
    
    const result = await query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING id, email, first_name, last_name, role, subscription_tier, bio, location, website, profile_image_url`,
      values
    );
    
    return result.rows[0];
  }

  // Update last login
  static async updateLastLogin(id) {
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [id]
    );
  }

  // Set email verification token
  static async setEmailVerificationToken(id, token) {
    await query(
      'UPDATE users SET email_verification_token = $1 WHERE id = $2',
      [token, id]
    );
  }

  // Verify email
  static async verifyEmail(token) {
    const result = await query(
      'UPDATE users SET email_verified = TRUE, email_verification_token = NULL WHERE email_verification_token = $1 RETURNING id, email',
      [token]
    );
    
    return result.rows[0];
  }

  // Set password reset token
  static async setPasswordResetToken(email, token, expires) {
    const result = await query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3 RETURNING id',
      [token, expires, email]
    );
    
    return result.rows[0];
  }

  // Reset password
  static async resetPassword(token, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const result = await query(
      `UPDATE users 
       SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL 
       WHERE password_reset_token = $2 AND password_reset_expires > NOW()
       RETURNING id, email`,
      [passwordHash, token]
    );
    
    return result.rows[0];
  }

  // Update subscription tier
  static async updateSubscription(id, tier) {
    const result = await query(
      'UPDATE users SET subscription_tier = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, subscription_tier',
      [tier, id]
    );
    
    return result.rows[0];
  }

  // Get user stats
  static async getStats(userId) {
    const result = await query(
      `SELECT 
        (SELECT COUNT(*) FROM ideas WHERE user_id = $1) as ideas_count,
        (SELECT COUNT(*) FROM collaboration_requests WHERE creator_id = $1 AND status = 'accepted') as collaborations_count
      `,
      [userId]
    );
    
    return result.rows[0];
  }

  // Delete user (soft delete by archiving ideas)
  static async delete(id) {
    await query(
      `UPDATE ideas SET status = 'archived' WHERE user_id = $1`,
      [id]
    );
    
    await query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
  }
}

module.exports = User;
