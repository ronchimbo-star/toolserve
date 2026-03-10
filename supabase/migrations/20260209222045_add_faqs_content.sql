/*
  # Add FAQ Content

  1. Changes
    - Inserts comprehensive FAQs covering multiple categories
    - Includes questions about services, repairs, pricing, warranty, and more
    
  2. Notes
    - FAQs are organized by category for easy navigation
    - Display order ensures logical flow of information
    - All FAQs are set to active by default
*/

-- Insert General FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
(
  'What types of tools and equipment do you repair?',
  'We repair a wide range of tools and equipment including power tools (drills, saws, sanders, grinders), garden equipment (lawn mowers, trimmers, chainsaws), hand tools, small appliances, batteries and chargers, and workshop/industrial equipment. If you''re unsure whether we can repair your specific equipment, please contact us and we''ll be happy to advise.',
  'General',
  1,
  true
),
(
  'What areas do you cover?',
  'We provide repair services throughout the UK. We offer both drop-off service at our workshop and collection/delivery service for your convenience. Collection and delivery charges apply and vary depending on your location. Please contact us for specific pricing for your area.',
  'General',
  2,
  true
),
(
  'Do you repair tools from all brands?',
  'Yes! We repair tools and equipment from all major brands including Makita, DeWalt, Milwaukee, Bosch, Black & Decker, Ryobi, Husqvarna, Honda, and many more. We also repair older or discontinued models where parts are available.',
  'General',
  3,
  true
),
(
  'How long does a typical repair take?',
  'Standard repairs typically take 5-10 working days from the date we receive your equipment. This includes diagnosis, sourcing parts if needed, and completing the repair. Express service is available for an additional fee, reducing turnaround time to 2-3 working days. Complex repairs or those requiring special-order parts may take longer, and we''ll always keep you informed of progress.',
  'General',
  4,
  true
);

-- Insert Repair Process FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
(
  'How do I get my equipment repaired?',
  'There are three easy ways to get your equipment repaired: 
1) Request a free quote online through our website
2) Drop off your equipment at our workshop
3) Book our collection service and we''ll pick it up from your location

Once we receive your equipment, we''ll diagnose the issue and provide you with a detailed quote before proceeding with any repair work.',
  'Repair Process',
  5,
  true
),
(
  'Do you provide a quote before starting repairs?',
  'Yes, absolutely! We always provide a detailed quote before starting any repair work. Our diagnostic fee covers the initial inspection and assessment. Once we''ve identified the problem, we''ll contact you with a quote including parts and labour costs. You can then decide whether to proceed with the repair.',
  'Repair Process',
  6,
  true
),
(
  'What happens if my equipment can''t be repaired?',
  'If we determine that your equipment cannot be economically repaired (e.g., parts unavailable, repair cost exceeds replacement cost), we''ll contact you immediately. In such cases, we''ll only charge the diagnostic fee. We''ll also provide advice on whether repair is worthwhile and discuss alternative options.',
  'Repair Process',
  7,
  true
),
(
  'Can I track the status of my repair?',
  'Yes! You can track your repair status online using the tracking number provided when you submit your repair request. Simply visit our Track Repair page and enter your tracking number or email address to see the current status of your repair.',
  'Repair Process',
  8,
  true
);

-- Insert Pricing FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
(
  'How much does a repair typically cost?',
  'Repair costs vary depending on the type of equipment and the nature of the problem. Simple repairs like switch replacements or cleaning might cost £25-50, while more complex repairs involving motor replacements or circuit board repairs could range from £50-150. We always provide a detailed quote before starting work, so you''ll know the exact cost upfront.',
  'Pricing',
  9,
  true
),
(
  'Do you charge a diagnostic fee?',
  'Yes, we charge a diagnostic fee of £20-30 (depending on equipment type) to cover the time and expertise required to assess your equipment. If you proceed with the repair, this fee is deducted from the final repair cost. If you decide not to proceed, only the diagnostic fee applies.',
  'Pricing',
  10,
  true
),
(
  'What payment methods do you accept?',
  'We accept multiple payment methods for your convenience: cash, bank transfer, debit cards, and credit cards. Payment is required before equipment is released after repair. For commercial customers with regular repair needs, we can discuss account arrangements.',
  'Pricing',
  11,
  true
),
(
  'Is it worth repairing or should I buy new?',
  'In most cases, repairing is more cost-effective and environmentally friendly than buying new. Professional-grade tools and equipment are built to last and are designed to be repaired. We''ll always be honest with you – if repair costs approach the price of a new unit, we''ll let you know. Our goal is to provide you with the best value while reducing waste.',
  'Pricing',
  12,
  true
);

