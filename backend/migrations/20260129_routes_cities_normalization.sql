-- Migration: normalize routes to use city IDs and add route_no

-- 1) Add route number (nullable; adjust NOT NULL/UNIQUE as needed)
ALTER TABLE routes ADD COLUMN route_no VARCHAR(20);

-- 2) Add city id columns for safe backfill
ALTER TABLE routes 
  ADD COLUMN from_city_id INT,
  ADD COLUMN to_city_id INT;

-- 3) Backfill IDs from existing name columns (requires cities table populated)
UPDATE routes r
JOIN cities cf ON cf.city_name = r.from_city
JOIN cities ct ON ct.city_name = r.to_city
SET r.from_city_id = cf.city_id,
  r.to_city_id   = ct.city_id
WHERE r.route_id > 0; -- Safe-update friendly WHERE using key column

-- 4) Drop old VARCHAR columns to free names
ALTER TABLE routes 
  DROP COLUMN from_city,
  DROP COLUMN to_city;

-- 5) Rename id columns back to original names (MySQL 5.7+ compatible)
ALTER TABLE routes 
  CHANGE COLUMN from_city_id from_city INT,
  CHANGE COLUMN to_city_id to_city INT;

-- 6) Add foreign keys to cities
ALTER TABLE routes 
  ADD CONSTRAINT fk_routes_from_city FOREIGN KEY (from_city) REFERENCES cities(city_id),
  ADD CONSTRAINT fk_routes_to_city   FOREIGN KEY (to_city)   REFERENCES cities(city_id);

-- Optional: make route_no unique if needed
-- ALTER TABLE routes ADD UNIQUE INDEX idx_routes_route_no (route_no);
