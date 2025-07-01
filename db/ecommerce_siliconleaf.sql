-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2025 at 07:07 AM
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

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`attributeId`, `name`, `createdAt`, `updatedAt`) VALUES
('084c4802-0d80-4a2f-b394-2024f153742c', 'Size', '2025-05-16 10:04:12', '2025-05-16 10:04:12'),
('2913bf69-ae04-4b56-8e4b-e3577c984cba', 'Color', '2025-05-16 11:27:21', '2025-05-16 11:27:21');

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
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryId`, `categoryName`, `categorySlug`, `description`, `image`, `createdAt`, `updatedAt`) VALUES
('00d31de2-654b-42e1-a063-f542b955490c', 'Saree', 'saree-wholesaler-in-surat', 'aaa', NULL, '2025-05-13 07:55:29', '2025-05-14 11:01:27'),
('0fefda60-704c-4d54-a387-d38090be5132', 'test updated ', 'test-updated', '<p>new test updated </p>', '/uploads/354fb8ae-f55f-4e8d-a165-37cee2a83a65.jpg', '2025-05-23 04:58:36', '2025-05-23 04:58:36'),
('2ec45743-ab4f-4352-8b92-dd80b4463482', 'new testing shirt', 'new-testing-shirt', '<p>this is new testing demo shirt</p>', '/uploads/ec1c931c-f823-4768-8de7-2c3a358f8a86.webp', '2025-05-22 04:21:24', '2025-05-22 04:21:24'),
('3454bd72-7253-4381-88c6-025d368a12a4', 'Saree wholesale', 'saree-wholesale', '<p>saree wholesale</p>', NULL, '2025-05-14 09:23:41', '2025-05-14 09:23:41'),
('518ab75d-3ab0-4f15-8302-88ffaa67b847', 'Purple Banarasi Silk ', 'purple-banarasi-silk-sss', '<ul><li>All the prices are inclusive of GST.</li><li>Free ₹200</li></ul><h3><strong>Product Description</strong></h3><ul><li>This vibrant purple Banarasi silk saree is a graceful blend of heritage and statement making elegance. The body of the saree showcases delicately woven motifs highlighted in golden threadwork that contrast sharply against the rich purple base. Accents of emerad green in the border enhance</li></ul>', '/uploads/c27fac02-fba9-4d95-9163-4320af1c23db.jpg', '2025-05-13 12:25:55', '2025-05-13 12:50:26'),
('5398df3f-6257-4a28-93e9-923b778f3450', 'Men wear', 'men-wear-shirt', '<p>this is means wear shirt&nbsp;</p>', NULL, '2025-05-14 07:35:07', '2025-05-14 07:35:07'),
('641bd177-6026-4bb4-97b7-5f6e00cbed88', 'Saree', 'saree', '<p>saree wholesale</p>', NULL, '2025-05-14 09:22:25', '2025-05-14 09:22:25'),
('86f694d2-1f6a-4702-b231-0945f6523add', 'avitestcatg issue', 'avitestcatg-issue', '<p>this is testing issue catb</p>', '/uploads/5006aa1e-2721-4c28-87df-db1b1f955da2.webp', '2025-07-01 04:43:17', '2025-07-01 04:43:17'),
('8f216752-51fc-4ad4-a714-af3189d52bd4', 'old saree', 'old-saree', 'l Indian attire. Let\'s dive into the details of this exquisite ensemble that promises to redefine your style.\r\n **Goldy Collection: Aura Cotton Silk Saree with Jacquard Magic**\r\n**Fabric & Border:**Immerse yourself in the luxurious feel of Aura Cotton Silk, a fabric that combines the richness of cotton with the allure of silk. The saree features a broad contrast jacquard work border, adding a touch of opulence to the entire ensemble. The intricate patterns on the border ', '/uploads/ff5116fc-7854-4e3a-830c-8ddb1bc98bfd.jpg', '2025-05-13 06:58:50', '2025-05-13 07:12:07'),
('90fe5b88-ac88-44d7-b71f-0897d7f3f93a', 'Mens Wear', 'mens-wear', '<p>This is for means wear</p>', '/uploads/6558126c-cf3b-4196-9fdf-9b4e6a15717e.webp', '2025-05-14 07:32:40', '2025-05-14 07:36:46'),
('9b601525-7a2a-4fe6-9d99-90543d7d8cb6', 'Men wear new', 'men-wear-new', '<p>this is means wear shirt&nbsp;</p>', NULL, '2025-05-14 07:36:23', '2025-05-14 07:36:23'),
('aa9ef2c3-3f86-4a20-ba37-3bca72ff523c', 'new saree-deedeqsqs', 'new-saree-deedeqsqs', 'wwswqswqdwqd', '/uploads/b9cb6a9f-a675-44b9-a037-820fcb5a1a84.jpg', '2025-05-12 13:27:51', '2025-05-12 13:27:51'),
('bb96832f-77c3-4021-83c7-e72c99e0f765', 'SareeCatg-avi', 'sareecatg-avi', '<p>this is <strong>normal saree</strong> avi catg </p>', '/uploads/4a064681-ce1f-4435-8b94-566f029073e1.jpg', '2025-05-21 05:22:09', '2025-05-21 05:22:09'),
('bd3a37db-d7a8-44d3-8aea-d8bde891788e', 'new category saree', 'new-category-saree', '<p>this is new category saree&nbsp;</p>', '/uploads/21b4d2f1-8c2a-48fe-b71c-71651a6ed0fd.webp', '2025-05-14 10:45:36', '2025-05-14 10:45:36'),
('dd874769-6ef1-43f6-8756-df7ca883e153', 'saree red', 'saree-red', 'thisis red saree \r\nC J Enterprise Women\'s Kanjivaram Silk Saree', '/uploads/b3f87ac0-4d3f-46aa-b8b3-24fd31b58c67.jpg', '2025-05-12 12:16:48', '2025-05-12 12:16:48'),
('e39fd2a2-fbbc-4ce6-b1a2-71203162bc79', 'new saree ', 'new-saree', 'tihvsjvsvxsxsxe', '/uploads/b432e1c3-97df-40f0-b7ef-ea832d4783b3.jpg', '2025-05-12 12:42:04', '2025-05-12 12:42:04'),
('ee903926-a7e1-4a11-b417-c561d099c64d', 'Purple Banarasi Silk ', 'purple-banarasi-silk-ssss', '<ul><li>This vibrant purple Banarasi silk saree is a graceful blend of heritage and statement making elegance. The body of the saree showcases delicately woven motifs highlighted in golden threadwork that contrast sharply against the rich purple base. Accents of emerald green in the border enhance the depth of the design while intricate patterns run along the pallu edged with matching green tassels that swing with every step. Scattered woven butti designs adorn the fabric lending it a festive yet refined appeal. The fabric drapes with ease and lends a rich texture that is perfect for traditional celebrations.</li><li>This look is completed with a tailored Banarasi silk blouse in a rich blue magenta tone adding definition and structure to the overall ensemble. The blouse features a sweetheart neckline both in the front and back complementing the ornate weave of the saree.&nbsp;</li></ul>', '/uploads/3b1238c6-5b5e-484c-a1fd-c813f49e8230.jpg', '2025-05-13 11:54:04', '2025-05-13 11:54:04');

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

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customerId`, `firstName`, `lastName`, `email`, `mobileNumber`, `shippingAddress`, `billingAddress`, `isActive`, `lastLogin`, `createdAt`, `updatedAt`) VALUES
('12a6e276-ca18-41ef-bbea-e2d35f7b22f9', 'avinash', 'SIngh', 'fasat61070@dlbazi.com', '9382705012', '{\"street\":\"2122\",\"building\":\"gandhi place\",\"landmark\":\"new nanpura\",\"city\":\"surat\",\"state\":\"gujarat\",\"pincode\":\"394210\"}', '{\"street\":\"2122\",\"building\":\"gandhi place\",\"landmark\":\"new nanpura\",\"city\":\"surat\",\"state\":\"gujarat\",\"pincode\":\"394210\"}', 1, NULL, '2025-05-26 09:00:28', '2025-05-26 09:26:53');

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

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`optionId`, `attributeId`, `value`, `createdAt`, `updatedAt`) VALUES
('4e522c16-3ebc-4e5d-899d-58ddc1836f32', '2913bf69-ae04-4b56-8e4b-e3577c984cba', 'Red', '2025-05-16 11:27:22', '2025-05-16 11:27:22'),
('4eabe0d4-062f-433a-9369-18d67ceb4ba8', '2913bf69-ae04-4b56-8e4b-e3577c984cba', 'Blue', '2025-05-16 11:27:22', '2025-05-16 11:27:22'),
('9a3067a2-841f-44b1-99e4-4acb15c0c42a', '084c4802-0d80-4a2f-b394-2024f153742c', 'S', '2025-05-16 11:27:21', '2025-05-16 11:27:21');

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

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderId`, `customerId`, `total`, `status`, `createdAt`, `updatedAt`, `products`, `paymentMethod`, `shippingMethod`, `orderNotes`) VALUES
('4131e559-794c-43de-96f1-49a8f2940261', '12a6e276-ca18-41ef-bbea-e2d35f7b22f9', 1218.8, 'Pending Payment', '2025-07-01 05:04:09', '2025-07-01 05:04:09', '[{\"productId\":\"5b17a6fa-14bd-449b-81db-8b891233d08a\",\"variantId\":\"a8eefc35-a750-4166-a4af-06194e244015\",\"quantity\":1,\"discount\":10}]', 'online_payment', 'Courier', 'ergtregrerefreferfwefwefwefefewfewfewfewfewf'),
('4a811464-0807-4c99-909a-7f738b3fb4bf', '12a6e276-ca18-41ef-bbea-e2d35f7b22f9', 2519, 'Pending Payment', '2025-07-01 04:51:22', '2025-07-01 04:51:22', '[{\"productId\":\"5b17a6fa-14bd-449b-81db-8b891233d08a\",\"variantId\":\"70257c56-90d9-4a0e-85d4-31ffefa09702\",\"quantity\":2,\"discount\":5}]', 'cod', 'Courier', 'frw3t45rt6yrwty'),
('bf04fe76-852d-49b4-b2c5-f6e5d91bee98', '12a6e276-ca18-41ef-bbea-e2d35f7b22f9', 1942.8, 'Pending Payment', '2025-05-28 06:13:26', '2025-05-28 08:47:18', '[{\"productId\":\"4e5f72a2-717b-42e9-b9c7-045663af44cd\",\"variantId\":\"1fce2a63-2975-4aa5-8d8c-1016bfe1597d\",\"quantity\":2,\"discount\":10}]', 'online_payment', 'Courier', 'by courier i will');

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
('5b17a6fa-14bd-449b-81db-8b891233d08a', '86f694d2-1f6a-4702-b231-0945f6523add');

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
('4e5f72a2-717b-42e9-b9c7-045663af44cd', 'new saree printed cotton', '/uploads/a8e5f187-05f4-40a4-8f3f-36ce83c7e50d.webp', '[\"/uploads/5ea09254-44c5-4d6b-bef1-42541a0e63a6.webp\",\"/uploads/39838160-9359-44b7-88d7-f7d03fe6fd83.webp\"]', 'Ready to Ship', 1000.00, 800.00, '<p>this is best saree in world </p>', NULL, '2025-05-26 08:07:02', '2025-05-26 08:07:02', 1500.00),
('5b17a6fa-14bd-449b-81db-8b891233d08a', 'new saree hai yaar', '/uploads/4c6368ad-1652-47bc-8df1-74cdede1e5ef.webp', '[\"/uploads/522b77c1-907b-44a5-920d-14a4c3ab8782.webp\",\"/uploads/a8ef68dc-797c-4d20-bbd7-32e3f6601e13.webp\",\"/uploads/2666113f-b060-4e61-b364-083be8535e28.jpg\"]', 'Ready to Ship', 1200.00, 1100.00, '<p>thi is new <strong>srree </strong>testinycasdbcjhbcjsdcjsdcbjksdc</p>', NULL, '2025-07-01 04:49:41', '2025-07-01 04:49:59', 1000.00);

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
('5b17a6fa-14bd-449b-81db-8b891233d08a', '12948f22-6447-4004-9b8e-277520cc2099');

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
('12948f22-6447-4004-9b8e-277520cc2099', 'newissuesubcatg', 'newissuesubcatg', '<p>this is new issue sub catg</p>', '86f694d2-1f6a-4702-b231-0945f6523add', '2025-07-01 04:43:54', '2025-07-01 04:43:54'),
('1d0b3a0e-cd79-45e0-953e-e248de88aca9', 'new sree printed', 'new-sree-printed', '<p>this is saree&nbsp;</p>', '00d31de2-654b-42e1-a063-f542b955490c', '2025-05-14 09:26:44', '2025-05-14 09:26:44'),
('4ceae698-6793-4ff1-a6d8-8d0667a11350', 'new printed saree ', 'new-printed-saree', '<p>this is saree&nbsp;</p>', '00d31de2-654b-42e1-a063-f542b955490c', '2025-05-14 09:25:33', '2025-05-14 09:25:33'),
('69de4396-fa3f-447a-8376-d8b0d98cfb47', 'NewAViCatg-here', 'newavicatg-here', '<p>this is new <em>subcatg </em><strong>of saree avi</strong></p>', 'bb96832f-77c3-4021-83c7-e72c99e0f765', '2025-05-21 05:22:56', '2025-05-21 05:22:56'),
('719084b0-774f-4bd7-a08a-4431d0b56edf', 'new saree red colored print', 'new-saree-deedeqsqs-new-saree-red-colored-print', 'this is simple descrip[tion ', 'aa9ef2c3-3f86-4a20-ba37-3bca72ff523c', '2025-05-13 04:57:49', '2025-05-13 04:57:49'),
('815fd24c-252a-4f1e-b5b8-d39ad3772bea', 'this is testing shirt', 'this-is-testing-shirt', '<p>new testing shirt yaar</p>', '2ec45743-ab4f-4352-8b92-dd80b4463482', '2025-05-22 04:21:58', '2025-05-22 04:21:58'),
('97e46a12-058e-4c98-a07f-c9f3a319ff54', 'new saree test updated', 'new-saree-test-updated', '<h2>this is hugh</h2><p>no morwe</p>', '0fefda60-704c-4d54-a387-d38090be5132', '2025-05-23 04:59:51', '2025-05-23 04:59:51'),
('bc3a3082-7939-49ad-b83d-26bc987c62e4', 'new saree red colored', 'new-saree-deedeqsqs-new-saree-red-colored', 'this is simple descrip[tion ', 'aa9ef2c3-3f86-4a20-ba37-3bca72ff523c', '2025-05-13 04:55:56', '2025-05-13 04:55:56'),
('cabdc6f9-d172-46ba-b32f-2d4e3ba96581', 'the new sari of banarasa', 'the-new-sari-of-banarasa', '<p>This vibr<strong>ant purple Banarasi silk </strong>saree is a graceful blend of heritage and statement making elegance. The body of the saree show</p>', '518ab75d-3ab0-4f15-8302-88ffaa67b847', '2025-05-13 13:10:45', '2025-05-13 13:10:45'),
('cf8ff670-0244-4366-8fa8-52e71a0e0f78', 'Printed Saree', 'printed-saree', '', '00d31de2-654b-42e1-a063-f542b955490c', '2025-05-13 07:57:54', '2025-05-13 07:57:54'),
('ecaed5b4-5eff-4f52-beb8-f76d43d161ba', 'new category here ', 'new-category-here', '<p>this is here&nbsp;</p>', 'bd3a37db-d7a8-44d3-8aea-d8bde891788e', '2025-05-14 10:46:00', '2025-05-14 10:46:00'),
('ff399a4e-8d3b-4e56-8c02-658a252edc43', 'Shirt for Mens', 'shirt-for-mens', '<p>We are adding subcategory of Shirt for Mens</p>', '90fe5b88-ac88-44d7-b71f-0897d7f3f93a', '2025-05-14 07:55:33', '2025-05-14 07:55:33');

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
('1fce2a63-2975-4aa5-8d8c-1016bfe1597d', '4e5f72a2-717b-42e9-b9c7-045663af44cd', 'NEW-SAREE-PRINTED-COTTON-COTTON-BLUE', 1, 800.00, '2025-05-26 08:07:02', '2025-05-28 06:13:26', '/uploads/02320b62-76a5-405d-967a-e5153421114b', '[{\"attribute\":\"Material\",\"value\":\"Cotton\"},{\"attribute\":\"Color\",\"value\":\"Blue\"}]'),
('328e9e4e-15fa-490c-b855-e8c6e0bf677c', '4e5f72a2-717b-42e9-b9c7-045663af44cd', 'NEW-SAREE-PRINTED-COTTON-COTTON-RED', 8, 800.00, '2025-05-26 08:07:02', '2025-05-26 08:07:02', '/uploads/1ede366d-bf09-43ac-9e74-357c33b9db67', '[{\"attribute\":\"Material\",\"value\":\"Cotton\"},{\"attribute\":\"Color\",\"value\":\"Red\"}]'),
('3bff3da4-31ad-476b-a061-d55937d75144', '4e5f72a2-717b-42e9-b9c7-045663af44cd', 'NEW-SAREE-PRINTED-COTTON-SILK-BLUE', 8, 800.00, '2025-05-26 08:07:03', '2025-05-26 08:07:03', '/uploads/fe960ea4-5025-4ae9-bd9f-5149dacfbd91', '[{\"attribute\":\"Material\",\"value\":\"Silk\"},{\"attribute\":\"Color\",\"value\":\"Blue\"}]'),
('70257c56-90d9-4a0e-85d4-31ffefa09702', '5b17a6fa-14bd-449b-81db-8b891233d08a', 'NEW-SAREE-HAI-YAAR-X-BLUE', 1, 1100.00, '2025-07-01 04:49:59', '2025-07-01 04:51:22', '/uploads/e361e5af-54cf-4461-8d9a-256cb5fe1210', '[{\"attribute\":\"Size\",\"value\":\"X\"},{\"attribute\":\"Color\",\"value\":\"Blue\"}]'),
('9d243e9b-31f1-4fa8-88fd-fe0850f4a831', '4e5f72a2-717b-42e9-b9c7-045663af44cd', 'NEW-SAREE-PRINTED-COTTON-SILK-RED', 6, 800.00, '2025-05-26 08:07:03', '2025-05-27 12:04:26', '/uploads/bad2d623-10ec-458b-9a4a-dc23ca323384', '[{\"attribute\":\"Material\",\"value\":\"Silk\"},{\"attribute\":\"Color\",\"value\":\"Red\"}]'),
('a5890e69-9e59-43c2-8b56-c37570c6d406', '4e5f72a2-717b-42e9-b9c7-045663af44cd', 'NEW-SAREE-PRINTED-COTTON-SILK-BLACK', 2, 800.00, '2025-05-26 08:07:03', '2025-05-28 05:36:45', '/uploads/698911ea-f887-42e1-87b5-5f5cce8096fe', '[{\"attribute\":\"Material\",\"value\":\"Silk\"},{\"attribute\":\"Color\",\"value\":\"Black\"}]'),
('a8eefc35-a750-4166-a4af-06194e244015', '5b17a6fa-14bd-449b-81db-8b891233d08a', 'NEW-SAREE-HAI-YAAR-L-RED', 0, 1100.00, '2025-07-01 04:49:59', '2025-07-01 05:04:09', '/uploads/15421795-19ac-415d-a4a3-178afb59ef88', '[{\"attribute\":\"Size\",\"value\":\"L\"},{\"attribute\":\"Color\",\"value\":\"Red\"}]'),
('c4f6de59-6c82-4535-b52d-8d26163b8241', '5b17a6fa-14bd-449b-81db-8b891233d08a', 'NEW-SAREE-HAI-YAAR-X-RED', 3, 1100.00, '2025-07-01 04:49:59', '2025-07-01 04:49:59', '/uploads/9ed5af35-d9b7-46f5-b605-1de0e3b4d556', '[{\"attribute\":\"Size\",\"value\":\"X\"},{\"attribute\":\"Color\",\"value\":\"Red\"}]'),
('d1702502-1755-479b-bce9-e653227cb4a6', '4e5f72a2-717b-42e9-b9c7-045663af44cd', 'NEW-SAREE-PRINTED-COTTON-COTTON-BLACK', 5, 800.00, '2025-05-26 08:07:02', '2025-05-26 08:07:02', '/uploads/c38f642e-a6ac-4c08-8015-268f8ac6c56a', '[{\"attribute\":\"Material\",\"value\":\"Cotton\"},{\"attribute\":\"Color\",\"value\":\"Black\"}]'),
('d1871bd2-2837-4be1-9940-dc5bf45b135e', '5b17a6fa-14bd-449b-81db-8b891233d08a', 'NEW-SAREE-HAI-YAAR-L-BLUE', 3, 1100.00, '2025-07-01 04:49:59', '2025-07-01 04:49:59', '/uploads/eb30f2cd-7aa8-44d1-abd3-e9e0abd8e5eb', '[{\"attribute\":\"Size\",\"value\":\"L\"},{\"attribute\":\"Color\",\"value\":\"Blue\"}]'),
('d5a1efde-e558-481f-b0fc-ca12df97f78d', '4e5f72a2-717b-42e9-b9c7-045663af44cd', 'NEW-SAREE-PRINTED-COTTON-FABRIC-BLUE', 9, 800.00, '2025-05-26 08:07:02', '2025-05-26 08:07:02', '/uploads/26be1c19-f918-44c0-a6de-f2713892cd85', '[{\"attribute\":\"Material\",\"value\":\"Fabric\"},{\"attribute\":\"Color\",\"value\":\"Blue\"}]'),
('d9fddb23-9c64-4af1-9f79-ceef701b0595', '4e5f72a2-717b-42e9-b9c7-045663af44cd', 'NEW-SAREE-PRINTED-COTTON-FABRIC-BLACK', 8, 800.00, '2025-05-26 08:07:03', '2025-05-26 08:07:03', '/uploads/181bf6ac-0857-4960-9c41-455c195d3337', '[{\"attribute\":\"Material\",\"value\":\"Fabric\"},{\"attribute\":\"Color\",\"value\":\"Black\"}]'),
('e0097032-6d05-44e1-bbb3-9dc14f462dac', '4e5f72a2-717b-42e9-b9c7-045663af44cd', 'NEW-SAREE-PRINTED-COTTON-FABRIC-RED', 10, 800.00, '2025-05-26 08:07:02', '2025-05-26 08:07:02', '/uploads/405c1355-1636-454d-8dde-e4c205f8185c', '[{\"attribute\":\"Material\",\"value\":\"Fabric\"},{\"attribute\":\"Color\",\"value\":\"Red\"}]');

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
  ADD UNIQUE KEY `categorySlug` (`categorySlug`);

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
