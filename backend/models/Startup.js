const pool = require('../config/db');

class Startup {
  static async createTable() {
    // Startups table
    const startupQuery = `
      CREATE TABLE IF NOT EXISTS startups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tagline VARCHAR(500),
        description TEXT,
        category VARCHAR(100),
        stage VARCHAR(50) DEFAULT 'idea',
        website VARCHAR(500),
        logo VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Startup founders junction table (many-to-many)
    const foundersQuery = `
      CREATE TABLE IF NOT EXISTS startup_founders (
        id SERIAL PRIMARY KEY,
        startup_id INTEGER REFERENCES startups(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'founder',
        is_owner BOOLEAN DEFAULT false,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(startup_id, user_id)
      );
    `;

    await pool.query(startupQuery);
    await pool.query(foundersQuery);
  }

  static async create(startupData, ownerId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { name, tagline, description, category, stage, website, logo } = startupData;
      
      // Create startup
      const startupQuery = `
        INSERT INTO startups (name, tagline, description, category, stage, website, logo)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const startupResult = await client.query(startupQuery, [
        name, tagline, description, category, stage, website, logo
      ]);
      const startup = startupResult.rows[0];

      // Add owner as founder
      const founderQuery = `
        INSERT INTO startup_founders (startup_id, user_id, role, is_owner)
        VALUES ($1, $2, 'founder', true)
        RETURNING *;
      `;
      await client.query(founderQuery, [startup.id, ownerId]);

      await client.query('COMMIT');
      return startup;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const query = `
      SELECT s.*, 
        json_agg(
          json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'profile_image', u.profile_image,
            'role', sf.role,
            'is_owner', sf.is_owner
          )
        ) as founders
      FROM startups s
      LEFT JOIN startup_founders sf ON s.id = sf.startup_id
      LEFT JOIN users u ON sf.user_id = u.id
      WHERE s.id = $1
      GROUP BY s.id;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT s.*, sf.role, sf.is_owner
      FROM startups s
      INNER JOIN startup_founders sf ON s.id = sf.startup_id
      WHERE sf.user_id = $1
      ORDER BY s.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getAll() {
    const query = `
      SELECT s.*, 
        json_agg(
          json_build_object(
            'id', u.id,
            'name', u.name,
            'profile_image', u.profile_image
          )
        ) as founders
      FROM startups s
      LEFT JOIN startup_founders sf ON s.id = sf.startup_id
      LEFT JOIN users u ON sf.user_id = u.id
      GROUP BY s.id
      ORDER BY s.created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async update(id, updates) {
    const { name, tagline, description, category, stage, website, logo } = updates;
    const query = `
      UPDATE startups 
      SET name = $1, tagline = $2, description = $3, category = $4, 
          stage = $5, website = $6, logo = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *;
    `;
    const result = await pool.query(query, [
      name, tagline, description, category, stage, website, logo, id
    ]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM startups WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async addCoFounder(startupId, userId, role = 'co-founder') {
    const query = `
      INSERT INTO startup_founders (startup_id, user_id, role, is_owner)
      VALUES ($1, $2, $3, false)
      RETURNING *;
    `;
    const result = await pool.query(query, [startupId, userId, role]);
    return result.rows[0];
  }

  static async removeCoFounder(startupId, userId) {
    const query = `
      DELETE FROM startup_founders 
      WHERE startup_id = $1 AND user_id = $2 AND is_owner = false
      RETURNING *;
    `;
    const result = await pool.query(query, [startupId, userId]);
    return result.rows[0];
  }

  static async isOwner(startupId, userId) {
    const query = `
      SELECT is_owner FROM startup_founders 
      WHERE startup_id = $1 AND user_id = $2;
    `;
    const result = await pool.query(query, [startupId, userId]);
    return result.rows[0]?.is_owner || false;
  }
}

module.exports = Startup;
