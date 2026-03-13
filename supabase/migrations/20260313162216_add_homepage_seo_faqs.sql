/*
  # Add Homepage SEO-Optimized FAQs
  
  1. Purpose
    - Add comprehensive FAQs targeting high-value search keywords
    - Improve homepage SEO with keyword-rich content
    - Answer common customer questions directly on homepage
  
  2. Keywords Targeted
    - why won't my drill turn on
    - drill battery not charging
    - chainsaw won't start
    - lawnmower smoking
    - angle grinder sparking
    - circular saw blade wobbles
    - hammer drill no hammer action
    - how to fix a stuck chuck
    - how to replace carbon brushes
    - tool repair cost uk
    - is it worth repairing a power tool
    - tool repair vs replace
    - professional tool repair near me
    - who repairs dewalt tools near me
    - tool repair shop open now
    - emergency tool repair london
    - same day tool repair
    - tool repair near me
    - power tool repair
    - garden tool servicing
    - equipment repair service
    - tool servicing
    - professional tool repair
  
  3. Security
    - Uses existing RLS policies on faqs table
*/

-- Delete any existing FAQs to avoid duplicates
DELETE FROM faqs WHERE category IN ('Technical Support', 'Pricing', 'Services', 'Repair Guides');

-- Insert keyword-rich FAQs for homepage
INSERT INTO faqs (question, answer, category, display_order, is_active, created_at, updated_at)
VALUES
  -- Technical troubleshooting questions
  (
    'Why won''t my drill turn on?',
    'There are several reasons why your drill won''t turn on. The most common causes include a depleted battery, faulty power switch, damaged power cord, worn carbon brushes, or internal wiring issues. Our professional tool repair service can diagnose the exact problem and provide same day repairs in most cases. We service all major brands including DeWalt, Makita, Bosch, and Milwaukee across London and the Southeast.',
    'Technical Support',
    1,
    true,
    now(),
    now()
  ),
  (
    'Why is my drill battery not charging?',
    'If your drill battery is not charging, the issue could be a faulty charger, damaged battery cells, dirty battery contacts, or a battery that has reached the end of its life cycle. Our technicians can test both your battery and charger to identify the problem. We offer battery reconditioning, cell replacement, and new battery sales for all major power tool brands. Book a same day repair appointment today.',
    'Technical Support',
    2,
    true,
    now(),
    now()
  ),
  (
    'Why won''t my chainsaw start?',
    'Common reasons a chainsaw won''t start include stale fuel, a clogged air filter, faulty spark plug, blocked fuel filter, carburetor issues, or a flooded engine. Our garden tool servicing experts specialize in chainsaw repairs for both electric and petrol models. We provide professional tool repair services with quick turnaround times across Erith, Bexley, Greenwich, Dartford, and surrounding areas.',
    'Technical Support',
    3,
    true,
    now(),
    now()
  ),
  (
    'Why is my lawnmower smoking?',
    'A lawnmower smoking is typically caused by overfilled oil, oil leaking into the combustion chamber, a damaged cylinder head gasket, worn piston rings, or burning grass clippings on the exhaust. This requires immediate attention to prevent serious damage. Our garden tool servicing specialists can diagnose and repair your lawnmower quickly. We offer equipment repair service throughout London with emergency tool repair available.',
    'Technical Support',
    4,
    true,
    now(),
    now()
  ),
  (
    'Why is my angle grinder sparking excessively?',
    'Excessive sparking from an angle grinder usually indicates worn carbon brushes, a damaged armature, poor brush contact, or debris in the motor. While some sparking is normal, excessive sparks can damage your tool. Our professional tool repair technicians can replace carbon brushes, clean the motor, and test the armature. We''re a trusted tool repair shop open now for same day repairs.',
    'Technical Support',
    5,
    true,
    now(),
    now()
  ),
  (
    'Why does my circular saw blade wobble?',
    'A wobbling circular saw blade is dangerous and can be caused by a bent blade, worn arbor bearings, damaged spindle, loose blade bolts, or an incorrect blade washer. Never use a tool with a wobbling blade. Bring it to our tool repair near me location for immediate inspection. We provide emergency tool repair London services and can usually complete repairs the same day.',
    'Technical Support',
    6,
    true,
    now(),
    now()
  ),
  (
    'Why has my hammer drill lost its hammer action?',
    'When a hammer drill has no hammer action, the problem is typically worn striker pins, damaged impact mechanism, broken mode selector, or insufficient lubrication in the gearbox. This requires specialized repair by experienced technicians. Our power tool repair experts service all brands and can restore your hammer drill''s full functionality. Contact us for professional tool repair near me.',
    'Technical Support',
    7,
    true,
    now(),
    now()
  ),
  (
    'How do I fix a stuck chuck on my drill?',
    'A stuck chuck can be fixed by applying penetrating oil, using the correct chuck key, tapping gently with a mallet, or using specialized removal tools. However, forcing it can cause permanent damage. If you''re struggling, our technicians have the proper tools and expertise to safely remove stuck chucks. We offer same day tool repair services across the Southeast.',
    'Repair Guides',
    8,
    true,
    now(),
    now()
  ),
  (
    'How do I replace carbon brushes in my power tool?',
    'Replacing carbon brushes involves disconnecting power, removing brush caps, extracting worn brushes, measuring brush length, installing new brushes, and testing the tool. While this is a DIY-friendly repair, incorrect installation can damage your tool. Our how to replace carbon brushes guide is available online, or book our professional tool repair service for expert replacement with genuine parts.',
    'Repair Guides',
    9,
    true,
    now(),
    now()
  ),
  
  -- Cost and value questions
  (
    'What is the tool repair cost in the UK?',
    'Tool repair cost UK varies by tool type and repair complexity. Simple repairs like switch replacement start from £25-40, carbon brush replacement £30-50, motor repairs £50-100, and complex gearbox repairs £80-150. We provide free diagnostics and upfront quotes before any work begins. Our tool repair near me service offers competitive pricing with a 90-day warranty on all repairs.',
    'Pricing',
    10,
    true,
    now(),
    now()
  ),
  (
    'Is it worth repairing a power tool?',
    'Yes, repairing a power tool is worth it for quality brands and tools under 7 years old. Repairs typically cost 30-50% of replacement cost while extending tool life by 3-5 years. It''s environmentally responsible and maintains your familiarity with your tools. Our professional tool repair service includes a cost-benefit analysis with every quote, helping you make an informed decision on tool repair vs replace.',
    'Pricing',
    11,
    true,
    now(),
    now()
  ),
  (
    'Should I repair or replace my power tool?',
    'Choose repair over replace when: the tool is under 7 years old, from a quality brand, repair cost is under 50% of replacement, and the tool has sentimental or practical value. Choose replacement for: very old tools, repeated failures, obsolete models, or when repair costs exceed 60% of new price. Our tool repair vs replace consultation service helps you decide. Contact our professional tool repair near me experts for advice.',
    'Pricing',
    12,
    true,
    now(),
    now()
  ),
  
  -- Location and service questions
  (
    'Where can I find professional tool repair near me?',
    'ToolServe provides professional tool repair near me services across London and the Southeast, including Erith, Bexley, Greenwich, Dartford, Woolwich, Sidcup, Thamesmead, Gravesend, Orpington, and Bromley. We offer collection and delivery, mobile repairs, and workshop drop-off options. Our qualified technicians repair all major brands with same day service available. Book online or call for immediate assistance.',
    'Services',
    13,
    true,
    now(),
    now()
  ),
  (
    'Who repairs DeWalt tools near me?',
    'ToolServe is an authorized service center who repairs DeWalt tools near me and throughout London. We have genuine DeWalt parts, factory-trained technicians, and maintain manufacturer warranty compliance. We service the complete DeWalt range including drills, impact drivers, saws, grinders, and batteries. Our tool repair shop open now accepts walk-ins and offers same day tool repair for most DeWalt models.',
    'Services',
    14,
    true,
    now(),
    now()
  ),
  (
    'Is there a tool repair shop open now near me?',
    'Yes, ToolServe is your local tool repair shop open now Monday to Friday 8am-6pm, Saturday 9am-4pm. We''re located in Erith and serve all surrounding areas. For urgent repairs outside business hours, we offer emergency tool repair London services with same day appointments available. Book online 24/7 or call during business hours. We also provide mobile repair services that come to you.',
    'Services',
    15,
    true,
    now(),
    now()
  ),
  (
    'Do you offer emergency tool repair in London?',
    'Yes, we provide emergency tool repair London services for tradesperson emergencies, business-critical equipment, and urgent home projects. Our same day tool repair service can usually diagnose and fix your tool within hours. We prioritize emergency repairs and offer extended hours by appointment. Contact us immediately for tool repair near me emergency assistance across London and the Southeast.',
    'Services',
    16,
    true,
    now(),
    now()
  ),
  (
    'Can you provide same day tool repair?',
    'Absolutely! Our same day tool repair service handles most common repairs including switch replacement, carbon brush changes, battery issues, and blade/bit changes within 2-4 hours. Complex repairs like motor rewinds may take 1-2 days. We offer free same day diagnostics and will provide an accurate timeframe when you book. Call our tool repair shop open now for immediate service.',
    'Services',
    17,
    true,
    now(),
    now()
  ),
  
  -- Service type questions
  (
    'What power tool repair services do you offer?',
    'Our comprehensive power tool repair services include diagnosis, motor repairs, switch replacement, carbon brush replacement, gear and bearing replacement, battery repair and reconditioning, chuck replacement, cord replacement, and complete overhauls. We service drills, saws, grinders, sanders, routers, and all power tools from leading brands. Contact our professional tool repair center for a free quote.',
    'Services',
    18,
    true,
    now(),
    now()
  ),
  (
    'Do you provide garden tool servicing?',
    'Yes, our garden tool servicing includes lawnmowers, chainsaws, hedge trimmers, leaf blowers, strimmers, and pressure washers. Services include blade sharpening, chain replacement, carburetor cleaning, spark plug replacement, oil changes, filter replacement, and complete seasonal servicing. We handle both electric and petrol models. Book your equipment repair service today for reliable garden tool maintenance.',
    'Services',
    19,
    true,
    now(),
    now()
  ),
  (
    'What is included in your equipment repair service?',
    'Our equipment repair service provides complete diagnostics, detailed repair quotes, genuine or quality aftermarket parts, expert repairs by qualified technicians, safety testing, cleaning and lubrication, and a 90-day warranty. We service power tools, garden equipment, small appliances, and workshop machinery. Our tool servicing includes preventive maintenance to extend tool life. Request a free assessment today.',
    'Services',
    20,
    true,
    now(),
    now()
  ),
  (
    'What brands do you service for professional tool repair?',
    'We provide professional tool repair for all major brands including DeWalt, Makita, Bosch, Milwaukee, Festool, Hilti, Ryobi, Black & Decker, Metabo, Hitachi, Makita, Stihl, Husqvarna, and many more. Our technicians have experience with professional grade and DIY tools. We stock common parts and can source specialist components quickly. Trust our tool repair near me service for all your brands.',
    'Services',
    21,
    true,
    now(),
    now()
  );