ALTER TABLE threads ADD COLUMN label TEXT NOT NULL DEFAULT 'chat';

CREATE INDEX IF NOT EXISTS idx_threads_label_bumped ON threads(label, bumped_at DESC);
