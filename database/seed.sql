USE restaurant_erp_pro;

INSERT INTO roles (id, name, description) VALUES
(1, 'Admin', 'Full system access'),
(2, 'Manager', 'Restaurant operations and reporting'),
(3, 'Waiter', 'Table service and order creation'),
(4, 'Chef', 'Kitchen display and preparation workflow'),
(5, 'Cashier', 'Billing and payment processing'),
(6, 'Customer', 'Ordering, reservations, reviews, and profile');

INSERT INTO users (id, role_id, name, email, password_hash, phone, address, status) VALUES
(1, 1, 'Aarav Admin', 'admin@restaurant.com', '$2a$10$EL8lCFERGUUPR373rdstLu9ls26MBmVFTezpEozFJ7OGDZZXDkvbm', '+91 90000 00001', 'RestaurantERP HQ', 'Active'),
(2, 2, 'Meera Manager', 'manager@restaurant.com', '$2a$10$TguQxW/wdq4yE.quV7/b4eieH1Wb74G1Ud8PjjPJdSX68ujr4K2Oe', '+91 90000 00002', 'Bengaluru', 'Active'),
(3, 4, 'Kabir Chef', 'chef@restaurant.com', '$2a$10$aKNHdXipodScSKsZ/cJwO.5OQF5w4wAcuYjDbLi74961MnIbGhRF.', '+91 90000 00003', 'Bengaluru', 'Active'),
(4, 5, 'Nisha Cashier', 'cashier@restaurant.com', '$2a$10$Uu7.rDQewhgtBqQ7EZbQk.A.c1YMQncBCzcVjt2oJvGlCujZ6k3iy', '+91 90000 00004', 'Bengaluru', 'Active'),
(5, 3, 'Rohan Waiter', 'waiter@restaurant.com', '$2a$10$1k/c4q0P0JtdeoiZcc2leuiNfv7S.xfbJXXHVS3Zl.SeSZqwChwg6', '+91 90000 00005', 'Bengaluru', 'Active'),
(6, 6, 'Diya Customer', 'customer@restaurant.com', '$2a$10$e2wv.hZaAYmds36CbpRcJ.WY/F5Dy7PtdPnSDyHgOBi94x/abIjM.', '+91 90000 00006', 'Bengaluru', 'Active');

INSERT INTO staff (user_id, position, salary, joining_date, shift) VALUES
(1, 'Owner Administrator', 90000.00, '2024-01-01', 'Flexible'),
(2, 'Restaurant Manager', 65000.00, '2024-02-01', 'Flexible'),
(3, 'Head Chef', 52000.00, '2024-02-10', 'Evening'),
(4, 'Cashier', 32000.00, '2024-03-01', 'Morning'),
(5, 'Senior Waiter', 28000.00, '2024-03-05', 'Evening');

INSERT INTO menu_categories (id, name, description) VALUES
(1, 'Starters', 'Appetizers and small plates'),
(2, 'Soups', 'Warm comforting soups'),
(3, 'Main Course', 'Signature family restaurant mains'),
(4, 'South Indian', 'Regional southern favorites'),
(5, 'North Indian', 'Rich gravies and breads'),
(6, 'Chinese', 'Indo-Chinese classics'),
(7, 'Desserts', 'Sweet finishes'),
(8, 'Beverages', 'Cold and hot drinks');

