/*
  # Technician Tools - Core Schema

  ## Overview
  Creates foundational database schema for technician-focused features:
  fault codes, service guides, time tracking, and tool models.

  ## New Tables

  ### 1. tool_categories
  Categories for organizing tool types (drills, saws, grinders, etc.)

  ### 2. tool_models
  Specific tool models with make, model, category, and documentation links

  ### 3. fault_codes
  Database of common faults with symptoms, causes, and fixes

  ### 4. service_guides
  Step-by-step repair/service guides for specific tool models

  ### 5. job_fault_codes
  Links diagnosed faults to specific repair jobs

  ### 6. time_logs
  Tracks technician time spent on jobs with activity types

  ## Security
  - All tables have RLS enabled
  - Authenticated users have read access
  - Write access controlled per table
  - Public can view categories and models
*/

-- Create tool_categories table
CREATE TABLE IF NOT EXISTS tool_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create tool_models table
CREATE TABLE IF NOT EXISTS tool_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make text NOT NULL,
  model text NOT NULL,
  category_id uuid REFERENCES tool_categories(id) ON DELETE SET NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  manual_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(make, model)
);

-- Create fault_codes table
CREATE TABLE IF NOT EXISTS fault_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category_id uuid REFERENCES tool_categories(id) ON DELETE SET NULL,
  tool_model_id uuid REFERENCES tool_models(id) ON DELETE SET NULL,
  common_symptoms text DEFAULT '',
  common_causes text DEFAULT '',
  common_fixes text DEFAULT '',
  difficulty_level text DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  estimated_time_minutes integer DEFAULT 0,
  frequency_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_guides table
