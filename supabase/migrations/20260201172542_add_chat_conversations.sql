/*
  # Add Chat Conversations Table

  1. New Table
    - chat_conversations: Stores chatbot conversations for analytics and improvement
      - id (uuid, primary key)
      - session_id (text) - unique identifier for conversation session
      - user_message (text) - customer message
      - assistant_message (text) - AI response
      - timestamp (timestamptz)
      - user_email (text, optional) - if user provides it during chat
      - context_data (jsonb) - additional context like page, user agent, etc.
  
  2. Security
    - Enable RLS
    - Public can insert their own conversations
    - Only authenticated users can view all conversations
*/

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_message text NOT NULL,
  assistant_message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  user_email text,
  context_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_session ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_timestamp ON chat_conversations(timestamp DESC);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chat conversations"
  ON chat_conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all conversations"
  ON chat_conversations FOR SELECT
  TO authenticated
  USING (true);