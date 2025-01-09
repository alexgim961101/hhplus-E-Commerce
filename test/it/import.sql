-- User 데이터 삽입
INSERT INTO user (email, password, name, points) VALUES
('test1@example.com', 'password123', 'Test User 1', 10000),
('test2@example.com', 'password123', 'Test User 2', 5000),
('test3@example.com', 'password123', 'Test User 3', 15000);

-- Coupon 데이터 삽입
INSERT INTO coupon (title, description, discount_type, discount_amount, valid_from, valid_to, max_count, current_count) VALUES
('신규가입 할인쿠폰', '신규 가입 고객 대상 10% 할인 쿠폰', 'PERCENTAGE', 10, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1000, 50),
('여름 시즌 할인', '여름 시즌 특별 20% 할인 쿠폰', 'PERCENTAGE', 20, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 500, 100),
('특별 정액 할인', '5000원 정액 할인 쿠폰', 'FIXED_AMOUNT', 5000, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 200, 30);

-- CouponHistory 데이터 삽입
INSERT INTO coupon_history (user_id, coupon_id, is_used) VALUES
(1, 1, false),
(1, 2, false),
(1, 3, true),
(2, 1, false),
(2, 2, true),
(3, 3, false);

-- PointHistory 데이터 삽입
INSERT INTO point_history (user_id, points, transaction_type) VALUES
(1, 10000, 'CHARGE'),
(1, 3000, 'USE'),
(1, 1000, 'REFUND'),
(2, 5000, 'CHARGE'),
(2, 1000, 'USE'),
(3, 15000, 'CHARGE');
