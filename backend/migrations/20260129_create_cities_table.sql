-- Create cities table per provided schema (with status)

CREATE TABLE IF NOT EXISTS cities (
  city_id INT AUTO_INCREMENT PRIMARY KEY,
  city_name VARCHAR(100) NOT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ensure status column exists if table was created earlier without it (MySQL 8+)
ALTER TABLE cities ADD COLUMN IF NOT EXISTS status TINYINT(1) NOT NULL DEFAULT 1;

-- Seed cities using idempotent inserts (skip if already present)
INSERT INTO cities (city_name, status) 
SELECT 'Colombo', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Colombo');
INSERT INTO cities (city_name, status) 
SELECT 'Kandy', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Kandy');
INSERT INTO cities (city_name, status) 
SELECT 'Galle', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Galle');
INSERT INTO cities (city_name, status) 
SELECT 'Matara', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Matara');
INSERT INTO cities (city_name, status) 
SELECT 'Negombo', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Negombo');
INSERT INTO cities (city_name, status) 
SELECT 'Kurunegala', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Kurunegala');
INSERT INTO cities (city_name, status) 
SELECT 'Jaffna', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Jaffna');
INSERT INTO cities (city_name, status) 
SELECT 'Batticaloa', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Batticaloa');
INSERT INTO cities (city_name, status) 
SELECT 'Trincomalee', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Trincomalee');
INSERT INTO cities (city_name, status) 
SELECT 'Anuradhapura', 1 WHERE NOT EXISTS (SELECT 1 FROM cities WHERE city_name = 'Anuradhapura');
