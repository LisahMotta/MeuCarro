-- MeuCarro — DDL completo para produção
-- Execute: psql $DATABASE_URL -f seed.sql

-- Enums (safe creation via DO block)
DO $$ BEGIN
  CREATE TYPE plan_enum AS ENUM ('free', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE fuel_type_enum AS ENUM ('gasoline', 'ethanol', 'flex', 'diesel', 'gnv', 'electric', 'hybrid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_category_enum AS ENUM (
    'oil_change','filter_air','filter_fuel','filter_cabin','filter_oil',
    'brake_pads','brake_discs','brake_fluid','tires','wheel_alignment',
    'wheel_balancing','rotation','suspension','shock_absorbers','steering',
    'timing_belt','serpentine_belt','spark_plugs','battery','alternator',
    'starter','ac_service','ac_recharge','coolant','transmission',
    'clutch','fuel_pump','injectors','general_revision','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_status_enum AS ENUM ('pending','completed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tire_position_enum AS ENUM ('FL','FR','RL','RR','spare');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tire_status_enum AS ENUM ('active','worn','replaced','stored');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tire_event_type_enum AS ENUM ('calibration','rotation','replacement','alignment','balancing','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE document_type_enum AS ENUM ('insurance','ipva','licensing','fine','inspection','crlv','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE document_status_enum AS ENUM ('active','expired','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE alert_type_enum AS ENUM ('oil_change','rotation','revision','timing_belt','insurance','ipva','licensing','tire_pressure','battery','custom');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE alert_severity_enum AS ENUM ('info','warning','urgent','critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tabelas
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  plan plan_enum NOT NULL DEFAULT 'free',
  avatar VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  plate VARCHAR(20),
  color VARCHAR(50),
  fuel_type fuel_type_enum,
  current_km INTEGER NOT NULL DEFAULT 0,
  photo VARCHAR(500),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);

CREATE TABLE IF NOT EXISTS fuelings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date VARCHAR(10) NOT NULL,
  odometer INTEGER NOT NULL,
  liters NUMERIC(8,3) NOT NULL,
  price_per_liter NUMERIC(8,3) NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL,
  fuel_type VARCHAR(50),
  full_tank BOOLEAN NOT NULL DEFAULT true,
  station VARCHAR(255),
  notes TEXT,
  consumption NUMERIC(6,3),
  autonomy NUMERIC(8,2),
  cost_per_km NUMERIC(8,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fuelings_vehicle_date ON fuelings(vehicle_id, date);
CREATE INDEX IF NOT EXISTS idx_fuelings_vehicle_odometer ON fuelings(vehicle_id, odometer);

CREATE TABLE IF NOT EXISTS maintenances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category maintenance_category_enum NOT NULL,
  date VARCHAR(10) NOT NULL,
  odometer INTEGER,
  labor_cost NUMERIC(10,2),
  parts_cost NUMERIC(10,2),
  total_cost NUMERIC(10,2),
  shop VARCHAR(255),
  notes TEXT,
  status maintenance_status_enum NOT NULL DEFAULT 'completed',
  next_service_km INTEGER,
  next_service_date VARCHAR(10),
  warranty_until VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_id UUID NOT NULL REFERENCES maintenances(id) ON DELETE CASCADE,
  filename VARCHAR(500) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  size VARCHAR(50) NOT NULL,
  position tire_position_enum NOT NULL,
  status tire_status_enum NOT NULL DEFAULT 'active',
  purchase_date VARCHAR(10),
  purchase_price NUMERIC(10,2),
  odometer_installed INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tire_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  event_type tire_event_type_enum NOT NULL,
  date VARCHAR(10) NOT NULL,
  odometer INTEGER,
  cost NUMERIC(10,2),
  shop VARCHAR(255),
  description TEXT,
  pressure_fl NUMERIC(4,1),
  pressure_fr NUMERIC(4,1),
  pressure_rl NUMERIC(4,1),
  pressure_rr NUMERIC(4,1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type document_type_enum NOT NULL,
  title VARCHAR(255) NOT NULL,
  issue_date VARCHAR(10),
  expiry_date VARCHAR(10),
  value NUMERIC(10,2),
  insurer VARCHAR(255),
  policy_number VARCHAR(100),
  notes TEXT,
  file_path VARCHAR(500),
  status document_status_enum NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_documents_vehicle_type ON documents(vehicle_id, type);
CREATE INDEX IF NOT EXISTS idx_documents_vehicle_expiry ON documents(vehicle_id, expiry_date);

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type alert_type_enum NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity alert_severity_enum NOT NULL DEFAULT 'info',
  trigger_date VARCHAR(10),
  trigger_km INTEGER,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  reference_id UUID,
  reference_type VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_alerts_user_read ON alerts(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_alerts_vehicle ON alerts(vehicle_id, trigger_date);
