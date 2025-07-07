-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 07, 2025 at 09:01 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_siliconleaf`
--

-- --------------------------------------------------------

--
-- Table structure for table `attributes`
--

CREATE TABLE `attributes` (
  `attributeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categoryId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `categorySlug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `typeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryId`, `categoryName`, `categorySlug`, `description`, `image`, `createdAt`, `updatedAt`, `typeId`) VALUES
('6c7a39c9-0b70-4871-b4a7-a865f2b7f011', 'Saree', 'saree', '<p>this is saree catg</p>', '/uploads/44ea0e68-1c22-407c-a488-7461703413d9.jpg', '2025-07-07 06:55:19', '2025-07-07 06:55:19', '6e3d29f0-2a7a-4794-b1ba-344062baefc2'),
('6f19acf5-aa2c-4245-83d6-c1f30b281cff', 'Kurta', 'kurta', '<p>this is simple Kurta for Mens</p>', '/uploads/588a03cd-27e6-40a3-91d4-dc62d3fe2d9e.webp', '2025-07-07 05:55:34', '2025-07-07 05:55:58', 'd7a89ed0-856b-488d-862d-6a0f1fc8baa9');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customerId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobileNumber` varchar(255) NOT NULL,
  `shippingAddress` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shippingAddress`)),
  `billingAddress` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`billingAddress`)),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `optionId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `attributeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `value` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` char(36) NOT NULL,
  `customerId` char(36) NOT NULL,
  `total` float NOT NULL,
  `status` enum('Processing','Pending Payment','On Hold','Shipped','Ready to Ship','Cancelled') NOT NULL DEFAULT 'Pending Payment',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  `products` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`products`)),
  `paymentMethod` enum('online_payment','cod','direct_bank_transfer') NOT NULL,
  `shippingMethod` varchar(255) DEFAULT NULL,
  `orderNotes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productcategories`
--

CREATE TABLE `productcategories` (
  `productId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `categoryId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productcategories`
--

INSERT INTO `productcategories` (`productId`, `categoryId`) VALUES
('1203d4b8-050f-43b5-b129-ccd076ceb8f6', '6f19acf5-aa2c-4245-83d6-c1f30b281cff'),
('fdf16970-0697-4845-a503-61c8f522dfe9', '6c7a39c9-0b70-4871-b4a7-a865f2b7f011');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `productName` varchar(255) NOT NULL,
  `mainImage` varchar(255) NOT NULL,
  `subImages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`subImages`)),
  `availableStatus` enum('Ready to Ship','On Booking') NOT NULL,
  `mrp` decimal(10,2) NOT NULL,
  `salePrice` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `weight` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productId`, `productName`, `mainImage`, `subImages`, `availableStatus`, `mrp`, `salePrice`, `description`, `brand`, `createdAt`, `updatedAt`, `weight`) VALUES
('1203d4b8-050f-43b5-b129-ccd076ceb8f6', 'Cotton Kurta', '/uploads/81b461af-543f-4bce-a580-891bea25b34a.jpg', '[\"/uploads/e0e36e32-a055-469a-a79e-667e4dd89242.jpg\",\"/uploads/9cb5f664-3171-4b9e-9f01-f07471c7d28e.jpg\"]', 'Ready to Ship', 1000.00, 800.00, '<p>this is description about COtton Desi Kurta which have Type as Men\'s Wear and Category is Kurta and Subcategory is Desi Kurta</p>', NULL, '2025-07-07 05:58:50', '2025-07-07 05:58:50', 500.00),
('fdf16970-0697-4845-a503-61c8f522dfe9', 'Banarasi silk Saree', '/uploads/3b32fc76-0eaa-48bf-ba0b-3f555c90abad.webp', '[\"/uploads/e40b42d2-4d33-44ad-908c-c3c103e73043.webp\",\"/uploads/4f691d45-0309-4acd-960d-2be178051e5e.webp\"]', 'Ready to Ship', 15000.00, 12000.00, '<p>this is Banarasi Saree for Woman</p>', NULL, '2025-07-07 06:57:23', '2025-07-07 06:57:23', 999.80);

-- --------------------------------------------------------

--
-- Table structure for table `productsubcategories`
--

CREATE TABLE `productsubcategories` (
  `productId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subCategoryId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productsubcategories`
--

INSERT INTO `productsubcategories` (`productId`, `subCategoryId`) VALUES
('1203d4b8-050f-43b5-b129-ccd076ceb8f6', 'eae4a300-f81e-44f4-99bc-bcefc499ae22'),
('fdf16970-0697-4845-a503-61c8f522dfe9', '91bcc063-314c-49fa-94be-5faa31326d53');

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `subCategoryId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subCategoryName` varchar(255) NOT NULL,
  `subCategorySlug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `parentCategoryId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`subCategoryId`, `subCategoryName`, `subCategorySlug`, `description`, `parentCategoryId`, `createdAt`, `updatedAt`) VALUES
('91bcc063-314c-49fa-94be-5faa31326d53', 'Silk Saree', 'silk-saree', '<p>this is silk saree sub catg</p>', '6c7a39c9-0b70-4871-b4a7-a865f2b7f011', '2025-07-07 06:55:52', '2025-07-07 06:55:52'),
('eae4a300-f81e-44f4-99bc-bcefc499ae22', 'Desi Kurta', 'desi-kurta', '<p>this is Subcategory of Kurta</p>', '6f19acf5-aa2c-4245-83d6-c1f30b281cff', '2025-07-07 05:56:33', '2025-07-07 05:56:33');

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

CREATE TABLE `types` (
  `typeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `typeName` varchar(255) NOT NULL,
  `typeSlug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`typeId`, `typeName`, `typeSlug`, `description`, `createdAt`, `updatedAt`) VALUES
('6e3d29f0-2a7a-4794-b1ba-344062baefc2', 'Women', 'women', '<p>this is woman types</p>', '2025-07-07 06:54:49', '2025-07-07 06:54:49'),
('d7a89ed0-856b-488d-862d-6a0f1fc8baa9', 'Men', 'men', '<p>this is <strong>Mens </strong>wear for you</p>', '2025-07-07 05:13:08', '2025-07-07 06:10:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'admin',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'admin@gmail.com', '$2b$10$XuZ2JWa0g0ZcwOVNA5LWa./S86wP2ZXcNoNmHaEtvkPJyphytdSb2', 'admin', '2025-07-01 04:41:56', '2025-07-01 04:41:56');

-- --------------------------------------------------------

--
-- Table structure for table `variantimages`
--

CREATE TABLE `variantimages` (
  `imageId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `variantId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `variantoptions`
--

CREATE TABLE `variantoptions` (
  `id` int(11) NOT NULL,
  `variantId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `optionId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `variants`
--

CREATE TABLE `variants` (
  `variantId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `productId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sku` varchar(100) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `price` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `options` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `variants`
