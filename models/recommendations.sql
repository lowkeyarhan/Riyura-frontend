-- Table to store AI-generated recommendations for users
-- Recommendations are cached here to avoid repeated AI calls for the same user

CREATE TABLE IF NOT EXISTS recommendations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tmdb_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  vote_average FLOAT,
  release_date DATE,
  number_of_seasons INT,
  number_of_episodes INT,
  reason TEXT NOT NULL,
  genre TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tmdb_id, media_type)
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id 
  ON recommendations(user_id);

-- Index for ordering by generation time
CREATE INDEX IF NOT EXISTS idx_recommendations_generated_at 
  ON recommendations(user_id, generated_at DESC);

-- Enable Row Level Security
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own recommendations
CREATE POLICY "Users can read own recommendations"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own recommendations
CREATE POLICY "Users can insert own recommendations"
  ON recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own recommendations
CREATE POLICY "Users can delete own recommendations"
  ON recommendations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to clean up old recommendations (keep only latest batch)
CREATE OR REPLACE FUNCTION cleanup_old_recommendations()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete recommendations older than the current batch for this user
  DELETE FROM recommendations
  WHERE user_id = NEW.user_id
    AND generated_at < NEW.generated_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically cleanup old recommendations when new ones are added
CREATE TRIGGER trigger_cleanup_old_recommendations
  AFTER INSERT ON recommendations
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_old_recommendations();