-- Insert Warranty FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
(
  'Do you provide a warranty on repairs?',
  'Yes! All our repairs come with a 90-day warranty covering the work performed and parts we''ve fitted. This warranty covers workmanship and component failure under normal use. If you experience any issues with the repaired component within 90 days, we''ll fix it free of charge.',
  'Warranty',
  13,
  true
),
(
  'What does the warranty cover?',
  'Our warranty covers the specific repair work performed and any parts we''ve installed. It protects against component failure and workmanship issues under normal use conditions. The warranty does not cover new problems unrelated to the repair, damage from misuse, or normal wear and tear on other components.',
  'Warranty',
  14,
  true
),
(
  'What''s not covered by the warranty?',
  'The warranty does not cover: damage from misuse or abuse, normal wear and tear on other components, repairs or modifications done by third parties after our repair, equipment used for purposes it wasn''t designed for, or cosmetic damage. If you''re unsure, please contact us to discuss your specific situation.',
  'Warranty',
  15,
  true
);

-- Insert Battery & Parts FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
(
  'Do you rebuild or recondition batteries?',
  'Yes! We offer professional battery reconditioning and cell replacement services for all major tool brands. This is often more cost-effective than buying new batteries and better for the environment. We replace the internal cells with high-quality components and test thoroughly to ensure optimal performance.',
  'Batteries & Parts',
  16,
  true
),
(
  'Where do you source replacement parts?',
  'We use a combination of genuine OEM parts and high-quality aftermarket alternatives, depending on availability and cost-effectiveness. We always inform you which type of parts will be used in your repair. For critical components, we prioritize genuine parts when available.',
  'Batteries & Parts',
  17,
  true
),
(
  'Can you repair older or discontinued tools?',
  'In many cases, yes! We have access to extensive parts networks and can often source components for older or discontinued models. Even when original parts aren''t available, our skilled technicians can sometimes adapt alternative components or perform custom repairs. Contact us with your specific model and we''ll let you know if repair is possible.',
  'Batteries & Parts',
  18,
  true
);

-- Insert Environmental FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
(
  'Why is repairing better than replacing?',
  'Repairing tools extends their lifespan, reduces waste in landfills, conserves resources needed to manufacture new products, and saves you money. Quality tools are built to last decades with proper maintenance and repair. By choosing repair over replacement, you''re making an environmentally responsible choice and often getting better value for money.',
  'Sustainability',
  19,
  true
),
(
  'What happens to parts you remove?',
  'We responsibly recycle or dispose of all removed parts and components according to environmental regulations. Metals are sent to recycling facilities, and electronic components are processed through proper e-waste channels. We''re committed to minimizing our environmental impact at every stage of the repair process.',
  'Sustainability',
  20,
  true
);

-- Insert Commercial FAQs
INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
(
  'Do you offer services for tradespeople and businesses?',
  'Absolutely! We provide comprehensive repair and maintenance services for tradespeople, contractors, and businesses. We understand that your tools are essential to your livelihood, so we offer priority service, bulk repair discounts, and can establish account facilities for regular customers. Contact us to discuss your specific business needs.',
  'Commercial',
  21,
  true
),
(
  'Can you service tool fleets for councils or organizations?',
  'Yes! We have experience servicing tool libraries and equipment fleets for councils, community workshops, and organizations. We can provide regular maintenance schedules, bulk repair services, and detailed reporting. Our goal is to maximize the lifespan and availability of your tool inventory while minimizing costs.',
  'Commercial',
  22,
  true
);
