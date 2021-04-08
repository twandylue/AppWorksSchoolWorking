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
-- Table structure for table `campaign_table`
--

DROP TABLE IF EXISTS `campaign_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_table` (
  `campaign_id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `picture` text,
  `story` text,
  PRIMARY KEY (`campaign_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `campaign_table_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product_table` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_table`
--

LOCK TABLES `campaign_table` WRITE;
/*!40000 ALTER TABLE `campaign_table` DISABLE KEYS */;
INSERT INTO `campaign_table` VALUES (3,1,'upload_pics\\campaign_image-1617491091289-knowledge_graph_logo.png','111'),(4,1,'upload_pics\\campaign_image-1617491125601-knowledge_graph_logo.png','111'),(5,1,'upload_pics\\campaign_image-1617491149494-knowledge_graph_logo.png','111'),(6,2,'upload_pics\\campaign_image-1617495043134-knowledge_graph_logo.png','222'),(7,3,'upload_pics\\campaign_image-1617495047339-knowledge_graph_logo.png','333'),(8,4,'upload_pics\\campaign_image-1617495062891-knowledge_graph_logo.png','aaa'),(9,4,'upload_pics\\campaign_image-1617498519420-knowledge_graph_logo.png','aaa'),(10,5,'upload_pics\\campaign_image-1617498525827-knowledge_graph_logo.png','bbb'),(11,6,'upload_pics\\campaign_image-1617498797251-knowledge_graph_logo.png','ccc'),(12,7,'upload_pics\\campaign_image-1617498875698-knowledge_graph_logo.png','eee'),(13,7,'upload_pics\\campaign_image-1617498899197-knowledge_graph_logo.png','eee'),(14,1,'public\\upload_pics','test'),(15,2,'public\\upload_pics','test22'),(16,2,'public\\upload_pics','test22'),(17,2,'upload_pics\\campaign_image-1617698534114-knowledge_graph_logo.png','test22'),(18,2,'campaign_image-1617698650020-knowledge_graph_logo.png\\undefined','test22'),(19,2,'upload_pics\\campaign_image-1617698664071-knowledge_graph_logo.png','test22'),(20,2,'upload_pics\\campaign_image-1617698860731-knowledge_graph_logo.png','test22'),(21,2,'upload_pics\\campaign_image-1617698908836-knowledge_graph_logo.png','test22'),(22,2,'upload_pics\\campaign_image-1617698963368-knowledge_graph_logo.png','test22'),(23,2,'upload_pics\\campaign_image-1617699009699-knowledge_graph_logo.png','test22'),(24,2,'upload_pics\\campaign_image-1617699052421-knowledge_graph_logo.png','test22'),(25,2,'AtSchool\\AppWorksSchoolWorking','test22'),(26,2,'AtSchool\\AppWorksSchoolWorking','test22'),(27,2,'AtSchool\\AppWorksSchoolWorking','test22'),(28,2,'upload_pics\\campaign_image-1617699269767-knowledge_graph_logo.png','test22'),(29,1,'upload_pics\\campaign_image-1617862940996-knowledge_graph_logo.png','test1');
/*!40000 ALTER TABLE `campaign_table` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `colors` VALUES ('亮綠','DDFFBB'),('深藍','334455'),('淺棕','BB7744'),('淺灰','CCCCCC'),('淺藍','DDF0FF'),('白色','FFFFFF');
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
INSERT INTO `images` VALUES (201807201824,'upload_images\\images-1617847177595-1.jpg'),(201807201824,'upload_images\\images-1617847177597-0.jpg'),(201807201824,'upload_images\\images-1617847177598-1.jpg'),(201807202140,'upload_images\\images-1617847729625-0.jpg'),(201807202140,'upload_images\\images-1617847729626-1.jpg'),(201807202140,'upload_images\\images-1617847729627-0.jpg'),(201807202150,'upload_images\\images-1617847970055-0.jpg'),(201807202150,'upload_images\\images-1617847970056-1.jpg'),(201807202150,'upload_images\\images-1617847970056-0.jpg'),(201807202157,'upload_images\\images-1617848558174-1.jpg'),(201807202157,'upload_images\\images-1617848558175-0.jpg'),(201807202157,'upload_images\\images-1617848558175-1.jpg'),(201807242211,'upload_images\\images-1617848739670-1.jpg'),(201807242211,'upload_images\\images-1617848739671-0.jpg'),(201807242211,'upload_images\\images-1617848739672-1.jpg'),(201807242216,'upload_images\\images-1617848878593-1.jpg'),(201807242216,'upload_images\\images-1617848878594-0.jpg'),(201807242216,'upload_images\\images-1617848878596-1.jpg'),(1,'upload_images\\images-1617861220547-knowledge_graph_logo.png'),(1,'upload_images\\images-1617861220548-knowledge_graph_logo.png'),(1,'upload_images\\images-1617861220548-knowledge_graph_logo.png'),(2,'upload_images\\images-1617862228896-knowledge_graph_logo.png'),(2,'upload_images\\images-1617862228897-knowledge_graph_logo.png'),(2,'upload_images\\images-1617862228898-knowledge_graph_logo.png'),(3,'upload_images\\images-1617862333361-knowledge_graph_logo.png'),(3,'upload_images\\images-1617862333362-knowledge_graph_logo.png'),(3,'upload_images\\images-1617862333362-knowledge_graph_logo.png');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_list_table`
--

DROP TABLE IF EXISTS `order_list_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_list_table` (
  `order_list_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `id` bigint NOT NULL,
  `name` text NOT NULL,
  `price` bigint NOT NULL,
  `color_code` text NOT NULL,
  `color_name` text NOT NULL,
  `size` text NOT NULL,
  `quantity` bigint NOT NULL,
  PRIMARY KEY (`order_list_id`),
  KEY `id` (`id`),
  CONSTRAINT `order_list_table_ibfk_1` FOREIGN KEY (`id`) REFERENCES `product_table` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_list_table`
--

LOCK TABLES `order_list_table` WRITE;
/*!40000 ALTER TABLE `order_list_table` DISABLE KEYS */;
INSERT INTO `order_list_table` VALUES (1,12,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(2,12,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(3,12,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(4,13,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(5,13,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(6,13,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(7,14,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(8,14,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(9,14,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(10,15,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(11,15,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(12,15,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(13,16,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(14,16,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(15,16,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(16,17,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(17,17,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(18,17,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(19,18,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(20,18,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(21,18,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(22,19,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(23,19,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(24,19,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(25,20,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(26,20,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(27,20,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(28,21,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(29,21,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(30,21,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(31,22,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(32,22,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(33,22,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(34,23,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(35,23,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(36,23,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(37,24,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(38,24,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(39,24,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(40,25,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(41,25,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(42,25,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(43,26,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(44,26,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(45,26,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(46,27,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(47,27,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(48,27,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(49,28,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(50,28,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(51,28,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(52,29,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(53,29,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(54,29,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(55,30,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(56,30,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(57,30,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(58,31,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(59,31,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(60,31,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(61,32,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(62,32,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(63,32,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(64,33,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(65,33,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(66,33,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(67,34,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(68,34,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(69,34,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(70,35,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(71,35,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(72,35,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(73,36,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(74,36,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(75,36,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(76,37,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(77,37,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(78,37,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(79,38,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(80,38,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(81,38,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(82,39,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(83,39,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(84,39,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(85,40,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(86,40,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(87,40,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(88,41,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(89,41,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(90,41,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(91,42,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(92,42,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(93,42,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(94,43,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(95,43,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(96,43,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(97,44,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(98,44,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(99,44,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(100,45,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(101,45,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(102,45,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(103,46,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(104,46,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(105,46,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(106,47,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(107,47,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(108,47,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(109,48,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(110,48,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(111,48,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(112,49,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(113,49,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(114,49,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(115,50,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(116,50,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(117,50,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(118,51,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(119,51,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(120,51,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(121,52,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(122,52,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(123,52,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(124,53,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(125,53,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(126,53,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(127,54,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(128,54,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(129,54,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(130,55,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(131,55,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(132,55,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(133,56,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(134,56,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(135,56,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(136,57,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(137,57,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(138,57,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(139,58,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(140,58,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(141,58,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(142,59,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(143,59,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(144,59,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(145,60,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(146,60,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(147,60,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(148,61,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(149,61,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(150,61,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(151,62,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(152,62,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(153,62,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(154,63,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(155,63,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(156,63,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(157,64,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(158,64,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(159,64,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(160,65,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(161,65,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(162,65,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(163,66,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(164,66,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(165,66,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(166,67,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(167,67,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(168,67,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(169,68,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(170,68,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(171,68,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(172,69,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(173,69,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(174,69,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(175,70,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(176,70,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(177,70,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(178,71,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(179,71,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(180,71,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(181,72,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(182,72,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(183,72,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(184,73,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(185,73,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(186,73,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(187,74,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(188,74,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(189,74,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(190,75,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(191,75,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(192,75,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(193,76,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(194,76,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(195,76,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(196,77,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(197,77,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(198,77,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(199,78,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(200,78,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(201,78,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(202,79,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(203,79,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(204,79,3,'活力花紋',129,'DDF0FF','淺藍','M',1);
/*!40000 ALTER TABLE `order_list_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_table`
--

DROP TABLE IF EXISTS `order_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_table` (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `paid` bigint DEFAULT NULL,
  `shipping` text,
  `payment` text,
  `subtotal` bigint DEFAULT NULL,
  `freight` bigint DEFAULT NULL,
  `total` bigint DEFAULT NULL,
  `name` text,
  `phone` text,
  `email` text,
  `address` text,
  `time` text,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_table`
--

LOCK TABLES `order_table` WRITE;
/*!40000 ALTER TABLE `order_table` DISABLE KEYS */;
INSERT INTO `order_table` VALUES (1,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(2,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(3,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(4,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(5,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(6,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(7,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(8,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(9,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(10,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(11,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(12,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(13,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(14,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(15,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(16,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(17,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(18,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(19,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(20,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(21,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(22,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(23,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(24,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(25,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(26,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(27,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(28,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(29,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(30,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(31,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(32,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(33,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(34,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(35,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(36,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(37,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(38,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(39,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(40,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(41,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(42,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(43,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(44,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(45,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(46,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(47,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(48,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(49,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(50,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(51,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(52,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(53,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(54,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(55,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(56,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(57,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(58,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(59,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(60,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(61,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(62,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(63,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(64,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(65,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(66,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(67,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(68,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(69,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(70,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(71,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(72,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(73,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(74,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(75,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(76,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(77,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(78,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(79,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning');
/*!40000 ALTER TABLE `order_table` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_table`
--

LOCK TABLES `product_table` WRITE;
/*!40000 ALTER TABLE `product_table` DISABLE KEYS */;
INSERT INTO `product_table` VALUES (1,'test1','test1',111,'test1','test1','test1','test1','test1','test1','upload_images\\main_image-1617861220545-knowledge_graph_logo.png','men'),(2,'test2','test2',123,'test2','test2','test2','test2','test2','test2','upload_images\\main_image-1617862228895-knowledge_graph_logo.png','women'),(3,'test2','test2',222,'test2','test2','test2','test2','test2','test2','upload_images\\main_image-1617862333358-knowledge_graph_logo.png','women'),(201807201824,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.',' [ \"S\", \"M\", \"L\" ]','upload_images\\main_image-1617847177591-main.jpg','women'),(201807202140,'透肌澎澎防曬襯衫','厚薄：薄 彈性：無',599,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_images\\main_image-1617847729622-main.jpg','women'),(201807202150,'小扇紋細織上衣','厚薄：薄 彈性：無',599,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\" ]','upload_images\\main_image-1617847970054-main.jpg','women'),(201807202157,'活力花紋長筒牛仔褲','厚薄：薄 彈性：無',1299,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_images\\main_image-1617848558171-main.jpg','women'),(201807242211,'純色輕薄百搭襯衫','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.',' [ \"M\", \"L\", \"XL\" ]','upload_images\\main_image-1617848739668-main.jpg','men'),(201807242216,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_images\\main_image-1617848878588-main.jpg','men');
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
  `stock` int NOT NULL,
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
INSERT INTO `stock` VALUES (201807201824,'FFFFFF','S',2),(201807201824,'FFFFFF','M',1),(201807201824,'FFFFFF','L',2),(201807201824,'DDFFBB','S',9),(201807201824,'DDFFBB','M',0),(201807201824,'DDFFBB','L',5),(201807201824,'CCCCCC','S',8),(201807201824,'CCCCCC','M',5),(201807201824,'CCCCCC','L',9),(201807202140,'DDFFBB','S',7),(201807202140,'DDFFBB','M',5),(201807202140,'DDFFBB','L',8),(201807202140,'CCCCCC','S',7),(201807202140,'CCCCCC','M',5),(201807202140,'CCCCCC','L',8),(201807202150,'DDFFBB','S',3),(201807202150,'DDFFBB','M',5),(201807202150,'CCCCCC','M',1),(201807202150,'CCCCCC','M',1),(201807202150,'BB7744','S',2),(201807202150,'BB7744','M',6),(201807202157,'DDF0FF','S',8),(201807202157,'DDF0FF','M',5),(201807202157,'DDF0FF','L',6),(201807202157,'CCCCCC','S',0),(201807202157,'CCCCCC','M',6),(201807202157,'CCCCCC','L',5),(201807202157,'334455','S',2),(201807202157,'334455','M',7),(201807202157,'334455','L',9),(201807242211,'FFFFFF','M',5),(201807242211,'FFFFFF','L',7),(201807242211,'FFFFFF','XL',1),(201807242211,'DDF0FF','M',1),(201807242211,'DDF0FF','L',4),(201807242211,'DDF0FF','XL',3),(201807242216,'FFFFFF','S',10),(201807242216,'FFFFFF','M',5),(201807242216,'FFFFFF','L',6),(201807242216,'CCCCCC','S',1),(201807242216,'CCCCCC','M',3),(201807242216,'CCCCCC','L',10),(1,'FFFFFF','S',10),(1,'FFFFFF','M',5),(1,'FFFFFF','L',6),(2,'FFFFFF','S',10),(2,'FFFFFF','M',5),(2,'FFFFFF','L',6),(3,'FFFFFF','S',10),(3,'FFFFFF','M',5),(3,'FFFFFF','L',6);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info_table`
--

DROP TABLE IF EXISTS `user_info_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info_table`
--

LOCK TABLES `user_info_table` WRITE;
/*!40000 ALTER TABLE `user_info_table` DISABLE KEYS */;
INSERT INTO `user_info_table` VALUES (1,'test','test@test.com','$2b$10$wLNMNxG/JUBcdEShk6/S/OMYGmdJvleqSNqO4WB/65clPokyExYtS'),(2,'test2','test2@test.com','$2b$10$EPKlroWhSrHwVbDZ3OvBjugpSXJZC9yZBDsrSrVUt8IHyK/z4ktXS'),(3,'test3','test3@test.com','$2b$10$Og38VfIaOpZF83GJxtImKOmrHoeKiOjTc2eDeqNq040.3xpzPFj8K'),(4,'test4','test4@test.com','$2b$10$y/kaiRgZq6BK6/fOGpJ/VOQE30Kfo9QAavXXI3MreWe39QAzUB7ky'),(5,'test5','test5@test.com','$2b$10$ydpN5mR/vhLCYS.5SLDyXexDlWvmbN4m.Xqmuf13rtO4JUBCcyKQ6'),(6,'test6','test6@test.com','$2b$10$Kz/CEgjjzB36LJ639TbiZ.Tx76n4ppSiLA0sXrpnneI0y8aGTaoE6'),(7,'test7','test7@test.com','$2b$10$KqmeuMI.Tlvoo0lhtcynNOR22aBcbmnlSKUznkci2nTNBoV1FIama'),(8,'test8','test8@test.com','$2b$10$xy8eIcPPyBBdJt4nwHWWXeTHcduCArIdF4mW5f/D8GbNnFqMHlOxC'),(9,'undefined','test9@test.com','$2b$10$3iGIuueD4KiHCgbhgN2.TeWVO65tlfdgHIuf3M0pNn1EPJSEMtRUC'),(10,'陸安','protonlue@gmail.com',NULL);
/*!40000 ALTER TABLE `user_info_table` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-08 14:40:39