--

INSERT INTO `variants` (`variantId`, `productId`, `sku`, `stock`, `price`, `createdAt`, `updatedAt`, `image`, `options`) VALUES
('3970c003-1b81-416c-8048-92e4277d37d4', '1203d4b8-050f-43b5-b129-ccd076ceb8f6', 'COTTON-KURTA-X-RED', 10, 800.00, '2025-07-07 05:58:50', '2025-07-07 05:58:50', '/uploads/d8a30183-8ab5-43d7-ac4c-ecb8e17ba056', '[{\"attribute\":\"Size\",\"value\":\"X\"},{\"attribute\":\"Color\",\"value\":\"Red\"}]'),
('5a426a9b-d618-4fe9-8f06-8101f12ca855', '1203d4b8-050f-43b5-b129-ccd076ceb8f6', 'COTTON-KURTA-L-RED', 25, 800.00, '2025-07-07 05:58:50', '2025-07-07 05:58:50', '/uploads/9eb8b1c9-29d6-4b92-bab1-837542269741', '[{\"attribute\":\"Size\",\"value\":\"L\"},{\"attribute\":\"Color\",\"value\":\"Red\"}]'),
('70b69d9b-6dd6-4040-8135-085e96c9ce40', 'fdf16970-0697-4845-a503-61c8f522dfe9', 'BANARASI-SILK-SAREE-RED', 5, 12000.00, '2025-07-07 06:57:24', '2025-07-07 06:57:24', '/uploads/14500e79-00ad-4e7b-a51c-ace6cff3a7a6', '[{\"attribute\":\"Color\",\"value\":\"Red\"}]'),
('944182d4-bcb6-4236-8e44-101f9a44ac27', '1203d4b8-050f-43b5-b129-ccd076ceb8f6', 'COTTON-KURTA-X-BLUE', 5, 800.00, '2025-07-07 05:58:50', '2025-07-07 05:58:50', '/uploads/9af27135-379a-4f4b-b0ec-ab09270d145c', '[{\"attribute\":\"Size\",\"value\":\"X\"},{\"attribute\":\"Color\",\"value\":\"Blue\"}]'),
('b83c40ec-8d9d-4746-9161-f4d6a013a6d4', '1203d4b8-050f-43b5-b129-ccd076ceb8f6', 'COTTON-KURTA-L-BLUE', 8, 800.00, '2025-07-07 05:58:51', '2025-07-07 05:58:51', '/uploads/26e426dc-a6cf-41db-885f-8c8aaf02eb6d', '[{\"attribute\":\"Size\",\"value\":\"L\"},{\"attribute\":\"Color\",\"value\":\"Blue\"}]'),
('d0c6816a-7451-4914-9b8c-e1a4c9f8b9a2', 'fdf16970-0697-4845-a503-61c8f522dfe9', 'BANARASI-SILK-SAREE-BLUE', 10, 12000.00, '2025-07-07 06:57:24', '2025-07-07 06:57:24', '/uploads/60213765-9636-4f3c-b501-f45d7e1690ba', '[{\"attribute\":\"Color\",\"value\":\"Blue\"}]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`attributeId`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryId`),
  ADD UNIQUE KEY `categorySlug` (`categorySlug`),
  ADD KEY `fk_category_type` (`typeId`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customerId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`optionId`),
  ADD KEY `attributeId` (`attributeId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD UNIQUE KEY `orderId` (`orderId`);

--
-- Indexes for table `productcategories`
--
ALTER TABLE `productcategories`
  ADD PRIMARY KEY (`productId`,`categoryId`),
  ADD UNIQUE KEY `ProductCategories_categoryId_productId_unique` (`productId`,`categoryId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`);

--
-- Indexes for table `productsubcategories`
--
ALTER TABLE `productsubcategories`
  ADD PRIMARY KEY (`productId`,`subCategoryId`),
  ADD UNIQUE KEY `ProductSubCategories_subCategoryId_productId_unique` (`productId`,`subCategoryId`),
  ADD KEY `subCategoryId` (`subCategoryId`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`subCategoryId`),
  ADD UNIQUE KEY `subCategorySlug` (`subCategorySlug`),
  ADD KEY `parentCategoryId` (`parentCategoryId`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`typeId`),
  ADD UNIQUE KEY `typeName` (`typeName`),
  ADD UNIQUE KEY `typeSlug` (`typeSlug`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `variantimages`
--
ALTER TABLE `variantimages`
  ADD PRIMARY KEY (`imageId`),
  ADD KEY `variantId` (`variantId`);

--
-- Indexes for table `variantoptions`
--
ALTER TABLE `variantoptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `variantId` (`variantId`),
  ADD KEY `optionId` (`optionId`);

--
-- Indexes for table `variants`
--
ALTER TABLE `variants`
  ADD PRIMARY KEY (`variantId`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `productId` (`productId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `variantoptions`
--
ALTER TABLE `variantoptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_category_type` FOREIGN KEY (`typeId`) REFERENCES `types` (`typeId`) ON UPDATE CASCADE;

--
-- Constraints for table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`attributeId`) REFERENCES `attributes` (`attributeId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productcategories`
--
ALTER TABLE `productcategories`
  ADD CONSTRAINT `productcategories_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productcategories_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`) ON UPDATE CASCADE;

--
-- Constraints for table `productsubcategories`
--
ALTER TABLE `productsubcategories`
  ADD CONSTRAINT `productsubcategories_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productsubcategories_ibfk_2` FOREIGN KEY (`subCategoryId`) REFERENCES `subcategories` (`subCategoryId`) ON UPDATE CASCADE;

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`parentCategoryId`) REFERENCES `categories` (`categoryId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `variantimages`
--
ALTER TABLE `variantimages`
  ADD CONSTRAINT `variantimages_ibfk_1` FOREIGN KEY (`variantId`) REFERENCES `variants` (`variantId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `variantoptions`
--
ALTER TABLE `variantoptions`
  ADD CONSTRAINT `variantoptions_ibfk_1` FOREIGN KEY (`variantId`) REFERENCES `variants` (`variantId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `variantoptions_ibfk_2` FOREIGN KEY (`optionId`) REFERENCES `options` (`optionId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `variants`
--
ALTER TABLE `variants`
  ADD CONSTRAINT `variants_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
