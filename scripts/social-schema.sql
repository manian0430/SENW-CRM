-- Create a separate schema for social media functionality
CREATE SCHEMA IF NOT EXISTS social;

-- Create tables first
-- Social Media Account Connections
CREATE TABLE social.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform VARCHAR NOT NULL CHECK (platform IN ('x', 'linkedin', 'instagram', 'facebook', 'tiktok', 'bluesky', 'truth')),
    account_id VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    display_name VARCHAR,
    profile_url VARCHAR,
    avatar_url VARCHAR,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform, account_id)
);

-- Social Media Posts
CREATE TABLE social.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social.accounts(id) ON DELETE CASCADE,
    platform VARCHAR NOT NULL,
    post_id VARCHAR,
    content TEXT,
    media_urls JSONB,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    platform_specific_data JSONB,
    analytics JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(account_id, platform, post_id)
);

-- Social Media Interactions (comments, DMs, mentions)
CREATE TABLE social.interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social.accounts(id) ON DELETE CASCADE,
    platform VARCHAR NOT NULL,
    interaction_type VARCHAR NOT NULL CHECK (interaction_type IN ('comment', 'dm', 'mention', 'like', 'share')),
    interaction_id VARCHAR NOT NULL,
    content TEXT,
    author_id VARCHAR,
    author_username VARCHAR,
    author_data JSONB,
    parent_id UUID REFERENCES social.interactions(id),
    post_id UUID REFERENCES social.posts(id),
    status VARCHAR DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded', 'archived', 'spam')),
    sentiment VARCHAR CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    assigned_to UUID REFERENCES auth.users(id),
    response_content TEXT,
    response_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(account_id, platform, interaction_id)
);

-- Social Media Monitoring Keywords
CREATE TABLE social.monitoring_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    keyword VARCHAR NOT NULL,
    type VARCHAR CHECK (type IN ('brand', 'competitor', 'industry', 'custom')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, keyword)
);

-- Social Media Analytics
CREATE TABLE social.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social.accounts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    platform VARCHAR NOT NULL,
    metrics JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(account_id, platform, date)
);

-- Enable Row Level Security (RLS) policies
ALTER TABLE social.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.monitoring_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Accounts: Users can only see their own accounts
CREATE POLICY "Users can view their own social accounts"
    ON social.accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social accounts"
    ON social.accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts"
    ON social.accounts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Posts: Users can see posts from accounts they have access to
CREATE POLICY "Users can view posts from their accounts"
    ON social.posts FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM social.accounts 
        WHERE accounts.id = social.posts.account_id 
        AND accounts.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert posts to their accounts"
    ON social.posts FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM social.accounts 
        WHERE accounts.id = social.posts.account_id 
        AND accounts.user_id = auth.uid()
    ));

-- Create indexes for better performance
CREATE INDEX idx_social_accounts_user_id ON social.accounts(user_id);
CREATE INDEX idx_social_posts_account_id ON social.posts(account_id);
CREATE INDEX idx_social_interactions_account_id ON social.interactions(account_id);
CREATE INDEX idx_social_interactions_status ON social.interactions(status);
CREATE INDEX idx_social_analytics_account_date ON social.analytics(account_id, date);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION social.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_social_accounts_updated_at
    BEFORE UPDATE ON social.accounts
    FOR EACH ROW
    EXECUTE FUNCTION social.update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at
    BEFORE UPDATE ON social.posts
    FOR EACH ROW
    EXECUTE FUNCTION social.update_updated_at_column();

CREATE TRIGGER update_social_interactions_updated_at
    BEFORE UPDATE ON social.interactions
    FOR EACH ROW
    EXECUTE FUNCTION social.update_updated_at_column(); 