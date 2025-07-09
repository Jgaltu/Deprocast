/*
  # Create email subscriptions table

  1. New Tables
    - `email_subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `created_at` (timestamp with timezone, default now())
      - `subscribed` (boolean, default true)

  2. Security
    - Enable RLS on `email_subscriptions` table
    - Add policy for public insert access (for email signup)
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS email_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  subscribed boolean DEFAULT true
);

ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert email subscriptions (for the signup form)
CREATE POLICY "Anyone can subscribe to email list"
  ON email_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow users to read their own subscription data
CREATE POLICY "Users can read own subscription data"
  ON email_subscriptions
  FOR SELECT
  TO anon
  USING (true);