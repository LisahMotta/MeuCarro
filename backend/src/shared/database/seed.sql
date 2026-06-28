-- MeuCarro — DDL gerado dos schemas Drizzle ORM
-- DROP em ordem inversa de dependência para recriar do zero
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS tire_events CASCADE;
DROP TABLE IF EXISTS tires CASCADE;
DROP TABLE IF EXISTS maintenance_attachments CASCADE;
DROP TABLE IF EXISTS maintenances CASCADE;
DROP TABLE IF EXISTS fuelings CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Remover tipos customizados se existirem
DROP TYPE IF EXISTS plan CASCADE;
DROP TYPE IF EXISTS fuel_type CASCADE;
DROP TYPE IF EXISTS maintenance_category CASCADE;
DROP TYPE IF EXISTS maintenance_status CASCADE;
DROP TYPE IF EXISTS attachment_type CASCADE;
DROP TYPE IF EXISTS tire_position CASCADE;
DROP TYPE IF EXISTS tire_status CASCADE;
DROP TYPE IF EXISTS tire_event_type CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS document_status CASCADE;
DROP TYPE IF EXISTS alert_type CASCADE;
DROP TYPE IF EXISTS alert_severity CASCADE;

-- Enums
CREATE TYPE plan AS ENUM ('free', 'premium');
CREATE TYPE fuel_type AS ENUM ('gasoline', 'ethanol', 'flex', 'diesel', 'electric', 'hybrid');
CREATE TYPE maintenance_category AS ENUM (
  'oil_change', 'oil_filter', 'air_filter', 'fuel_filter', 'brake_pads',
  'brake_disc', 'brake_fluid', 'suspension', 'shock_absorber', 'alignment',
  'balancing', 'rotation', 'tires', 'clutch', 'transmission', 'steering',
  'battery', 'timing_belt', 'air_conditioning', 'engine', 'electrical',
  'body_repair', 'washing', 'general_revision', 'other'
);
CREATE TYPE maintenance_status AS ENUM ('completed', 'scheduled', 'overdue');
CREATE TYPE attachment_type AS ENUM ('photo', 'invoice', 'other');
CREATE TYPE tire_position AS ENUM ('FL', 'FR', 'RL', 'RR', 'spare');
CREATE TYPE tire_status AS ENUM ('active', 'replaced', 'spare');
CREATE TYPE tire_event_type AS ENUM ('rotation', 'calibration', 'repair', 'replacement');
CREATE TYPE document_type AS ENUM ('insurance', 'ipva', 'licensing', 'fine', 'inspection', 'crlv', 'other');
CREATE TYPE document_status AS ENUM ('active', 'expired', 'cancelled');
CREATE TYPE alert_type AS ENUM ('oil_change', 'rotation', 'revision', 'timing_belt', 'insurance', 'ipva', 'licensing', 'cnh', 'warranty', 'custom');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'urgent', 'critical');

-- users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  plan plan NOT NULL DEFAULT 'free',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- refresh_tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  version VARCHAR(100),
  plate VARCHAR(10),
  chassis VARCHAR(17),
  renavam VARCHAR(11),
  color VARCHAR(30),
  current_km INTEGER NOT NULL DEFAULT 0,
  fuel_type fuel_type NOT NULL DEFAULT 'flex',
  tank_capacity DECIMAL(5,2),
  oil_type VARCHAR(50),
  oil_quantity DECIMAL(3,1),
  tire_size VARCHAR(20),
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX vehicles_user_id_idx ON vehicles(user_id);
CREATE INDEX vehicles_plate_idx ON vehicles(plate);

-- fuelings
CREATE TABLE fuelings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  odometer INTEGER NOT NULL,
  station_name VARCHAR(100),
  city VARCHAR(100),
  fuel_type fuel_type NOT NULL,
  liters DECIMAL(8,3) NOT NULL,
  price_per_liter DECIMAL(8,3) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  full_tank BOOLEAN NOT NULL DEFAULT false,
  partial_tank BOOLEAN NOT NULL DEFAULT false,
  consumption DECIMAL(6,3),
  autonomy DECIMAL(8,2),
  cost_per_km DECIMAL(8,4),
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX fuelings_vehicle_date_idx ON fuelings(vehicle_id, date);
CREATE INDEX fuelings_vehicle_odometer_idx ON fuelings(vehicle_id, odometer);

-- maintenances
CREATE TABLE maintenances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  odometer INTEGER NOT NULL,
  category maintenance_category NOT NULL,
  shop_name VARCHAR(100),
  mechanic_name VARCHAR(100),
  labor_cost DECIMAL(10,2) DEFAULT 0,
  parts_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) NOT NULL,
  warranty_until DATE,
  next_service_date DATE,
  next_service_km INTEGER,
  notes TEXT,
  status maintenance_status NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX maintenances_vehicle_date_idx ON maintenances(vehicle_id, date);
CREATE INDEX maintenances_vehicle_category_idx ON maintenances(vehicle_id, category);
CREATE INDEX maintenances_vehicle_next_km_idx ON maintenances(vehicle_id, next_service_km);

-- maintenance_attachments
CREATE TABLE maintenance_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_id UUID NOT NULL REFERENCES maintenances(id) ON DELETE CASCADE,
  type attachment_type NOT NULL,
  url TEXT NOT NULL,
  filename VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- tires
CREATE TABLE tires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  brand VARCHAR(50),
  model VARCHAR(100),
  size VARCHAR(20),
  dot VARCHAR(8),
  purchase_price DECIMAL(10,2),
  purchase_date DATE,
  install_km INTEGER,
  position tire_position,
  estimated_life_km INTEGER,
  status tire_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX tires_vehicle_idx ON tires(vehicle_id);

-- tire_events
CREATE TABLE tire_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tire_id UUID REFERENCES tires(id) ON DELETE SET NULL,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  odometer INTEGER,
  type tire_event_type NOT NULL,
  pressure_fl DECIMAL(4,1),
  pressure_fr DECIMAL(4,1),
  pressure_rl DECIMAL(4,1),
  pressure_rr DECIMAL(4,1),
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  title VARCHAR(100) NOT NULL,
  issuer VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  value DECIMAL(10,2),
  status document_status NOT NULL DEFAULT 'active',
  file_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX documents_vehicle_type_idx ON documents(vehicle_id, type);
CREATE INDEX documents_vehicle_expiry_idx ON documents(vehicle_id, expiry_date);

-- alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type alert_type NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  severity alert_severity NOT NULL DEFAULT 'info',
  trigger_date DATE,
  trigger_km INTEGER,
  reference_id UUID,
  reference_type VARCHAR(50),
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX alerts_user_read_idx ON alerts(user_id, is_read);
CREATE INDEX alerts_vehicle_date_idx ON alerts(vehicle_id, trigger_date);
