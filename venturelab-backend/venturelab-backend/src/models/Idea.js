const { query } = require('../config/database');

class Idea {
  // Create new idea
  static async create({ userId, title, category, problem, solution, targetAudience, monetization, pricingModel }) {
    const result = await query(
      `INSERT INTO ideas (user_id, title, category, problem, solution, target_audience, monetization, pricing_model, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
       RETURNING *`,
      [userId, title, category, problem, solution, targetAudience, monetization, pricingModel]
    );
    
    return result.rows[0];
  }

  // Find idea by ID
  static async findById(id) {
    const result = await query(
      `SELECT i.*, 
              u.first_name, u.last_name, u.email as creator_email,
              (SELECT COUNT(*) FROM collaboration_requests WHERE idea_id = i.id AND status = 'pending') as pending_requests
       FROM ideas i
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [id]
    );
    
    return result.rows[0];
  }

  // List ideas with filters
  static async list({ 
    category, 
    status = 'active', 
    minScore, 
    isForSale, 
    isSeekingCollaborators,
    userId,
    limit = 20, 
    offset = 0,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  }) {
    let queryText = `
      SELECT i.*, 
             u.first_name, u.last_name,
             (SELECT COUNT(*) FROM collaboration_requests WHERE idea_id = i.id AND status = 'pending') as interest_count
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (category) {
      queryText += ` AND i.category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }
    
    if (status) {
      queryText += ` AND i.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    if (minScore) {
      queryText += ` AND i.score_overall >= $${paramCount}`;
      params.push(minScore);
      paramCount++;
    }
    
   // if (isForSale !== undefined) {
   //   queryText += ` AND i.is_for_sale = $${paramCount}`;
   //   params.push(isForSale);
   //   paramCount++;
  //  }
    
   // if (isSeekingCollaborators !== undefined) {
   //   queryText += ` AND i.is_seeking_collaborators = $${paramCount}`;
   //   params.push(isSeekingCollaborators);
    //  paramCount++;
    //}
    
    if (userId) {
      queryText += ` AND i.user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }
    
    const validSortColumns = ['created_at', 'score_overall', 'views_count', 'title'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    queryText += ` ORDER BY i.${sortColumn} ${order}`;
    queryText += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM ideas i WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;
    
    if (category) {
      countQuery += ` AND i.category = $${countParamIndex}`;
      countParams.push(category);
      countParamIndex++;
    }
    
    if (status) {
      countQuery += ` AND i.status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }
    
    if (minScore) {
      countQuery += ` AND i.score_overall >= $${countParamIndex}`;
      countParams.push(minScore);
      countParamIndex++;
    }
    
    const countResult = await query(countQuery, countParams);
    
    return {
      ideas: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    };
  }

  // Update idea
  static async update(id, userId, updates) {
    const allowedFields = [
      'title', 'category', 'problem', 'solution', 'target_audience',
      'monetization', 'pricing_model', 'price', 'is_for_sale', 
      'is_seeking_collaborators', 'status'
    ];
    
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 3}`).join(', ');
    const values = [id, userId, ...fields.map(field => updates[field])];
    
    const result = await query(
      `UPDATE ideas SET ${setClause}, updated_at = NOW() 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      values
    );
    
    return result.rows[0];
  }

  // Update validation scores
  static async updateScores(id, scores) {
    const { overall, marketDemand, originality, feasibility, monetization } = scores;
    
    const result = await query(
      `UPDATE ideas 
       SET score_overall = $1,
           score_market_demand = $2,
           score_originality = $3,
           score_feasibility = $4,
           score_monetization = $5,
           validated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [overall, marketDemand, originality, feasibility, monetization, id]
    );
    
    return result.rows[0];
  }

  // Increment view count
  static async incrementViews(id) {
    await query(
      'UPDATE ideas SET views_count = views_count + 1 WHERE id = $1',
      [id]
    );
  }

  // Increment interest count
  static async incrementInterest(id) {
    await query(
      'UPDATE ideas SET interest_count = interest_count + 1 WHERE id = $1',
      [id]
    );
  }

  // Delete idea
  static async delete(id, userId) {
    const result = await query(
      'DELETE FROM ideas WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    
    return result.rows[0];
  }

  // Get user's ideas
  static async getUserIdeas(userId, status = null) {
    let queryText = `
      SELECT i.*,
             (SELECT COUNT(*) FROM collaboration_requests WHERE idea_id = i.id AND status = 'pending') as pending_requests
      FROM ideas i
      WHERE i.user_id = $1
    `;
    
    const params = [userId];
    
    if (status) {
      queryText += ' AND i.status = $2';
      params.push(status);
    }
    
    queryText += ' ORDER BY i.created_at DESC';
    
    const result = await query(queryText, params);
    return result.rows;
  }

  // Get top ideas (leaderboard)
  static async getTopIdeas(limit = 10, category = null) {
    let queryText = `
      SELECT i.*, 
             u.first_name, u.last_name,
             (SELECT COUNT(*) FROM collaboration_requests WHERE idea_id = i.id AND status = 'pending') as interest_count
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      WHERE i.status = 'active' AND i.score_overall IS NOT NULL
    `;
    
    const params = [];
    
    if (category) {
      queryText += ' AND i.category = $1';
      params.push(category);
    }
    
    queryText += ' ORDER BY i.score_overall DESC LIMIT $' + (params.length + 1);
    params.push(limit);
    
    const result = await query(queryText, params);
    return result.rows;
  }

  // Search ideas by title or problem
  static async search(searchTerm, limit = 20) {
    const result = await query(
      `SELECT i.*, 
              u.first_name, u.last_name
       FROM ideas i
       JOIN users u ON i.user_id = u.id
       WHERE i.status = 'active' 
       AND (i.title ILIKE $1 OR i.problem ILIKE $1)
       ORDER BY i.score_overall DESC NULLS LAST
       LIMIT $2`,
      [`%${searchTerm}%`, limit]
    );
    
    return result.rows;
  }
}

module.exports = Idea;
