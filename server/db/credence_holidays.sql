-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Oct 28, 2026 at 06:47 AM
-- Server version: 5.7.39
-- PHP Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `credence_holidays`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_ref` varchar(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `package_id` int(11) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `travel_date` date NOT NULL,
  `num_adults` int(11) NOT NULL DEFAULT '1',
  `num_children` int(11) DEFAULT '0',
  `special_requests` text,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `payment_status` enum('unpaid','partial','paid','refunded') DEFAULT 'unpaid',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(300) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `replied` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

CREATE TABLE `destinations` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `country` varchar(100) NOT NULL,
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`id`, `name`, `slug`, `country`, `description`, `image`, `featured`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Goa', 'goa', 'India', 'Sun, sand, and spectacular beaches await you in Goa.', '/images/destinations/goa.jpg', 1, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(2, 'Kerala', 'kerala', 'India', 'Gods Own Country - lush greenery, backwaters and serene beauty.', '/images/destinations/kerala.jpg', 1, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(3, 'Rajasthan', 'rajasthan', 'India', 'The Land of Kings - majestic forts, palaces and desert landscapes.', '/images/destinations/rajasthan.jpg', 1, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(4, 'Maldives', 'maldives', 'Maldives', 'Crystal clear waters and luxury overwater villas.', '/images/destinations/maldives.jpg', 1, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(5, 'Bali', 'bali', 'Indonesia', 'Tropical paradise with stunning temples and rice terraces.', '/images/destinations/bali.jpg', 1, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(6, 'Dubai', 'dubai', 'UAE', 'A city of superlatives - tallest, biggest, and most luxurious.', '/images/destinations/dubai.jpg', 1, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(7, 'Thailand', 'thailand', 'Thailand', 'Exotic beaches, ornate temples, and incredible street food.', '/images/destinations/thailand.jpg', 0, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(8, 'Himachal Pradesh', 'himachal-pradesh', 'India', 'Snow-capped mountains, valleys and adventure sports.', '/images/destinations/himachal.jpg', 1, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14');

-- --------------------------------------------------------

--
-- Table structure for table `itineraries`
--

CREATE TABLE `itineraries` (
  `id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `title` varchar(300) NOT NULL,
  `description` text NOT NULL,
  `meals` varchar(100) DEFAULT NULL,
  `accommodation` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `itineraries`
--

