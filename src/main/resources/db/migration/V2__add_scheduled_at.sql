ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_at ON articles(scheduled_at);
