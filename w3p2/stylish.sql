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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_table`
--

LOCK TABLES `campaign_table` WRITE;
/*!40000 ALTER TABLE `campaign_table` DISABLE KEYS */;
INSERT INTO `campaign_table` VALUES (3,1,'upload_pics\\campaign_image-1617491091289-knowledge_graph_logo.png','111'),(4,1,'upload_pics\\campaign_image-1617491125601-knowledge_graph_logo.png','111'),(5,1,'upload_pics\\campaign_image-1617491149494-knowledge_graph_logo.png','111'),(6,2,'upload_pics\\campaign_image-1617495043134-knowledge_graph_logo.png','222'),(7,3,'upload_pics\\campaign_image-1617495047339-knowledge_graph_logo.png','333'),(8,4,'upload_pics\\campaign_image-1617495062891-knowledge_graph_logo.png','aaa'),(9,4,'upload_pics\\campaign_image-1617498519420-knowledge_graph_logo.png','aaa'),(10,5,'upload_pics\\campaign_image-1617498525827-knowledge_graph_logo.png','bbb'),(11,6,'upload_pics\\campaign_image-1617498797251-knowledge_graph_logo.png','ccc'),(12,7,'upload_pics\\campaign_image-1617498875698-knowledge_graph_logo.png','eee'),(13,7,'upload_pics\\campaign_image-1617498899197-knowledge_graph_logo.png','eee'),(14,1,'public\\upload_pics','test'),(15,2,'public\\upload_pics','test22'),(16,2,'public\\upload_pics','test22'),(17,2,'upload_pics\\campaign_image-1617698534114-knowledge_graph_logo.png','test22'),(18,2,'campaign_image-1617698650020-knowledge_graph_logo.png\\undefined','test22'),(19,2,'upload_pics\\campaign_image-1617698664071-knowledge_graph_logo.png','test22'),(20,2,'upload_pics\\campaign_image-1617698860731-knowledge_graph_logo.png','test22'),(21,2,'upload_pics\\campaign_image-1617698908836-knowledge_graph_logo.png','test22'),(22,2,'upload_pics\\campaign_image-1617698963368-knowledge_graph_logo.png','test22'),(23,2,'upload_pics\\campaign_image-1617699009699-knowledge_graph_logo.png','test22'),(24,2,'upload_pics\\campaign_image-1617699052421-knowledge_graph_logo.png','test22'),(25,2,'AtSchool\\AppWorksSchoolWorking','test22'),(26,2,'AtSchool\\AppWorksSchoolWorking','test22'),(27,2,'AtSchool\\AppWorksSchoolWorking','test22'),(28,2,'upload_pics\\campaign_image-1617699269767-knowledge_graph_logo.png','test22'),(29,1,'upload_pics\\campaign_image-1617862940996-knowledge_graph_logo.png','test1'),(30,201807201824,'upload_pics\\campaign_image-1618364353246-0.jpg','test'),(31,201807201824,'upload_pics\\campaign_image-1618364536157-0.jpg','test'),(32,201807242216,'upload_pics\\campaign_image-1618364686411-1.jpg','testtest'),(33,201807201824,'upload_pics\\campaign_image-1618402638197-0.jpg','test1233212'),(34,201807201824,'upload_pics\\campaign_image-1618402684962-1.jpg','test12333333');
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
INSERT INTO `images` VALUES (201807201824,'upload_images\\images-1617866534787-1.jpg'),(201807201824,'upload_images\\images-1617866534789-0.jpg'),(201807201824,'upload_images\\images-1617866534790-1.jpg'),(201807202140,'upload_images\\images-1617866632551-1.jpg'),(201807202140,'upload_images\\images-1617866632552-0.jpg'),(201807202140,'upload_images\\images-1617866632553-1.jpg'),(201807202150,'upload_images\\images-1617867524230-1.jpg'),(201807202150,'upload_images\\images-1617867524230-0.jpg'),(201807202150,'upload_images\\images-1617867524231-1.jpg'),(201807202157,'upload_images\\images-1617867588629-1.jpg'),(201807202157,'upload_images\\images-1617867588630-0.jpg'),(201807202157,'upload_images\\images-1617867588631-1.jpg'),(201807242211,'upload_images\\images-1617867653591-0.jpg'),(201807242211,'upload_images\\images-1617867653594-1.jpg'),(201807242211,'upload_images\\images-1617867653594-0.jpg'),(201807242216,'upload_images\\images-1617867725424-1.jpg'),(201807242216,'upload_images\\images-1617867725425-0.jpg'),(201807242216,'upload_images\\images-1617867725426-1.jpg'),(201807242216,'upload_images\\images-1618393409726-1.jpg'),(201807242216,'upload_images\\images-1618393409728-1.jpg'),(201807242216,'upload_images\\images-1618393409729-1.jpg');
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
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_list_table`
--

