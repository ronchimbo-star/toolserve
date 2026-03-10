/*
  # Add SEO Fields to Service Areas

  1. Changes
    - Add `meta_title` (text) - Custom page title for SEO
    - Add `meta_description` (text) - Meta description for search engines
    - Add `keywords` (text[]) - SEO keywords for the area
    - Add `content_intro` (text) - Introductory paragraph for area page
    - Add `services_offered` (text[]) - List of specific services in this area
    - Add `equipment_types` (text[]) - Types of equipment serviced
    - Add `brands_serviced` (text[]) - Popular brands we service
    
  2. Update existing records with SEO-optimized content
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_areas' AND column_name = 'meta_title'
  ) THEN
    ALTER TABLE service_areas ADD COLUMN meta_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_areas' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE service_areas ADD COLUMN meta_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_areas' AND column_name = 'keywords'
  ) THEN
    ALTER TABLE service_areas ADD COLUMN keywords text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_areas' AND column_name = 'content_intro'
  ) THEN
    ALTER TABLE service_areas ADD COLUMN content_intro text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_areas' AND column_name = 'services_offered'
  ) THEN
    ALTER TABLE service_areas ADD COLUMN services_offered text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_areas' AND column_name = 'equipment_types'
  ) THEN
    ALTER TABLE service_areas ADD COLUMN equipment_types text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_areas' AND column_name = 'brands_serviced'
  ) THEN
    ALTER TABLE service_areas ADD COLUMN brands_serviced text[];
  END IF;
END $$;

UPDATE service_areas SET
  meta_title = 'Tool Repair Erith | Power Tool & Appliance Repairs DA8 | ToolServe',
  meta_description = 'Professional tool repair service in Erith DA8. Same-day power tool repairs, garden equipment servicing, appliance fixes. Local, affordable, eco-friendly repairs.',
  keywords = ARRAY['tool repair Erith', 'power tool repair DA8', 'appliance repair Erith', 'drill repair near me', 'lawnmower repair Erith', 'tool servicing Kent', 'electric tool repair', 'garden equipment repair DA8'],
  content_intro = 'ToolServe provides professional tool and appliance repair services right here in Erith, DA8. As our main service area, we offer same-day repairs for urgent jobs and comprehensive servicing for all types of power tools, garden equipment, and small appliances.',
  services_offered = ARRAY['Power tool repair and servicing', 'Garden equipment maintenance', 'Small appliance repairs', 'PAT testing', 'Tool sharpening', 'Battery replacement', 'Motor repairs', 'Electrical fault diagnosis'],
  equipment_types = ARRAY['Power Drills', 'Circular Saws', 'Angle Grinders', 'Sanders', 'Lawnmowers', 'Hedge Trimmers', 'Pressure Washers', 'Vacuum Cleaners', 'Food Mixers'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Black & Decker', 'Ryobi', 'Milwaukee', 'Festool', 'Hitachi', 'Stanley']
WHERE slug = 'erith';

UPDATE service_areas SET
  meta_title = 'Tool Repair Bexley | Power Tool Servicing DA5-DA17 | ToolServe',
  meta_description = 'Expert tool repair in Bexley borough. Professional power tool, garden equipment & appliance repairs across DA5, DA6, DA7, DA14-DA17. Fast turnaround.',
  keywords = ARRAY['tool repair Bexley', 'power tool repair Bexley', 'appliance repair DA5', 'drill repair Bexley', 'garden tool servicing', 'tool repair near me', 'power tool servicing Bexley'],
  content_intro = 'Serving the entire Bexley borough, ToolServe offers comprehensive tool and appliance repair services across all DA postcodes. Our experienced technicians provide fast, reliable repairs for both domestic and trade customers.',
  services_offered = ARRAY['Power tool repair and servicing', 'Garden equipment maintenance', 'Small appliance repairs', 'PAT testing', 'Tool sharpening', 'Warranty repairs', 'Equipment safety checks'],
  equipment_types = ARRAY['Power Drills', 'Jigsaws', 'Sanders', 'Routers', 'Lawnmowers', 'Strimmers', 'Chainsaws', 'Leaf Blowers', 'Vacuum Cleaners'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Ryobi', 'Black & Decker', 'Milwaukee', 'Karcher', 'Flymo', 'Hoover']
WHERE slug = 'bexley';

UPDATE service_areas SET
  meta_title = 'Tool Repair Greenwich | Appliance Servicing SE7-SE28 | ToolServe',
  meta_description = 'Professional tool and appliance repair in Greenwich. Expert servicing of power tools, garden equipment & appliances across SE2, SE3, SE7, SE9, SE10, SE18, SE28.',
  keywords = ARRAY['tool repair Greenwich', 'power tool repair SE7', 'appliance repair Greenwich', 'drill repair SE18', 'garden equipment repair Greenwich', 'tool servicing South East London'],
  content_intro = 'ToolServe proudly serves Greenwich and surrounding areas with professional tool and appliance repair services. We help both homeowners and tradespeople keep their equipment running smoothly and affordably.',
  services_offered = ARRAY['Power tool repair', 'Garden machinery servicing', 'Appliance repairs', 'Electrical testing', 'Tool maintenance', 'Part replacement', 'Equipment diagnostics'],
  equipment_types = ARRAY['Electric Drills', 'Impact Drivers', 'Circular Saws', 'Lawnmowers', 'Hedge Cutters', 'Pressure Washers', 'Vacuum Cleaners', 'Kitchen Appliances'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Black & Decker', 'Ryobi', 'Karcher', 'Dyson', 'Hoover', 'Flymo']
WHERE slug = 'greenwich';

UPDATE service_areas SET
  meta_title = 'Tool Repair Dartford | Power Tool Repairs DA1-DA4 Kent | ToolServe',
  meta_description = 'Reliable tool repair service in Dartford, Kent. Professional repairs for power tools, garden equipment & appliances. Covering DA1, DA2, DA3, DA4, DA9 postcodes.',
  keywords = ARRAY['tool repair Dartford', 'power tool repair Kent', 'appliance repair Dartford', 'drill repair DA1', 'garden tool repair Dartford', 'equipment servicing Dartford Kent'],
  content_intro = 'ToolServe extends its expert repair services to Dartford and the surrounding Kent areas. Whether you need a power tool repaired or garden equipment serviced, our team delivers quality workmanship at competitive prices.',
  services_offered = ARRAY['Power tool repairs', 'Garden equipment servicing', 'Appliance maintenance', 'Tool testing', 'Blade sharpening', 'Motor servicing', 'Safety inspections'],
  equipment_types = ARRAY['Power Drills', 'Angle Grinders', 'Planers', 'Lawnmowers', 'Strimmers', 'Chainsaws', 'Pressure Washers', 'Sanders'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Milwaukee', 'Black & Decker', 'Stihl', 'Husqvarna', 'Ryobi']
WHERE slug = 'dartford';

UPDATE service_areas SET
  meta_title = 'Tool Repair Woolwich | SE18 Power Tool Servicing | ToolServe',
  meta_description = 'Fast tool repair service in Woolwich SE18. Expert power tool repairs, garden equipment & appliance servicing. Same-day service available for urgent repairs.',
  keywords = ARRAY['tool repair Woolwich', 'power tool repair SE18', 'appliance repair Woolwich', 'tool servicing SE28', 'drill repair Woolwich', 'garden equipment SE18'],
  content_intro = 'Woolwich residents and businesses trust ToolServe for reliable, affordable tool and appliance repairs. Our convenient location and fast turnaround times make us the go-to choice for equipment repairs in SE18.',
  services_offered = ARRAY['Emergency tool repairs', 'Power tool servicing', 'Garden machinery repairs', 'Appliance maintenance', 'Electrical repairs', 'Equipment testing'],
  equipment_types = ARRAY['Power Drills', 'Impact Wrenches', 'Sanders', 'Lawnmowers', 'Hedge Trimmers', 'Pressure Washers', 'Vacuum Cleaners'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Black & Decker', 'Ryobi', 'Karcher', 'Flymo', 'Hoover']
WHERE slug = 'woolwich';

UPDATE service_areas SET
  meta_title = 'Tool Repair Sidcup | Appliance Servicing DA14-DA15 | ToolServe',
  meta_description = 'Professional tool and appliance repair in Sidcup. Quality servicing of power tools, garden equipment across DA14, DA15. Expert repairs, competitive prices.',
  keywords = ARRAY['tool repair Sidcup', 'power tool repair DA14', 'appliance repair Sidcup', 'drill repair DA15', 'garden equipment Sidcup', 'tool servicing Sidcup'],
  content_intro = 'ToolServe provides expert tool and appliance repair services throughout Sidcup and surrounding areas. Our skilled technicians repair everything from power drills to lawnmowers, helping you save money and reduce waste.',
  services_offered = ARRAY['Tool repairs', 'Equipment servicing', 'Appliance maintenance', 'Power tool diagnostics', 'Garden machinery repairs', 'Part replacement'],
  equipment_types = ARRAY['Power Drills', 'Jigsaws', 'Sanders', 'Routers', 'Lawnmowers', 'Strimmers', 'Hedge Cutters', 'Pressure Washers'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Black & Decker', 'Ryobi', 'Milwaukee', 'Karcher']
WHERE slug = 'sidcup';

UPDATE service_areas SET
  meta_title = 'Tool Repair Thamesmead | SE28 Equipment Servicing | ToolServe',
  meta_description = 'Trusted tool repair service in Thamesmead SE28. Professional power tool repairs, garden equipment & appliance servicing. Local, reliable, affordable.',
  keywords = ARRAY['tool repair Thamesmead', 'power tool repair SE28', 'appliance repair Thamesmead', 'drill repair SE2', 'equipment servicing Thamesmead'],
  content_intro = 'Serving Thamesmead with professional tool and appliance repair services. ToolServe offers convenient, affordable repairs for all types of power tools, garden equipment, and small appliances in the SE28 area.',
  services_offered = ARRAY['Power tool repair', 'Garden equipment maintenance', 'Appliance servicing', 'Electrical repairs', 'Tool testing', 'Equipment diagnostics'],
  equipment_types = ARRAY['Electric Drills', 'Sanders', 'Grinders', 'Lawnmowers', 'Hedge Trimmers', 'Pressure Washers', 'Vacuum Cleaners'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Black & Decker', 'Ryobi', 'Karcher', 'Flymo']
WHERE slug = 'thamesmead';

UPDATE service_areas SET
  meta_title = 'Tool Repair Gravesend | Power Tool Servicing DA11-DA13 | ToolServe',
  meta_description = 'Quality tool repair in Gravesend, Kent. Expert power tool, garden equipment & appliance repairs across DA11, DA12, DA13. Professional service, fair prices.',
  keywords = ARRAY['tool repair Gravesend', 'power tool repair Gravesend', 'appliance repair DA11', 'drill repair Gravesend Kent', 'garden tool servicing DA12'],
  content_intro = 'ToolServe brings professional tool and appliance repair services to Gravesend and the surrounding Kent area. Our experienced team handles all types of repairs with expertise and care.',
  services_offered = ARRAY['Power tool repairs', 'Garden machinery servicing', 'Appliance maintenance', 'Tool diagnostics', 'Equipment testing', 'Part sourcing'],
  equipment_types = ARRAY['Power Drills', 'Circular Saws', 'Sanders', 'Lawnmowers', 'Chainsaws', 'Strimmers', 'Pressure Washers'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Milwaukee', 'Black & Decker', 'Stihl', 'Husqvarna']
WHERE slug = 'gravesend';

UPDATE service_areas SET
  meta_title = 'Tool Repair Orpington | Appliance Servicing BR5-BR8 | ToolServe',
  meta_description = 'Expert tool and appliance repair in Orpington. Professional servicing of power tools, garden equipment across BR5, BR6, BR7, BR8. Trusted local service.',
  keywords = ARRAY['tool repair Orpington', 'power tool repair BR5', 'appliance repair Orpington', 'drill repair Bromley', 'garden equipment BR6', 'tool servicing Orpington'],
  content_intro = 'ToolServe offers comprehensive tool and appliance repair services throughout Orpington and the wider Bromley borough. We pride ourselves on quality repairs, honest pricing, and excellent customer service.',
  services_offered = ARRAY['Power tool repair', 'Garden equipment servicing', 'Small appliance repairs', 'Tool maintenance', 'Electrical testing', 'Equipment diagnostics'],
  equipment_types = ARRAY['Power Drills', 'Impact Drivers', 'Sanders', 'Routers', 'Lawnmowers', 'Hedge Cutters', 'Leaf Blowers', 'Pressure Washers'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Black & Decker', 'Ryobi', 'Milwaukee', 'Karcher']
WHERE slug = 'orpington';

UPDATE service_areas SET
  meta_title = 'Tool Repair Bromley | Power Tool Servicing BR1-BR4 | ToolServe',
  meta_description = 'Professional tool repair in Bromley. Expert power tool, garden equipment & appliance servicing across BR1, BR2, BR3, BR4. Fast, reliable, affordable repairs.',
  keywords = ARRAY['tool repair Bromley', 'power tool repair Bromley', 'appliance repair BR1', 'drill repair Bromley', 'garden equipment BR2', 'tool servicing South London'],
  content_intro = 'ToolServe provides expert tool and appliance repair services throughout Bromley borough. From power tools to garden equipment, we offer professional repairs that extend the life of your valuable equipment.',
  services_offered = ARRAY['Power tool repairs', 'Garden machinery maintenance', 'Appliance servicing', 'Tool testing', 'Equipment diagnostics', 'Part replacement', 'Safety checks'],
  equipment_types = ARRAY['Electric Drills', 'Jigsaws', 'Circular Saws', 'Sanders', 'Lawnmowers', 'Strimmers', 'Chainsaws', 'Pressure Washers', 'Vacuum Cleaners'],
  brands_serviced = ARRAY['Bosch', 'DeWalt', 'Makita', 'Black & Decker', 'Ryobi', 'Milwaukee', 'Festool', 'Karcher']
WHERE slug = 'bromley';
