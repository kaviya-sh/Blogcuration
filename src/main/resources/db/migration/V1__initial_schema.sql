CREATE TABLE IF NOT EXISTS theme_profiles (
    id               BIGSERIAL PRIMARY KEY,
    theme_id         VARCHAR(100) NOT NULL UNIQUE,
    dominant_keywords TEXT,
    covered_sectors  TEXT,
    editorial_spirit VARCHAR(500),
    language         VARCHAR(10),
    calibrated_at    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processed_urls (
    id           BIGSERIAL PRIMARY KEY,
    url          VARCHAR(2048) NOT NULL UNIQUE,
    theme_id     VARCHAR(100) NOT NULL,
    processed_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_processed_urls_url ON processed_urls(url);
CREATE INDEX IF NOT EXISTS idx_processed_urls_processed_at ON processed_urls(processed_at);

CREATE TABLE IF NOT EXISTS articles (
    id                BIGSERIAL PRIMARY KEY,
    source_url        VARCHAR(2048) NOT NULL,
    theme_id          VARCHAR(100) NOT NULL,
    title             VARCHAR(1000),
    raw_content       TEXT,
    relevance_score   DOUBLE PRECISION DEFAULT 0,
    innovation_score  DOUBLE PRECISION DEFAULT 0,
    featured          BOOLEAN DEFAULT FALSE,
    editorial_summary TEXT,
    language          VARCHAR(20),
    image_url         VARCHAR(2048),
    cms_article_id    VARCHAR(255),
    status            VARCHAR(50) NOT NULL,
    discovered_at     TIMESTAMP,
    published_at      TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_articles_theme_id ON articles(theme_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

CREATE TABLE IF NOT EXISTS pipeline_runs (
    id               BIGSERIAL PRIMARY KEY,
    started_at       TIMESTAMP,
    completed_at     TIMESTAMP,
    total_discovered INT DEFAULT 0,
    total_scored     INT DEFAULT 0,
    total_rejected   INT DEFAULT 0,
    total_published  INT DEFAULT 0,
    status           VARCHAR(50),
    error_message    TEXT
);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_started_at ON pipeline_runs(started_at DESC);