INSERT INTO `itineraries` (`id`, `package_id`, `day_number`, `title`, `description`, `meals`, `accommodation`, `created_at`) VALUES
(1, 1, 1, 'Arrival in Goa', 'Arrive at Goa airport and transfer to your beachside hotel. Evening free to explore Calangute beach.', 'Dinner', 'Beach Resort', '2026-10-27 09:35:14'),
(2, 1, 2, 'North Goa Exploration', 'Visit Fort Aguada, Vagator Beach, Anjuna Flea Market, and enjoy the vibrant nightlife.', 'Breakfast', 'Beach Resort', '2026-10-27 09:35:14'),
(3, 1, 3, 'Water Sports & Old Goa', 'Morning water sports at Baga Beach. Afternoon visit Basilica of Bom Jesus, Se Cathedral.', 'Breakfast', 'Beach Resort', '2026-10-27 09:35:14'),
(4, 1, 4, 'South Goa Tour', 'Visit Colva Beach, Palolem Beach, and enjoy a sunset boat cruise on Sal River.', 'Breakfast', 'Beach Resort', '2026-10-27 09:35:14'),
(5, 1, 5, 'Departure', 'Check out and transfer to Goa airport for your return flight.', 'Breakfast', 'N/A', '2026-10-27 09:35:14');

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `title` varchar(300) NOT NULL,
  `slug` varchar(300) NOT NULL,
  `destination_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `duration_days` int(11) NOT NULL,
  `duration_nights` int(11) NOT NULL,
  `max_people` int(11) DEFAULT '20',
  `min_age` int(11) DEFAULT '0',
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `tour_type` enum('domestic','international','adventure','honeymoon','family','pilgrimage','cruise','wildlife') NOT NULL,
  `difficulty` enum('easy','moderate','challenging') DEFAULT 'easy',
  `featured` tinyint(1) DEFAULT '0',
  `best_season` varchar(100) DEFAULT NULL,
  `inclusions` text,
  `exclusions` text,
  `main_image` varchar(500) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT '0.0',
  `total_reviews` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `title`, `slug`, `destination_id`, `description`, `short_description`, `duration_days`, `duration_nights`, `max_people`, `min_age`, `price`, `discount_price`, `tour_type`, `difficulty`, `featured`, `best_season`, `inclusions`, `exclusions`, `main_image`, `rating`, `total_reviews`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Magical Goa Beach Holiday New', 'magical-goa-beach-holiday-new', 1, 'Experience the vibrant culture, pristine beaches, and exciting nightlife of Goa...', 'Enjoy 4 nights of beach bliss in Goa with water sports and sightseeing.', 5, 4, 20, 0, '15999.00', '12999.00', 'domestic', 'easy', 1, 'October - March', 'Hotel accommodation, Breakfast, Airport transfers, Sightseeing, Water sports', 'Flights, Lunch & Dinner, Personal expenses', '/images/packages/goa-beach.jpg', '0.0', 0, 1, '2026-10-27 09:35:14', '2026-10-27 15:19:04'),
(2, 'Kerala Backwater Bliss', 'kerala-backwater-bliss', 2, 'Cruise through the serene backwaters of Kerala on a traditional houseboat...', 'Explore Kerala backwaters, tea gardens and beaches in 6 days.', 6, 5, 20, 0, '22999.00', '18999.00', 'domestic', 'easy', 1, 'September - March', 'Hotel & Houseboat stay, All meals on houseboat, Transfers, Sightseeing', 'Flights, Entry tickets, Personal expenses', '/images/packages/kerala-backwater.jpg', '0.0', 0, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(3, 'Royal Rajasthan Explorer', 'royal-rajasthan-explorer', 3, 'Journey through the royal land of Rajasthan visiting majestic forts and palaces...', 'Visit Jaipur, Udaipur, Jodhpur, and Jaisalmer in 8 days.', 8, 7, 20, 0, '32999.00', '27999.00', 'domestic', 'easy', 1, 'October - March', 'Heritage hotel stays, Breakfast, AC transport, Guide, Camel safari', 'Flights, Lunch & Dinner, Entry fees', '/images/packages/rajasthan.jpg', '0.0', 0, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(4, 'Maldives Luxury Escape', 'maldives-luxury-escape', 4, 'Indulge in the ultimate luxury experience in the Maldives...', 'All-inclusive luxury resort stay in Maldives for 4 nights.', 5, 4, 20, 0, '89999.00', '79999.00', 'international', 'easy', 1, 'November - April', 'Resort stay, All meals, Snorkeling, Spa session, Transfers', 'Flights, Visa, Travel insurance', '/images/packages/maldives-luxury.jpg', '0.0', 0, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(5, 'Enchanting Bali Adventure', 'enchanting-bali-adventure', 5, 'Discover the magic of Bali with its stunning temples, rice terraces...', 'Complete Bali experience with culture, adventure and beaches.', 7, 6, 20, 0, '45999.00', '39999.00', 'international', 'easy', 1, 'April - October', 'Hotel stay, Breakfast, Transfers, Sightseeing, Water sports', 'Flights, Visa on arrival, Lunch & Dinner', '/images/packages/bali-adventure.jpg', '0.0', 0, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14'),
(6, 'Dubai Dazzle Tour', 'dubai-dazzle-tour', 6, 'Experience the glitz and glamour of Dubai...', 'Explore Dubai with desert safari, city tour and shopping.', 6, 5, 20, 0, '55999.00', '49999.00', 'international', 'easy', 1, 'November - March', 'Hotel stay, Breakfast, Desert safari, Dhow cruise, City tour, Transfers', 'Flights, Visa, Lunch & Dinner', '/images/packages/dubai-tour.jpg', '0.0', 0, 1, '2026-10-27 09:35:14', '2026-10-27 09:35:14');

-- --------------------------------------------------------

--
-- Table structure for table `package_images`
--

CREATE TABLE `package_images` (
  `id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `sort_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `location` varchar(200) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `review` text NOT NULL,
  `package_id` int(11) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT '0',
  `featured` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `phone`, `avatar`, `role`, `is_active`, `reset_token`, `reset_token_expiry`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Credence', 'admin@credenceholidays.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, NULL, 'admin', 1, NULL, NULL, '2026-10-27 09:35:14', '2026-10-27 14:56:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_ref` (`booking_ref`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `itineraries`
--
ALTER TABLE `itineraries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `destination_id` (`destination_id`);

--
-- Indexes for table `package_images`
--
ALTER TABLE `package_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `itineraries`
--
ALTER TABLE `itineraries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `package_images`
--
ALTER TABLE `package_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `itineraries`
--
ALTER TABLE `itineraries`
  ADD CONSTRAINT `itineraries_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `packages`
--
ALTER TABLE `packages`
  ADD CONSTRAINT `packages_ibfk_1` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `package_images`
--
ALTER TABLE `package_images`
  ADD CONSTRAINT `package_images_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `testimonials_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `testimonials_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
