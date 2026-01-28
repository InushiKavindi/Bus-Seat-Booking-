CREATE TABLE routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    from_city VARCHAR(50),
    to_city VARCHAR(50)
);

CREATE TABLE buses (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_name VARCHAR(50),
    total_seats INT
);

CREATE TABLE schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT,
    bus_id INT,
    travel_date DATE,
    travel_time TIME,
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id)
);

CREATE TABLE seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    seat_no VARCHAR(5),
    status ENUM('available', 'booked') DEFAULT 'available',
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id)
);

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT,
    seat_id INT,
    passenger_name VARCHAR(100),
    phone VARCHAR(15),
    booking_status ENUM('confirmed','cancelled') DEFAULT 'confirmed',
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

-- indexes for performance
CREATE INDEX idx_bookings_schedule_seat ON bookings (schedule_id, seat_id, booking_status);
CREATE INDEX idx_seats_bus_seatno ON seats (bus_id, seat_no);

--seed data
INSERT INTO routes (from_city, to_city)
VALUES ('Colombo', 'Kandy'), ('Galle', 'Colombo');

INSERT INTO buses (bus_name, total_seats) VALUES ('Bus A', 40);
INSERT INTO buses (bus_name, total_seats) VALUES ('Bus B', 40);

INSERT INTO schedules (route_id, bus_id, travel_date, travel_time)
VALUES 
(1, 1, '2026-02-01', '08:00:00'),
(1, 2, '2026-02-01', '14:00:00'),
(2, 1, '2026-02-02', '09:00:00');

-- seed seats for Bus 1 (1..40)
INSERT INTO seats (bus_id, seat_no) VALUES
(1, '1'), (1, '2'), (1, '3'), (1, '4'), (1, '5'), (1, '6'), (1, '7'), (1, '8'), (1, '9'), (1, '10'),
(1, '11'), (1, '12'), (1, '13'), (1, '14'), (1, '15'), (1, '16'), (1, '17'), (1, '18'), (1, '19'), (1, '20'),
(1, '21'), (1, '22'), (1, '23'), (1, '24'), (1, '25'), (1, '26'), (1, '27'), (1, '28'), (1, '29'), (1, '30'),
(1, '31'), (1, '32'), (1, '33'), (1, '34'), (1, '35'), (1, '36'), (1, '37'), (1, '38'), (1, '39'), (1, '40');

-- seed seats for Bus 2 (1..40)
INSERT INTO seats (bus_id, seat_no) VALUES
(2, '1'), (2, '2'), (2, '3'), (2, '4'), (2, '5'), (2, '6'), (2, '7'), (2, '8'), (2, '9'), (2, '10'),
(2, '11'), (2, '12'), (2, '13'), (2, '14'), (2, '15'), (2, '16'), (2, '17'), (2, '18'), (2, '19'), (2, '20'),
(2, '21'), (2, '22'), (2, '23'), (2, '24'), (2, '25'), (2, '26'), (2, '27'), (2, '28'), (2, '29'), (2, '30'),
(2, '31'), (2, '32'), (2, '33'), (2, '34'), (2, '35'), (2, '36'), (2, '37'), (2, '38'), (2, '39'), (2, '40');