const { pool } = require('../config/database');

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('creator', 'builder', 'admin')),
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'explorer', 'builder', 'enterprise')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    profile_image_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
);

-- Ideas Table
CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'sold', 'archived')),
    
    -- Problem & Solution
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    target_audience VARCHAR(255),
    
    -- Business Model
    monetization TEXT,
    pricing_model VARCHAR(50),
    
    -- Validation Scores (0-100)
    score_overall INTEGER CHECK (score_overall >= 0 AND score_overall <= 100),
    score_market_demand INTEGER CHECK (score_market_demand >= 0 AND score_market_demand <= 100),
    score_originality INTEGER CHECK (score_originality >= 0 AND score_originality <= 100),
    score_feasibility INTEGER CHECK (score_feasibility >= 0 AND score_feasibility <= 100),
    score_monetization INTEGER CHECK (score_monetization >= 0 AND score_monetization <= 100),
    
    -- Marketplace
    price DECIMAL(10, 2),
    is_for_sale BOOLEAN DEFAULT FALSE,
    is_seeking_collaborators BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    views_count INTEGER DEFAULT 0,
    interest_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    validated_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_score ON ideas(score_overall DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);

-- Collaboration Requests Table
CREATE TABLE IF NOT EXISTS collaboration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    nda_signed BOOLEAN DEFAULT FALSE,
    nda_signed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(idea_id, requester_id)
);

CREATE INDEX IF NOT EXISTS idx_collab_requests_idea ON collaboration_requests(idea_id);
CREATE INDEX IF NOT EXISTS idx_collab_requests_requester ON collaboration_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_collab_requests_creator ON collaboration_requests(creator_id);

-- Leaderboard Rankings (Weekly Cache)
CREATE TABLE IF NOT EXISTS leaderboard_rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    rank INTEGER NOT NULL,
    score INTEGER NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(idea_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_week ON leaderboard_rankings(week_start, rank);

-- Battles Table
CREATE TABLE IF NOT EXISTS battles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_number INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    option_a_problem TEXT NOT NULL,
    option_a_market_size VARCHAR(50),
    option_b_problem TEXT NOT NULL,
    option_b_market_size VARCHAR(50),
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'ended')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Battle Votes Table
CREATE TABLE IF NOT EXISTS battle_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    selected_option CHAR(1) NOT NULL CHECK (selected_option IN ('A', 'B')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(battle_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_battle_votes_battle ON battle_votes(battle_id, selected_option);

-- Roasts Table
CREATE TABLE IF NOT EXISTS roasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roast_text TEXT NOT NULL,
    
    -- Scores
    score_originality INTEGER,
    score_execution INTEGER,
    score_market INTEGER,
    score_pivot INTEGER,
    
    advice TEXT,
    is_shared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roasts_idea ON roasts(idea_id);
CREATE INDEX IF NOT EXISTS idx_roasts_user ON roasts(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaboration_requests_updated_at BEFORE UPDATE ON collaboration_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function migrate() {
  console.log('🚀 Starting database migration...');
  
  try {
    await pool.query(schema);
    console.log('✅ Database schema created successfully!');
    console.log('📊 Tables created:');
    console.log('  - users');
    console.log('  - ideas');
    console.log('  - collaboration_requests');
    console.log('  - leaderboard_rankings');
    console.log('  - battles');
    console.log('  - battle_votes');
    console.log('  - roasts');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate();
}

module.exports = { migrate };
