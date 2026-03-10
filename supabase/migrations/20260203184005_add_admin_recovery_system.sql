/*
  # Admin Recovery System

  1. New Tables
    - `admin_recovery_tokens`
      - `id` (uuid, primary key)
      - `code` (text, unique recovery code)
      - `email` (text, admin email)
      - `used` (boolean, whether token has been used)
      - `used_at` (timestamptz, when token was used)
      - `expires_at` (timestamptz, expiration time)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `admin_recovery_tokens` table
    - Add policy for public read access (needed for recovery page)

  3. Initial Token
    - Creates a recovery token for ronchimbo@gmail.com
    - Token: RECOVER-2026-ADMIN
    - Valid for 7 days
*/

-- Create admin recovery tokens table
CREATE TABLE IF NOT EXISTS admin_recovery_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  email text NOT NULL,
  used boolean DEFAULT false,
  used_at timestamptz,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_recovery_tokens ENABLE ROW LEVEL SECURITY;

-- Allow public read for recovery (needed for the recovery page to work)
CREATE POLICY "Anyone can read recovery tokens for validation"
  ON admin_recovery_tokens
  FOR SELECT
  TO public
  USING (true);

-- Allow public update only for marking as used
CREATE POLICY "Anyone can mark token as used"
  ON admin_recovery_tokens
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (used = true);

-- Insert initial recovery token for the existing admin
INSERT INTO admin_recovery_tokens (code, email, expires_at)
VALUES (
  'RECOVER-2026-ADMIN',
  'ronchimbo@gmail.com',
  now() + interval '7 days'
)
ON CONFLICT (code) DO NOTHING;
