-- User 데이터 삽입
INSERT INTO User (points) VALUES
(1000000),
(50000),
(150000);

-- Coupon 데이터 삽입
INSERT INTO Coupon (title, description, discountType, discountAmount, validFrom, validTo, maxCount, currentCount) VALUES
('신규가입 할인쿠폰', '신규 가입 고객 대상 10% 할인 쿠폰', 'PERCENTAGE', 10, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1000, 50),
('여름 시즌 할인', '여름 시즌 특별 20% 할인 쿠폰', 'PERCENTAGE', 20, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 500, 100),
('특별 정액 할인', '5000원 정액 할인 쿠폰', 'FIXED_AMOUNT', 5000, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 200, 30),
('선착순 한정 쿠폰', '선착순 30명 한정 특별 할인 쿠폰', 'PERCENTAGE', 30, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 30, 0),
('품절 임박 쿠폰', '1명 남은 한정 쿠폰', 'PERCENTAGE', 50, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 1, 0),
('품절된 쿠폰', '이미 소진된 쿠폰', 'PERCENTAGE', 20, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 100, 100),
('테스트용 동시성 쿠폰', '동시성 테스트용 쿠폰', 'PERCENTAGE', 10, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 2, 0);

-- CouponHistory 데이터 삽입
INSERT INTO CouponHistory (userId, couponId, isUsed) VALUES
(1, 1, false),
(1, 2, false),
(1, 3, true),
(2, 1, false),
(2, 2, true),
(3, 3, false),
(1, 7, false);

-- PointHistory 데이터 삽입
INSERT INTO PointHistory (userId, points, transactionType) VALUES
(1, 10000, 'CHARGE'),
(1, 3000, 'USE'),
(2, 5000, 'CHARGE'),
(2, 1000, 'USE'),
(3, 15000, 'CHARGE');

-- Product 데이터 삽입
INSERT INTO Product (name, description, price, stock) VALUES
('상품1', '상품1 설명', 10000, 10),
('상품2', '상품2 설명', 20000, 20),
('상품3', '상품3 설명', 30000, 30);
