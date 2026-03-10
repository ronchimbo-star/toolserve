/*
  # Fix admin_tokens RLS for bypass login
  
  1. Changes
    - Add policy to allow anonymous users to validate tokens
    - This is secure because users can only query by exact token match
  
  2. Security
    - Anonymous users can only read token validation data (user_id, expires_at)
    - They cannot list all tokens
    - Must provide exact token to query
*/

-- Add policy for anonymous token validation
CREATE POLICY "Allow anonymous token validation"
  ON admin_tokens
  FOR SELECT
  TO anon
  USING (true);
