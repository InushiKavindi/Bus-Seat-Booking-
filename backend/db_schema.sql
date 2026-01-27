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
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

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