LOCK TABLES `order_list_table` WRITE;
/*!40000 ALTER TABLE `order_list_table` DISABLE KEYS */;
INSERT INTO `order_list_table` VALUES (1,12,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(2,12,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(3,12,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(4,13,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(5,13,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(6,13,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(7,14,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(8,14,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(9,14,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(10,15,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(11,15,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(12,15,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(13,16,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(14,16,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(15,16,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(16,17,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(17,17,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(18,17,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(19,18,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(20,18,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(21,18,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(22,19,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(23,19,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(24,19,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(25,20,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(26,20,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(27,20,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(28,21,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(29,21,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(30,21,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(31,22,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(32,22,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(33,22,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(34,23,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(35,23,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(36,23,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(37,24,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(38,24,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(39,24,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(40,25,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(41,25,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(42,25,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(43,26,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(44,26,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(45,26,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(46,27,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(47,27,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(48,27,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(49,28,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(50,28,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(51,28,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(52,29,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(53,29,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(54,29,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(55,30,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(56,30,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(57,30,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(58,31,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(59,31,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(60,31,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(61,32,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(62,32,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(63,32,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(64,33,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(65,33,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(66,33,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(67,34,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(68,34,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(69,34,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(70,35,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(71,35,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(72,35,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(73,36,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(74,36,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(75,36,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(76,37,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(77,37,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(78,37,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(79,38,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(80,38,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(81,38,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(82,39,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(83,39,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(84,39,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(85,40,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(86,40,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(87,40,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(88,41,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(89,41,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(90,41,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(91,42,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(92,42,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(93,42,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(94,43,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(95,43,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(96,43,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(97,44,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(98,44,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(99,44,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(100,45,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(101,45,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(102,45,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(103,46,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(104,46,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(105,46,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(106,47,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(107,47,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(108,47,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(109,48,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(110,48,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(111,48,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(112,49,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(113,49,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(114,49,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(115,50,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(116,50,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(117,50,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(118,51,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(119,51,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(120,51,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(121,52,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(122,52,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(123,52,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(124,53,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(125,53,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(126,53,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(127,54,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(128,54,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(129,54,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(130,55,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(131,55,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(132,55,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(133,56,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(134,56,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(135,56,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(136,57,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(137,57,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(138,57,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(139,58,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(140,58,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(141,58,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(142,59,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(143,59,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(144,59,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(145,60,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(146,60,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(147,60,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(148,61,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(149,61,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(150,61,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(151,62,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(152,62,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(153,62,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(154,63,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(155,63,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(156,63,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(157,64,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(158,64,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(159,64,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(160,65,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(161,65,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(162,65,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(163,66,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(164,66,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(165,66,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(166,67,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(167,67,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(168,67,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(169,68,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(170,68,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(171,68,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(172,69,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(173,69,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(174,69,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(175,70,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(176,70,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(177,70,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(178,71,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(179,71,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(180,71,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(181,72,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(182,72,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(183,72,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(184,73,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(185,73,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(186,73,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(187,74,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(188,74,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(189,74,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(190,75,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(191,75,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(192,75,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(193,76,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(194,76,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(195,76,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(196,77,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(197,77,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(198,77,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(199,78,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(200,78,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(201,78,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(202,79,1,'牛仔褲',1313,'DDF0FF','淺藍','M',1),(203,79,2,'活力花紋長筒',129999,'DDF0FF','淺藍','M',1),(204,79,3,'活力花紋',129,'DDF0FF','淺藍','M',1),(205,80,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(206,80,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',2),(207,80,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',2),(208,81,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(209,81,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',5),(210,81,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',7),(211,82,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(212,82,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',5),(213,82,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',7),(214,83,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(215,83,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',5),(216,83,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',7),(217,84,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(218,84,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',4),(219,84,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(220,85,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(221,85,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',4),(222,85,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(223,86,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(224,86,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',4),(225,86,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(226,87,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(227,87,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',4),(228,87,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(229,88,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(230,88,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',4),(231,88,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(232,89,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(233,89,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',4),(234,89,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(235,90,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(236,90,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',4),(237,90,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(238,91,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(239,91,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',5),(240,91,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(241,92,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(242,92,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',5),(243,92,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(244,93,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(245,93,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',5),(246,93,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(247,94,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(248,94,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',5),(249,94,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(250,95,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(251,95,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',5),(252,95,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',4),(253,96,201807202157,'活力花紋長筒牛仔褲',1299,'334455','深藍','S',2),(254,96,201807202140,'透肌澎澎防曬襯衫',599,'DDFFBB','亮綠','M',3),(255,96,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','S',6),(256,96,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','M',1),(257,97,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','M',2),(258,97,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','M',2),(259,97,201807202140,'透肌澎澎防曬襯衫',599,'CCCCCC','淺灰','M',2),(260,98,201807202150,'小扇紋細織上衣',599,'CCCCCC','淺灰','S',3);
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
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_table`
--

LOCK TABLES `order_table` WRITE;
/*!40000 ALTER TABLE `order_table` DISABLE KEYS */;
INSERT INTO `order_table` VALUES (1,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(2,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(3,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(4,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(5,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(6,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(7,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(8,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(9,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(10,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(11,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(12,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(13,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(14,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(15,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(16,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(17,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(18,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(19,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(20,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(21,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(22,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(23,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(24,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(25,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(26,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(27,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(28,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(29,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(30,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(31,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(32,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(33,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(34,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(35,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(36,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(37,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(38,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(39,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(40,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(41,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(42,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(43,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(44,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(45,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(46,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(47,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(48,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(49,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(50,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(51,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(52,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(53,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(54,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(55,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(56,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(57,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(58,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(59,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(60,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(61,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(62,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(63,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(64,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(65,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(66,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(67,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(68,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(69,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(70,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(71,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(72,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(73,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(74,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(75,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(76,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(77,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(78,1,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(79,0,'delivery','credit_card',1234,14,1300,'Luke','0987654321','luke@gmail.com','市政府站','morning'),(80,1,'delivery','credit_card',4994,60,5054,'test','test','test','test','afternoon'),(81,1,'delivery','credit_card',9786,60,9846,'test2','test2','test2','test2','morning'),(82,1,'delivery','credit_card',9786,60,9846,'test','test','test','test','morning'),(83,1,'delivery','credit_card',9786,60,9846,'test','tets','test','test','morning'),(84,1,'delivery','credit_card',7390,60,7450,'test','test','test','test','morning'),(85,1,'delivery','credit_card',7390,60,7450,'test','test','test','test','morning'),(86,1,'delivery','credit_card',7390,60,7450,'test','test','test','tset','morning'),(87,1,'delivery','credit_card',7390,60,7450,'test','test','test','test','anytime'),(88,1,'delivery','credit_card',7390,60,7450,'test','test','test','test','afternoon'),(89,1,'delivery','credit_card',7390,60,7450,'test','test','test','test','afternoon'),(90,1,'delivery','credit_card',7390,60,7450,'test','test','test','test','afternoon'),(91,1,'delivery','credit_card',7989,60,8049,'test','test','test','test','afternoon'),(92,1,'delivery','credit_card',7989,60,8049,'test','test','test','test','afternoon'),(93,1,'delivery','credit_card',7989,60,8049,'test','test','test','test','morning'),(94,1,'delivery','credit_card',7989,60,8049,'test','test','test','test','morning'),(95,1,'delivery','credit_card',7989,60,8049,'test','test','test','test','afternoon'),(96,1,'delivery','credit_card',8588,60,8648,'test','test','test','test','anytime'),(97,1,'delivery','credit_card',3594,60,3654,'test','test','test','test','morning'),(98,1,'delivery','credit_card',1797,60,1857,'test','test','test','test','afternoon');
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
INSERT INTO `product_table` VALUES (201807201824,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_images\\main_image-1617866534785-main.jpg','women'),(201807202140,'透肌澎澎防曬襯衫','厚薄：薄 彈性：無',599,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_images\\main_image-1617866632549-main.jpg','women'),(201807202150,'小扇紋細織上衣','厚薄：薄 彈性：無',599,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\" ]','upload_images\\main_image-1617867524228-main.jpg','women'),(201807202157,'活力花紋長筒牛仔褲','厚薄：薄 彈性：無',1299,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_images\\main_image-1617867588627-main.jpg','women'),(201807242211,'純色輕薄百搭襯衫','厚薄：薄 彈性：無',799,'棉 100%\"','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_images\\main_image-1617867653591-main.jpg','men'),(201807242216,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_images\\main_image-1617867725423-main.jpg','men');
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
INSERT INTO `stock` VALUES (201807201824,'FFFFFF','S',2),(201807201824,'FFFFFF','M',1),(201807201824,'FFFFFF','L',2),(201807201824,'DDFFBB','S',9),(201807201824,'DDFFBB','M',0),(201807201824,'DDFFBB','L',5),(201807201824,'CCCCCC','S',8),(201807201824,'CCCCCC','M',5),(201807201824,'CCCCCC','L',9),(201807202140,'DDFFBB','S',7),(201807202140,'DDFFBB','M',5),(201807202140,'DDFFBB','L',8),(201807202140,'CCCCCC','S',7),(201807202140,'CCCCCC','M',5),(201807202140,'CCCCCC','L',8),(201807202150,'DDFFBB','S',3),(201807202150,'DDFFBB','M',5),(201807202150,'BB7744','S',2),(201807202150,'BB7744','M',6),(201807202157,'DDF0FF','S',8),(201807202157,'DDF0FF','M',5),(201807202157,'DDF0FF','L',6),(201807202157,'CCCCCC','S',0),(201807202157,'CCCCCC','M',6),(201807202157,'CCCCCC','L',5),(201807202157,'334455','S',2),(201807202157,'334455','M',7),(201807202157,'334455','L',9),(201807242211,'FFFFFF','M',5),(201807242211,'FFFFFF','L',7),(201807242211,'FFFFFF','XL',1),(201807242211,'DDF0FF','M',1),(201807242211,'DDF0FF','L',4),(201807242211,'DDF0FF','XL',3),(201807242216,'FFFFFF','S',10),(201807242216,'FFFFFF','M',5),(201807242216,'FFFFFF','L',6),(201807242216,'CCCCCC','S',1),(201807242216,'CCCCCC','M',3),(201807242216,'CCCCCC','L',10),(201807202150,'CCCCCC','M',4),(201807202150,'CCCCCC','S',8);
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
  `userType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info_table`
--

LOCK TABLES `user_info_table` WRITE;
/*!40000 ALTER TABLE `user_info_table` DISABLE KEYS */;
INSERT INTO `user_info_table` VALUES (1,'test','test@test.com','$2b$10$wLNMNxG/JUBcdEShk6/S/OMYGmdJvleqSNqO4WB/65clPokyExYtS','admin'),(2,'test2','test2@test.com','$2b$10$EPKlroWhSrHwVbDZ3OvBjugpSXJZC9yZBDsrSrVUt8IHyK/z4ktXS',NULL),(3,'test3','test3@test.com','$2b$10$Og38VfIaOpZF83GJxtImKOmrHoeKiOjTc2eDeqNq040.3xpzPFj8K',NULL),(4,'test4','test4@test.com','$2b$10$y/kaiRgZq6BK6/fOGpJ/VOQE30Kfo9QAavXXI3MreWe39QAzUB7ky',NULL),(5,'test5','test5@test.com','$2b$10$ydpN5mR/vhLCYS.5SLDyXexDlWvmbN4m.Xqmuf13rtO4JUBCcyKQ6',NULL),(6,'test6','test6@test.com','$2b$10$Kz/CEgjjzB36LJ639TbiZ.Tx76n4ppSiLA0sXrpnneI0y8aGTaoE6',NULL),(7,'test7','test7@test.com','$2b$10$KqmeuMI.Tlvoo0lhtcynNOR22aBcbmnlSKUznkci2nTNBoV1FIama',NULL),(8,'test8','test8@test.com','$2b$10$xy8eIcPPyBBdJt4nwHWWXeTHcduCArIdF4mW5f/D8GbNnFqMHlOxC',NULL),(9,'undefined','test9@test.com','$2b$10$3iGIuueD4KiHCgbhgN2.TeWVO65tlfdgHIuf3M0pNn1EPJSEMtRUC',NULL),(10,'陸安','protonlue@gmail.com',NULL,NULL),(11,'undefined','undefined',NULL,NULL),(12,'test','test','$2b$10$c5ZSij87Q7RuXrrYQOt3eOEs0ET2czHVl1Or0qdpaurcuAaPlwkxC','admin'),(13,'test2','test2','$2b$10$jCv5egHf/gp4ZxlzPeh8ZuQD7golyU9TOgjrAP2tnXguY8InU7tcK',NULL),(14,'test','test3','$2b$10$xy8gvGTyh6lkCEw5DGijDuD.GhJhx7aBopr/pYqciOqwogcA2GXd2',NULL),(15,'test','test4','$2b$10$1MK2/tiqYhnrXOd5QoNWEuNMJqWcLmPdprDq8bn3YSJdULWk/Ff6G',NULL),(16,'test','test5','$2b$10$TNaHheDcnLZiUTY6aUaWmOwTRspEhbcwEiAXDK.wXVKCSoF8pJrJS',NULL),(17,'test','test6','$2b$10$ISS16Oz442xJFVe1J/QUQuuoMiBrv4NzA5IM3gEDP8/jRzaA7u5te',NULL),(18,'test','test7','$2b$10$fp7dyx4pjScgQitS9mbc3OnOGnoWv0AokSvP6Loxcx7MTLOupN7li',NULL),(19,'test','test8','$2b$10$eVey5kWgj1IYdUdRQV0FmueZ4dq6MrjauO31WWLK.Yo0B5lUqoIKK',NULL),(20,'test','test9','$2b$10$wafFWD/SIkJ6n4xFOxsBD.tDHEtzTTLhzRGoICw5UjhuG5RvFpKbO',NULL),(21,'test','test10','$2b$10$C8UBTcvu9Eur0dcvGmyY8efab/MbLVn/lVGhC2NNU78gqVFlXL0x2',NULL),(22,'test','test11','$2b$10$/LblYWGEfZGkoaPdjVkW6uR6QnjsA0lmXVa4sQtXcIztfMpfIDi4e',NULL),(23,'test','test12','$2b$10$iqjtK4jkkUnSeHjKowuk6uK4SURojYxnWKoo1k1lz2PUiPlsbExu6',NULL),(24,'test','test13','$2b$10$WiFRtnGCeCLk17Gx1MWMbedcCBmdP1/u2DDMFtECsdwbYEmdwQvqS',NULL),(25,'test','test15','$2b$10$d9NVmt0qioCLOw/b592IfuiLt1g56S7CUMyjfgRs7DpWLu74qSgo2',NULL),(26,'test','test16','$2b$10$lpjvdATCUWe50RXG0EZsCu1of6TANIe4OCwoCc2CbIWx6UXoeLWIy',NULL),(27,'test','test17','$2b$10$Ad7aL2vu1Knt1G.8auHoc.i0nQC26R1M.SNHaGSQxro3/YQSVodHC',NULL),(28,'test','test18','$2b$10$hkgep/U.jWJ.wf/UBfG8DeeP01VR3cmABG3U9Gv1Oom8nJtMV1QmK',NULL),(29,'test','test19','$2b$10$thQ7ZsekgsxonJuEl7oZP.3I9UCVFbLbAvwTYA9ukizFPziU4IJNi',NULL),(30,'test','test20','$2b$10$Jb/l0WEwJfn0WiZyzwu81uA6yHWUW3c62u4vaOVqGg5LuchuXkkGO',NULL),(31,'test','test21','$2b$10$GgG08HQH0V10rjFZ6nYWzuy5WgSMdaGwJyTjJ7ljW3dFFPaZwbLIq',NULL),(32,'test','test22','$2b$10$cNhGvLolEdi/NBo82GeKPO89tjZxDJPFrEufgpiJXhLH/bqP0mIES',NULL),(33,'test','test23','$2b$10$ToTH2qhQJcrp2rdz6JGM5uUJf.mFG.OkRvifQzQ8E9XOg7iPAAp1q',NULL),(34,'test','test24','$2b$10$.H5HBt3.cxPLjjwY.bJnX.2hOzzp0koFCuVzNrt50i5MRHqN.hA6i',NULL),(35,'test','test25','$2b$10$oqZo88hdHT3fC1SjEH20sO86CSKOwFRlKngs48tcCCJLBREUOUs8W',NULL),(36,'test','test26','$2b$10$h2zbfYPWrGERmk.zEAqKaecnU0lo40Vy.COIYqht.mlaK.gihSrf6',NULL),(37,'test','test27','$2b$10$A9lwNcyaJqV/e59OMuM4DucbW2DM/an.0uLDSPp2BClvfUTpCEb7u',NULL),(38,'test','test29','$2b$10$4N14kzbBby.ThQWA/5AbRecU8ZbWcfr0BqaG1TZtN/lXoWmTc38Ou',NULL),(39,'test','test30','$2b$10$QmKkHL9fGdEHwtTixmq2ZeAQ0Heyoot508KUVmjo4mfyPee1gVe32',NULL),(40,'test','test31t','$2b$10$9nwmCMdY3M2JWhBKI6lDy.oE7Z3eSKs.O.a1NrLvEO75izDBKxTK2',NULL),(41,'test','test32','$2b$10$0yrbVoPFQHpiJOneBHYFtu/tWNrsvfjfuzfMb9ThSAIucLKA3K/2q',NULL),(42,'test','test33','$2b$10$BM50pbXMiWqndL2nYCBeL.izCw1mGzuwA2yizAmh4mIEMg1Vy0q/i',NULL),(43,'test','test35','$2b$10$7VqB4xUvHfr1JsHoLy9p6OVgZHQpljGrC5QaGSQ2B.wkPJtCovBNK',NULL),(44,'test','test36','$2b$10$Wkm/9fMeFS.UKuaaY6XjT.BjsoRDFyX81QAvDi/HQjHBmyUf8eG0W',NULL),(45,'test','test39','$2b$10$oDX3GxUQ7nSKjvn9r.oASeC0.Mouvpu69iGlWs/m5NwJuawQ9MbnO',NULL),(46,'test','test40','$2b$10$yhBDmIsEw3mNULcjtZ6UB.qokm00GO.BTXdps.fYIWzl7RpJThGby',NULL),(47,'test','test41','$2b$10$4XBriPxg9H0.oJBfyGyG..gdQdaPlCce61T3rU.VpMBCqXqKSkfA.',NULL);
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

-- Dump completed on 2021-04-14 20:37:15
