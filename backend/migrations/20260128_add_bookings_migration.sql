-- Migration: 2026-01-28_add_bookings_migration.sql
-- UP: create bookings table if missing, or alter to add booking_status and indexes
-- DOWN: drop bookings table

-- ======================
-- UP
-- ======================
/*
  Safe create: if `bookings` doesn't exist, create it with the required columns and FKs.
  If it already exists, add the `booking_status` column (if missing) and indexes.
*/

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  schedule_id INT NOT NULL,
  seat_id INT NOT NULL,
  passenger_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  booking_status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  booking_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id) ON DELETE CASCADE,
  CONSTRAINT fk_bookings_seat FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- If table existed already, ensure booking_status column exists (MySQL 8+ supports IF NOT EXISTS)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed';

-- Add useful indexes to speed up availability checks and admin queries
-- Many MySQL versions don't support CREATE INDEX IF NOT EXISTS; using ALTER TABLE ADD INDEX which ignores a same-name index
ALTER TABLE bookings ADD INDEX idx_bookings_schedule_seat (schedule_id, seat_id, booking_status);
ALTER TABLE bookings ADD INDEX idx_bookings_time (booking_time);

-- ======================
-- DOWN
-- ======================
-- Use the DOWN section to rollback (drop table). Be careful: this will delete booking data.
-- Uncomment to run rollback.
-- DROP TABLE IF EXISTS bookings;
