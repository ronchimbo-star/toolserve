/*
  # Add temporary admin bypass token system
  
  1. New Table
    - `admin_tokens` - Stores temporary admin access tokens
      - `id` (uuid, primary key)
      - `token` (text, unique) - The access token
      - `user_id` (uuid) - Reference to auth.users
      - `expires_at` (timestamptz) - Token expiration
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `admin_tokens` table
    - Add policy for authenticated users to read their own tokens
*/

CREATE TABLE IF NOT EXISTS admin_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tokens"
  ON admin_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a long-lived admin token for the existing user
INSERT INTO admin_tokens (token, user_id, expires_at)
VALUES (
  'admin_bypass_token_' || gen_random_uuid()::text,
  (SELECT id FROM auth.users WHERE email = 'ronchimbo@gmail.com'),
  now() + interval '30 days'
);
