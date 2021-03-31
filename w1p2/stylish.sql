-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: stylish
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `colors`
--

DROP TABLE IF EXISTS `colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colors` (
  `name` varchar(50) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  PRIMARY KEY (`code`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colors`
--

LOCK TABLES `colors` WRITE;
/*!40000 ALTER TABLE `colors` DISABLE KEYS */;
INSERT INTO `colors` VALUES ('11','11'),('12345','12345'),('123456','123456'),('22','22'),('33','33'),('55','55'),('66','66');
/*!40000 ALTER TABLE `colors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `product_id` bigint NOT NULL,
  `image` text NOT NULL,
  KEY `product_id` (`product_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (4,'publicupload_picsimage1-1616984956100-IMG_1276.JPG'),(4,'publicupload_picsimage2-1616984956120-IMG_1306.JPG'),(4,'publicupload_picsimage3-1616984956138-IMG_1311.JPG'),(66,'publicupload_picsimages-1616986523618-IMG_1276.JPG'),(66,'publicupload_picsimages-1616986523634-IMG_1306.JPG'),(66,'publicupload_picsimages-1616986523661-IMG_1311.JPG'),(12345,'publicupload_picsimages-1616987248514-IMG_1276.JPG'),(12345,'publicupload_picsimages-1616987248531-IMG_1306.JPG'),(12345,'publicupload_picsimages-1616987248552-IMG_1311.JPG'),(123456,'publicupload_picsimages-1616987343139-IMG_1276.JPG'),(123456,'publicupload_picsimages-1616987343153-IMG_1306.JPG'),(123456,'publicupload_picsimages-1616987343186-IMG_1311.JPG'),(22,'publicupload_picsimages-1616988610022-IMG_1276.JPG'),(22,'publicupload_picsimages-1616988610036-IMG_1306.JPG'),(22,'publicupload_picsimages-1616988610056-IMG_1311.JPG'),(33,'publicupload_picsimages-1616988686382-IMG_1435.JPG'),(33,'publicupload_picsimages-1616988686419-IMG_1495.JPG'),(33,'publicupload_picsimages-1616988686434-IMG_1514.JPG'),(55,'publicupload_picsimages-1616988771585-IMG_1370.JPG'),(55,'publicupload_picsimages-1616988771645-IMG_1384.JPG'),(55,'publicupload_picsimages-1616988771668-IMG_1387.JPG');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_table`
--

DROP TABLE IF EXISTS `product_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_table` (
  `id` bigint NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `price` int NOT NULL,
  `texture` text NOT NULL,
  `wash` text NOT NULL,
  `place` text NOT NULL,
  `note` text NOT NULL,
  `story` text NOT NULL,
  `sizes` text NOT NULL,
  `main_image` text NOT NULL,
  `catagory` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_table`
--

LOCK TABLES `product_table` WRITE;
/*!40000 ALTER TABLE `product_table` DISABLE KEYS */;
INSERT INTO `product_table` VALUES (2,'2','2',2,'2','2','2','2','2','2','publicupload_picsmain_image-1616984730495-IMG_1250.JPG',NULL),(4,'11','11',11,'11','11','11','11','11','11','publicupload_picsmain_image-1616984956067-IMG_1250.JPG',NULL),(11,'11','11',11,'11','11','11','11','11','11','publicupload_picsmain_image-1616984865186-IMG_1250.JPG',NULL),(22,'22','22',22,'22','22','22','22','22','22','publicupload_picsmain_image-1616988609990-IMG_1250.JPG','undefined'),(33,'33','33',33,'33','33','33','33','33','33','publicupload_picsmain_image-1616988686338-IMG_1413.JPG','women'),(55,'55','55',55,'55','55','55','55','55','55','publicupload_picsmain_image-1616988771573-IMG_1311.JPG','men'),(66,'66','66',66,'66','66','66','66','66','66','publicupload_picsmain_image-1616986523581-IMG_1250.JPG',NULL),(111,'11','11',11,'11','11','11','11','11','11','publicupload_picsmain_image-1616984945368-IMG_1250.JPG',NULL),(123,'66','66',66,'66','66','66','66','66','66','publicupload_picsmain_image-1616987192478-IMG_1250.JPG',NULL),(666,'66','66',66,'66','66','66','66','66','66','publicupload_picsmain_image-1616987166236-IMG_1250.JPG',NULL),(12345,'12345','12345',12345,'12345','12345','12345','12345','12345','12345','publicupload_picsmain_image-1616987248486-IMG_1495.JPG',NULL),(123456,'123456','123456',123456,'123456','123456','123456','123456','123456','123456','publicupload_picsmain_image-1616987343117-IMG_1495.JPG',NULL);
/*!40000 ALTER TABLE `product_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `product_id` bigint NOT NULL,
  `color_code` varchar(255) NOT NULL,
  `size` text NOT NULL,
  `quantity` int NOT NULL,
  KEY `product_id` (`product_id`),
  KEY `color_code` (`color_code`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`id`),
  CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`color_code`) REFERENCES `colors` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (4,'11','11',11),(66,'66','66',66),(666,'66','66',66),(123,'66','66',66),(12345,'12345','12345',12345),(123456,'123456','123456',123456),(22,'22','22',22),(33,'33','33',33),(55,'55','55',55);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-29 11:35:09
