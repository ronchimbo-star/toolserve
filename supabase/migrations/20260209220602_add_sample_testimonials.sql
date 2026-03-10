/*
  # Add Sample Testimonials

  1. Data
    - Inserts sample testimonials with realistic content
    - Includes diverse customer types (homeowner, tradesperson, council worker)
    - Sets proper display order and active status
    
  2. Notes
    - Images can be uploaded via the admin dashboard later
    - All testimonials are set to active by default
    - Display order determines the order shown on the homepage
*/

-- Insert sample testimonials
INSERT INTO testimonials (name, role, content, display_order, is_active, image_url) VALUES
  (
    'Sarah Thompson',
    'Homeowner, Manchester',
    'Absolutely fantastic service! My cordless drill stopped working and I thought I''d have to buy a new one. The team at ToolServe diagnosed the issue quickly and had it repaired within 3 days. Saved me a fortune and it works like new. Highly recommend their service!',
    1,
    true,
    null
  ),
  (
    'Mike Anderson',
    'Carpenter & Builder',
    'As a professional carpenter, my tools are my livelihood. When my table saw started acting up, I was worried about downtime. ToolServe collected it, repaired it the same week, and returned it in perfect condition. Their expertise and quick turnaround are unbeatable. I won''t use anyone else.',
    2,
    true,
    null
  ),
  (
    'David Chen',
    'Council Parks Supervisor',
    'We manage a large tool library for our community workshops, and ToolServe has become our go-to repair service. They handle everything from lawn mowers to power drills, always with professionalism and fair pricing. Their commitment to reducing waste aligns perfectly with our sustainability goals.',
    3,
    true,
    null
  ),
  (
    'Emma Rodriguez',
    'DIY Enthusiast, Leeds',
    'I inherited my grandfather''s vintage hand tools and power tools, some over 40 years old. ToolServe not only repaired them but treated them with the care and respect they deserved. It''s wonderful to find a company that values quality and sustainability over just selling new products.',
    4,
    true,
    null
  ),
  (
    'James Wilson',
    'Electrician',
    'I''ve been using ToolServe for over two years now. Their battery reconditioning service has saved me thousands on replacements. The team really knows their stuff, and they stand behind their work. Whether it''s a quick fix or a major repair, they deliver every time.',
    5,
    true,
    null
  );
