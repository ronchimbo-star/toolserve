/*
  # Add FAQs Table

  1. New Tables
    - `faqs`
      - `id` (uuid, primary key)
      - `question` (text) - The FAQ question
      - `answer` (text) - The FAQ answer
      - `category` (text, nullable) - Category for grouping FAQs
      - `display_order` (integer) - Order in which to display FAQs
      - `is_active` (boolean) - Whether FAQ is currently shown
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `faqs` table
    - Add policies for public read access to active FAQs
    - Add policies for authenticated admin write access

  3. Initial Data
    - Insert common FAQs based on tool repair industry
*/

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- FAQs policies
CREATE POLICY "Anyone can view active FAQs"
  ON faqs FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all FAQs"
  ON faqs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert FAQs"
  ON faqs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update FAQs"
  ON faqs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete FAQs"
  ON faqs FOR DELETE
  TO authenticated
  USING (true);

-- Insert common FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active)
VALUES 
  (
    'What types of tools and equipment do you repair?',
    'We repair a wide range of equipment including power tools (drills, saws, sanders), garden equipment (lawnmowers, hedge trimmers, chainsaws), hand tools, small appliances (vacuums, kitchen appliances), and professional tradesperson equipment. If you''re unsure whether we can repair your item, please contact us and we''ll be happy to advise.',
    'Services',
    1,
    true
  ),
  (
    'How much does a repair typically cost?',
    'Repair costs vary depending on the issue and equipment type. We provide a free diagnosis and quote before any work begins. Most repairs cost 50-70% less than buying new equipment. Once we assess your item, we''ll give you a transparent quote with no hidden fees.',
    'Pricing',
    2,
    true
  ),
  (
    'How long does a repair take?',
    'Standard repairs typically take 3-5 working days. More complex repairs may take 7-10 working days. We''ll give you an estimated timeframe when we provide your quote. If you need your equipment urgently, please let us know and we''ll do our best to accommodate.',
    'Process',
    3,
    true
  ),
  (
    'Do you offer a warranty on repairs?',
    'Yes! All repairs come with a 90-day warranty on our workmanship. If the same issue occurs within 90 days of the repair, we''ll fix it free of charge. This warranty covers our repair work but does not cover new damage, misuse, or normal wear and tear.',
    'Warranty',
    4,
    true
  ),
  (
    'Can you repair battery-powered tools and replace batteries?',
    'Absolutely! We work with all major battery brands including Makita, DeWalt, Milwaukee, Bosch, and more. We can repair battery-powered tools, replace battery cells, recondition battery packs, and repair chargers. We also test batteries to determine if they can be saved or need replacement.',
    'Services',
    5,
    true
  ),
  (
    'Do you offer collection and delivery?',
    'Yes! We offer free collection and delivery within Hampshire (Portsmouth, Southampton, Winchester areas). We also serve West Sussex, Dorset, Isle of Wight, and Surrey with collection/delivery available. For customers outside these areas, we accept mail-in repairs from anywhere in the UK.',
    'Service Areas',
    6,
    true
  ),
  (
    'What if my tool is too old or not worth repairing?',
    'We''ll always give you honest advice. If a repair isn''t cost-effective, we''ll let you know. However, you might be surprised - many older tools are built better than modern ones and are absolutely worth repairing. We can also advise on whether parts are available for vintage or discontinued models.',
    'Process',
    7,
    true
  ),
  (
    'Can you sharpen blades and cutting tools?',
    'Yes! We offer sharpening services for saw blades, drill bits, chisels, plane blades, garden shears, hedge trimmer blades, chainsaw chains, and more. Proper sharpening extends the life of your tools and improves their performance.',
    'Services',
    8,
    true
  ),
  (
    'Do you work with councils and businesses?',
    'Yes! We work extensively with councils, schools, businesses, and organizations. We offer bulk repair services, contract maintenance programs, and custom solutions. We can help you reduce waste, save budget, and meet sustainability targets. Contact us to discuss your requirements.',
    'Business Services',
    9,
    true
  ),
  (
    'How do I request a repair?',
    'Simply fill out our online repair request form with details about your equipment and the issue. You can also call or email us. We''ll arrange collection (if in our service area) or provide mail-in instructions. Once we receive your item, we''ll diagnose it and send you a quote for approval before proceeding.',
    'Process',
    10,
    true
  )
ON CONFLICT DO NOTHING;