CREATE TABLE IF NOT EXISTS service_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_model_id uuid REFERENCES tool_models(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text DEFAULT '',
  difficulty_level text DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  estimated_time_minutes integer DEFAULT 0,
  required_tools text DEFAULT '',
  special_notes text DEFAULT '',
  torque_specs text DEFAULT '',
  diagram_url text DEFAULT '',
  video_url text DEFAULT '',
  tags text[] DEFAULT '{}',
  view_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_fault_codes table
CREATE TABLE IF NOT EXISTS job_fault_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES repair_requests(id) ON DELETE CASCADE,
  fault_code_id uuid REFERENCES fault_codes(id) ON DELETE CASCADE,
  confirmed boolean DEFAULT false,
  notes text DEFAULT '',
  diagnosed_at timestamptz DEFAULT now(),
  diagnosed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create time_logs table
CREATE TABLE IF NOT EXISTS time_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES repair_requests(id) ON DELETE CASCADE,
  technician_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type text DEFAULT 'repair' CHECK (activity_type IN ('diagnostic', 'repair', 'testing', 'admin', 'waiting')),
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  duration_minutes integer DEFAULT 0,
  notes text DEFAULT '',
  billable boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tool_models_category ON tool_models(category_id);
CREATE INDEX IF NOT EXISTS idx_tool_models_make ON tool_models(make);
CREATE INDEX IF NOT EXISTS idx_fault_codes_category ON fault_codes(category_id);
CREATE INDEX IF NOT EXISTS idx_fault_codes_tool_model ON fault_codes(tool_model_id);
CREATE INDEX IF NOT EXISTS idx_fault_codes_code ON fault_codes(code);
CREATE INDEX IF NOT EXISTS idx_service_guides_tool_model ON service_guides(tool_model_id);
CREATE INDEX IF NOT EXISTS idx_job_fault_codes_job ON job_fault_codes(job_id);
CREATE INDEX IF NOT EXISTS idx_job_fault_codes_fault ON job_fault_codes(fault_code_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_job ON time_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_technician ON time_logs(technician_id);

-- Enable Row Level Security
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE fault_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_fault_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tool_categories
CREATE POLICY "Anyone can view tool categories"
  ON tool_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage tool categories"
  ON tool_categories FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for tool_models
CREATE POLICY "Anyone can view tool models"
  ON tool_models FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage tool models"
  ON tool_models FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for fault_codes
CREATE POLICY "Authenticated users can view fault codes"
  ON fault_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage fault codes"
  ON fault_codes FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for service_guides
CREATE POLICY "Authenticated users can view service guides"
  ON service_guides FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage service guides"
  ON service_guides FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for job_fault_codes
CREATE POLICY "Authenticated users can view job fault codes"
  ON job_fault_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can add job fault codes"
  ON job_fault_codes FOR INSERT
  TO authenticated
  WITH CHECK (diagnosed_by = auth.uid());

CREATE POLICY "Authenticated users can update their job fault codes"
  ON job_fault_codes FOR UPDATE
  TO authenticated
  USING (diagnosed_by = auth.uid());

CREATE POLICY "Authenticated users can delete their job fault codes"
  ON job_fault_codes FOR DELETE
  TO authenticated
  USING (diagnosed_by = auth.uid());

-- RLS Policies for time_logs
CREATE POLICY "Authenticated users can view time logs"
  ON time_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Technicians can create time logs"
  ON time_logs FOR INSERT
  TO authenticated
  WITH CHECK (technician_id = auth.uid());

CREATE POLICY "Technicians can update their time logs"
  ON time_logs FOR UPDATE
  TO authenticated
  USING (technician_id = auth.uid());

CREATE POLICY "Technicians can delete their time logs"
  ON time_logs FOR DELETE
  TO authenticated
  USING (technician_id = auth.uid());

-- Function to update fault code frequency when diagnosed
CREATE OR REPLACE FUNCTION increment_fault_frequency()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmed = true AND (OLD IS NULL OR OLD.confirmed = false) THEN
    UPDATE fault_codes
    SET frequency_count = frequency_count + 1,
        updated_at = now()
    WHERE id = NEW.fault_code_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment fault frequency
DROP TRIGGER IF EXISTS trigger_increment_fault_frequency ON job_fault_codes;
CREATE TRIGGER trigger_increment_fault_frequency
  AFTER INSERT OR UPDATE ON job_fault_codes
  FOR EACH ROW
  EXECUTE FUNCTION increment_fault_frequency();

-- Function to calculate time log duration
CREATE OR REPLACE FUNCTION calculate_time_log_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
    NEW.duration_minutes := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate duration
DROP TRIGGER IF EXISTS trigger_calculate_duration ON time_logs;
CREATE TRIGGER trigger_calculate_duration
  BEFORE INSERT OR UPDATE ON time_logs
  FOR EACH ROW
  EXECUTE FUNCTION calculate_time_log_duration();

-- Insert sample tool categories
INSERT INTO tool_categories (name, slug, description, icon) VALUES
  ('Power Drills', 'power-drills', 'Corded and cordless drills, hammer drills, rotary hammers', 'Drill'),
  ('Circular Saws', 'circular-saws', 'Handheld circular saws, track saws, cordless saws', 'CircleDot'),
  ('Angle Grinders', 'angle-grinders', 'Small and large angle grinders, cut-off tools', 'Disc'),
  ('Sanders', 'sanders', 'Orbital sanders, belt sanders, detail sanders', 'FileText'),
  ('Hedge Trimmers', 'hedge-trimmers', 'Electric and cordless hedge trimmers', 'Scissors'),
  ('Mitre Saws', 'mitre-saws', 'Compound mitre saws, sliding mitre saws', 'Triangle'),
  ('Planers', 'planers', 'Electric planers, thickness planers', 'Box'),
  ('Routers', 'routers', 'Fixed base and plunge routers', 'Settings')
ON CONFLICT (slug) DO NOTHING;

-- Insert some common fault codes
INSERT INTO fault_codes (code, title, description, common_symptoms, common_causes, common_fixes, difficulty_level, estimated_time_minutes) VALUES
  ('MOTOR_NO_START', 'Motor Does Not Start', 'Motor receives power but does not start or makes humming noise', 'Tool does not turn on, humming sound, burning smell', 'Failed start capacitor, seized bearings, burned windings, thermal overload tripped', 'Check capacitor with multimeter, test thermal overload, inspect bearings, replace motor if windings burned', 'medium', 45),
  ('NO_POWER', 'No Power to Tool', 'Tool is completely dead, no lights or sounds', 'No response when switched on, no LED lights', 'Blown fuse, faulty power cord, bad switch, loose internal connection', 'Test power cord continuity, check fuses, test switch, inspect internal wiring', 'easy', 30),
  ('SWITCH_FAILURE', 'Switch Not Working', 'Power switch does not engage or tool runs continuously', 'Switch stuck, tool won''t turn off, intermittent operation', 'Worn switch contacts, carbon buildup, mechanical damage', 'Replace switch, clean contacts if possible', 'easy', 20),
  ('BRUSH_WEAR', 'Carbon Brushes Worn', 'Excessive sparking, loss of power, intermittent operation', 'Sparking visible through vents, reduced power, tool cuts out', 'Normal wear, poor quality brushes, commutator damage', 'Replace carbon brushes, clean commutator, check spring tension', 'easy', 15),
  ('GEARBOX_NOISE', 'Gearbox Making Noise', 'Grinding, clicking, or whining noise from gearbox', 'Unusual noise during operation, reduced power, metal shavings in grease', 'Worn gears, insufficient lubrication, damaged bearings', 'Disassemble and inspect gears, replace damaged parts, re-grease with proper lubricant', 'hard', 90),
  ('CAPACITOR_FAILURE', 'Start/Run Capacitor Failed', 'Motor hums but does not start, or starts slowly', 'Humming sound, motor does not reach full speed, burning smell', 'Capacitor bulging or leaking, high ESR, age-related failure', 'Test capacitor with capacitance meter, replace if out of spec or visibly damaged', 'medium', 30),
  ('THERMAL_OVERLOAD', 'Thermal Overload Tripped', 'Tool stops during use and will not restart until cool', 'Tool shuts off after heavy use, restart requires waiting period', 'Overloading, blocked ventilation, failed thermal cutout', 'Allow to cool, check thermal cutout with continuity tester, replace if faulty, advise customer on proper use', 'medium', 25),
  ('BEARING_FAILURE', 'Bearing Seized or Noisy', 'Grinding noise, excessive vibration, shaft difficult to turn', 'Loud grinding or squealing, vibration, reduced performance', 'Lack of lubrication, contamination, normal wear, impact damage', 'Replace bearings, check shaft for damage, ensure proper reassembly and lubrication', 'hard', 60)
ON CONFLICT (code) DO NOTHING;
