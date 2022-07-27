INSERT INTO users (name, email, password)
VALUES ('Bob Bobert', 'bob@example.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jean Grey', 'pheonix@xavier.mut', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Steve Rogers', 'americaiscool@aol.org', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Castle', 'Description', 'example1.url', 'example2.url', 10000, 1, 2, 3, 'Canady', 'example street', 'example city', 'example province', 'example postal'),
(2, 'Apartment', 'Description', 'example1.url', 'example2.url', 100, 1, 2, 3, 'Canady', 'example street', 'example city', 'example province', 'example postal'),
(3, 'House', 'Description', 'example1.url', 'example2.url', 300, 1, 2, 3, 'Canady', 'example street', 'example city', 'example province', 'example postal');


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 5, 'example message'),
(2, 2, 2, 3, 'example message'),
(3, 3, 3, 4, 'example message');