INSERT INTO menu_items (category_id, name, description, price, image_url, is_veg, spice_level, is_available) VALUES
(1, 'Paneer Tikka', 'Char-grilled cottage cheese with peppers and mint chutney.', 220.00, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80', TRUE, 'Medium', TRUE),
(1, 'Chicken 65', 'Crispy southern-style chicken tossed with curry leaves.', 260.00, 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=900&q=80', FALSE, 'Hot', TRUE),
(1, 'Crispy Corn', 'Golden fried corn with spring onion and pepper.', 180.00, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(1, 'Hara Bhara Kebab', 'Spinach, peas, and potato patties with coriander dip.', 190.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(2, 'Tomato Basil Soup', 'Slow-cooked tomato soup finished with fresh basil.', 130.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(2, 'Sweet Corn Soup', 'Creamy sweet corn soup with garden vegetables.', 140.00, 'https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(2, 'Hot and Sour Soup', 'Peppery broth with mushrooms, tofu, and vegetables.', 150.00, 'https://images.unsplash.com/photo-1613844237701-8f3664fc2eff?auto=format&fit=crop&w=900&q=80', TRUE, 'Hot', TRUE),
(2, 'Chicken Manchow Soup', 'Hearty chicken soup with crisp noodles.', 170.00, 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=900&q=80', FALSE, 'Medium', TRUE),
(3, 'Veg Biryani', 'Aromatic basmati rice layered with vegetables and spices.', 260.00, 'https://images.unsplash.com/photo-1631515242808-497c3fbd3972?auto=format&fit=crop&w=900&q=80', TRUE, 'Medium', TRUE),
(3, 'Chicken Biryani', 'Hyderabadi-style chicken biryani with raita.', 320.00, 'https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=80', FALSE, 'Medium', TRUE),
(3, 'Fish Curry Meals', 'Coastal fish curry served with rice and sides.', 360.00, 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=900&q=80', FALSE, 'Medium', TRUE),
(3, 'Mutton Rogan Josh', 'Slow-cooked lamb curry with Kashmiri spices.', 420.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80', FALSE, 'Hot', TRUE),
(4, 'Masala Dosa', 'Crisp dosa filled with potato masala and chutneys.', 160.00, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(4, 'Idli Vada Combo', 'Soft idlis and crunchy vada with sambar.', 140.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(4, 'Ghee Podi Dosa', 'Dosa brushed with ghee and spicy podi.', 180.00, 'https://images.unsplash.com/photo-1694849789325-914b71ab4075?auto=format&fit=crop&w=900&q=80', TRUE, 'Medium', TRUE),
(4, 'South Indian Meals', 'Rice, sambar, rasam, poriyal, papad, and dessert.', 240.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80', TRUE, 'Medium', TRUE),
(5, 'Butter Naan', 'Tandoor-baked naan brushed with butter.', 60.00, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(5, 'Dal Makhani', 'Black lentils simmered overnight with butter.', 240.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(5, 'Paneer Butter Masala', 'Cottage cheese in rich tomato-cashew gravy.', 280.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(5, 'Chicken Tikka Masala', 'Tandoori chicken simmered in silky spiced gravy.', 340.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80', FALSE, 'Medium', TRUE),
(6, 'Veg Hakka Noodles', 'Wok-tossed noodles with crisp vegetables.', 210.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80', TRUE, 'Medium', TRUE),
(6, 'Chicken Fried Rice', 'Smoky fried rice with chicken, egg, and scallions.', 240.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80', FALSE, 'Medium', TRUE),
(6, 'Gobi Manchurian', 'Crispy cauliflower in tangy Manchurian sauce.', 220.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80', TRUE, 'Hot', TRUE),
(6, 'Schezwan Prawns', 'Prawns tossed in bold Schezwan sauce.', 390.00, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80', FALSE, 'Hot', TRUE),
(7, 'Gulab Jamun', 'Warm milk-solid dumplings in saffron syrup.', 110.00, 'https://images.unsplash.com/photo-1605197183305-6b2d3e1a1f50?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(7, 'Brownie With Ice Cream', 'Chocolate brownie served with vanilla ice cream.', 180.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(7, 'Rasmalai', 'Soft cottage cheese patties soaked in saffron milk.', 150.00, 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(7, 'Tender Coconut Pudding', 'Light coconut pudding with roasted nuts.', 170.00, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(8, 'Fresh Lime Soda', 'Sweet, salt, or mixed sparkling lime cooler.', 90.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(8, 'Mango Lassi', 'Thick yogurt drink blended with mango pulp.', 130.00, 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(8, 'Masala Chai', 'Indian tea brewed with ginger and spices.', 60.00, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE),
(8, 'Cold Coffee', 'Chilled coffee blended with milk and ice cream.', 150.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80', TRUE, 'Mild', TRUE);

INSERT INTO `tables` (id, table_number, capacity, status, current_waiter_id) VALUES
(1, 'T1', 2, 'Available', 5),
(2, 'T2', 4, 'Occupied', 5),
(3, 'T3', 4, 'Reserved', 5),
(4, 'T4', 6, 'Available', NULL),
(5, 'T5', 8, 'Cleaning', NULL),
(6, 'T6', 2, 'Available', NULL),
(7, 'T7', 4, 'Available', 5),
(8, 'T8', 6, 'Reserved', NULL);

INSERT INTO reservations (customer_id, table_id, reservation_date, reservation_time, guests, special_request, status) VALUES
(6, 3, CURDATE(), '19:30:00', 4, 'Window side table preferred', 'Approved'),
(6, NULL, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', 3, 'Birthday dessert request', 'Pending'),
(6, 8, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '13:00:00', 6, 'Need high chair', 'Approved');

INSERT INTO orders (id, customer_id, waiter_id, table_id, order_type, status, subtotal, tax, discount, total, notes, created_at) VALUES
(1, 6, 5, 2, 'Dine In', 'Preparing', 700.00, 35.00, 0.00, 735.00, 'Less spicy for one portion', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 6, NULL, NULL, 'Takeaway', 'Completed', 470.00, 23.50, 0.00, 493.50, 'Pack chutney separately', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 6, NULL, NULL, 'Delivery', 'Pending', 390.00, 19.50, 20.00, 389.50, 'Call before delivery', NOW());

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, line_total, item_status, special_instruction) VALUES
(1, 1, 1, 220.00, 220.00, 'Preparing', NULL),
(1, 10, 1, 320.00, 320.00, 'Preparing', 'Less spice'),
(1, 30, 1, 150.00, 150.00, 'Pending', NULL),
(1, 29, 1, 90.00, 90.00, 'Ready', NULL),
(2, 13, 2, 160.00, 320.00, 'Ready', NULL),
(2, 29, 1, 90.00, 90.00, 'Ready', NULL),
(2, 31, 1, 60.00, 60.00, 'Ready', NULL),
(3, 21, 1, 210.00, 210.00, 'Pending', NULL),
(3, 26, 1, 180.00, 180.00, 'Pending', NULL);

INSERT INTO payments (order_id, cashier_id, amount, method, status, transaction_reference, paid_at) VALUES
(2, 4, 493.50, 'Card', 'Paid', 'CARD-SEED-1002', DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO reviews (customer_id, order_id, food_rating, service_rating, comment, status, created_at) VALUES
(6, 2, 5, 5, 'Excellent dosa and quick service. The packaging was neat too.', 'Approved', DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(6, 1, 4, 5, 'Family-friendly place with attentive staff and flavorful starters.', 'Approved', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(6, NULL, 4, 4, 'Nice ambience and a strong multi-cuisine menu.', 'Pending', NOW());

INSERT INTO notifications (user_id, role_id, title, message, type) VALUES
(3, NULL, 'New kitchen order', 'Order #3 has been placed and is waiting for acceptance.', 'Order'),
(NULL, 2, 'Reservation pending', 'A customer reservation needs approval.', 'Reservation'),
(4, NULL, 'Bill ready', 'Completed takeaway order #2 is ready in billing records.', 'Payment');

INSERT INTO activity_logs (user_id, action, entity, entity_id, metadata, ip_address) VALUES
(1, 'seed_imported', 'system', NULL, JSON_OBJECT('source', 'seed.sql'), '127.0.0.1'),
(6, 'review_created', 'reviews', 1, JSON_OBJECT('rating', 5), '127.0.0.1');
