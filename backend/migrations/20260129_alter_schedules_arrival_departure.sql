-- Migration: alter schedules to use arrival/departure times and add type/status

-- 1) Add new time columns (nullable for backfill)
ALTER TABLE schedules 
  ADD COLUMN arrival_time TIME,
  ADD COLUMN departure_time TIME;

-- 2) Backfill departure_time from existing travel_time
UPDATE schedules 
SET departure_time = travel_time 
WHERE schedule_id > 0; -- Safe-update friendly WHERE using key column

-- 3) Add type (weekday/weekend) using existing travel_date
ALTER TABLE schedules 
  ADD COLUMN type ENUM('weekday','weekend') NOT NULL DEFAULT 'weekday';

UPDATE schedules 
SET type = CASE 
  WHEN DAYOFWEEK(travel_date) IN (1,7) THEN 'weekend' 
  ELSE 'weekday' 
END 
WHERE schedule_id > 0; -- Safe-update friendly WHERE using key column

-- 4) Add status boolean (TINYINT(1) in MySQL)
ALTER TABLE schedules 
  ADD COLUMN status TINYINT(1) NOT NULL DEFAULT 1;

-- 5) Drop old columns
ALTER TABLE schedules 
  DROP COLUMN travel_date,
  DROP COLUMN travel_time;
