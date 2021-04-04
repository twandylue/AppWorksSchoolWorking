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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_table`
--

LOCK TABLES `campaign_table` WRITE;
/*!40000 ALTER TABLE `campaign_table` DISABLE KEYS */;
INSERT INTO `campaign_table` VALUES (3,1,'upload_pics\\campaign_image-1617491091289-knowledge_graph_logo.png','111'),(4,1,'upload_pics\\campaign_image-1617491125601-knowledge_graph_logo.png','111'),(5,1,'upload_pics\\campaign_image-1617491149494-knowledge_graph_logo.png','111'),(6,2,'upload_pics\\campaign_image-1617495043134-knowledge_graph_logo.png','222'),(7,3,'upload_pics\\campaign_image-1617495047339-knowledge_graph_logo.png','333'),(8,4,'upload_pics\\campaign_image-1617495062891-knowledge_graph_logo.png','aaa'),(9,4,'upload_pics\\campaign_image-1617498519420-knowledge_graph_logo.png','aaa'),(10,5,'upload_pics\\campaign_image-1617498525827-knowledge_graph_logo.png','bbb'),(11,6,'upload_pics\\campaign_image-1617498797251-knowledge_graph_logo.png','ccc'),(12,7,'upload_pics\\campaign_image-1617498875698-knowledge_graph_logo.png','eee'),(13,7,'upload_pics\\campaign_image-1617498899197-knowledge_graph_logo.png','eee');
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
INSERT INTO `colors` VALUES ('~~的顏色','~_~'),('final的顏色','final'),('normal的顏色','normal'),('yeah的顏色','yeah'),('亮綠','DDFFBB'),('亮綠灰','KKKKKK'),('宇宙灰','AAAAAA'),('最強灰','SSSSSS'),('有夠AA的顏色','A_A'),('有夠傻眼的顏色','o_O'),('有夠討厭的顏色','OAO'),('深藍','334455'),('淺棕','BB7744'),('淺灰','CCCCCC'),('淺藍','DDF0FF'),('白色','FFFFFF'),('究極灰','ZZZZZZ'),('草綠','EEEEEE'),('討厭的顏色','>_<'),('雜草綠','BBBBBB');
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
INSERT INTO `images` VALUES (1,'upload_pics\\images-1617222089206-knowledge_graph_logo.png'),(1,'upload_pics\\images-1617222089207-knowledge_graph_logo.png'),(1,'upload_pics\\images-1617222089207-knowledge_graph_logo.png'),(2,'upload_pics\\images-1617222133511-knowledge_graph_logo.png'),(2,'upload_pics\\images-1617222133512-knowledge_graph_logo.png'),(2,'upload_pics\\images-1617222133512-knowledge_graph_logo.png'),(3,'upload_pics\\images-1617222212690-knowledge_graph_logo.png'),(3,'upload_pics\\images-1617222212690-knowledge_graph_logo.png'),(3,'upload_pics\\images-1617222212692-knowledge_graph_logo.png'),(4,'upload_pics\\images-1617222233970-knowledge_graph_logo.png'),(4,'upload_pics\\images-1617222233971-knowledge_graph_logo.png'),(4,'upload_pics\\images-1617222233971-knowledge_graph_logo.png'),(5,'upload_pics\\images-1617222273622-knowledge_graph_logo.png'),(5,'upload_pics\\images-1617222273623-knowledge_graph_logo.png'),(5,'upload_pics\\images-1617222273624-knowledge_graph_logo.png'),(6,'upload_pics\\images-1617222284206-knowledge_graph_logo.png'),(6,'upload_pics\\images-1617222284207-knowledge_graph_logo.png'),(6,'upload_pics\\images-1617222284208-knowledge_graph_logo.png'),(7,'upload_pics\\images-1617222324282-knowledge_graph_logo.png'),(7,'upload_pics\\images-1617222324283-knowledge_graph_logo.png'),(7,'upload_pics\\images-1617222324283-knowledge_graph_logo.png'),(8,'upload_pics\\images-1617222338288-knowledge_graph_logo.png'),(8,'upload_pics\\images-1617222338289-knowledge_graph_logo.png'),(8,'upload_pics\\images-1617222338289-knowledge_graph_logo.png'),(9,'upload_pics\\images-1617222350933-knowledge_graph_logo.png'),(9,'upload_pics\\images-1617222350933-knowledge_graph_logo.png'),(9,'upload_pics\\images-1617222350934-knowledge_graph_logo.png'),(10,'upload_pics\\images-1617222359469-knowledge_graph_logo.png'),(10,'upload_pics\\images-1617222359470-knowledge_graph_logo.png'),(10,'upload_pics\\images-1617222359471-knowledge_graph_logo.png'),(11,'upload_pics\\images-1617222400426-knowledge_graph_logo.png'),(11,'upload_pics\\images-1617222400426-knowledge_graph_logo.png'),(11,'upload_pics\\images-1617222400427-knowledge_graph_logo.png'),(12,'upload_pics\\images-1617222404646-knowledge_graph_logo.png'),(12,'upload_pics\\images-1617222404646-knowledge_graph_logo.png'),(12,'upload_pics\\images-1617222404646-knowledge_graph_logo.png'),(13,'upload_pics\\images-1617222408769-knowledge_graph_logo.png'),(13,'upload_pics\\images-1617222408770-knowledge_graph_logo.png'),(13,'upload_pics\\images-1617222408771-knowledge_graph_logo.png'),(14,'upload_pics\\images-1617222412845-knowledge_graph_logo.png'),(14,'upload_pics\\images-1617222412846-knowledge_graph_logo.png'),(14,'upload_pics\\images-1617222412847-knowledge_graph_logo.png'),(15,'upload_pics\\images-1617222417896-knowledge_graph_logo.png'),(15,'upload_pics\\images-1617222417896-knowledge_graph_logo.png'),(15,'upload_pics\\images-1617222417897-knowledge_graph_logo.png'),(16,'upload_pics\\images-1617222452649-knowledge_graph_logo.png'),(16,'upload_pics\\images-1617222452650-knowledge_graph_logo.png'),(16,'upload_pics\\images-1617222452651-knowledge_graph_logo.png'),(17,'upload_pics\\images-1617222471333-knowledge_graph_logo.png'),(17,'upload_pics\\images-1617222471334-knowledge_graph_logo.png'),(17,'upload_pics\\images-1617222471335-knowledge_graph_logo.png'),(18,'upload_pics\\images-1617222475571-knowledge_graph_logo.png'),(18,'upload_pics\\images-1617222475571-knowledge_graph_logo.png'),(18,'upload_pics\\images-1617222475572-knowledge_graph_logo.png'),(19,'upload_pics\\images-1617222485182-knowledge_graph_logo.png'),(19,'upload_pics\\images-1617222485182-knowledge_graph_logo.png'),(19,'upload_pics\\images-1617222485183-knowledge_graph_logo.png'),(20,'upload_pics\\images-1617222495204-knowledge_graph_logo.png'),(20,'upload_pics\\images-1617222495204-knowledge_graph_logo.png'),(20,'upload_pics\\images-1617222495205-knowledge_graph_logo.png'),(21,'upload_pics\\images-1617222504592-knowledge_graph_logo.png'),(21,'upload_pics\\images-1617222504592-knowledge_graph_logo.png'),(21,'upload_pics\\images-1617222504593-knowledge_graph_logo.png');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_table`
--

LOCK TABLES `product_table` WRITE;
/*!40000 ALTER TABLE `product_table` DISABLE KEYS */;
INSERT INTO `product_table` VALUES (1,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_pics\\main_image-1617222089204-knowledge_graph_logo.png','women'),(2,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_pics\\main_image-1617222133511-knowledge_graph_logo.png','women'),(3,'小扇紋細織上衣','厚薄：薄 彈性：無',599,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\" ]','upload_pics\\main_image-1617222212689-knowledge_graph_logo.png','women'),(4,'小扇紋細織上衣','厚薄：薄 彈性：無',599,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\" ]','upload_pics\\main_image-1617222233970-knowledge_graph_logo.png','women'),(5,'活力花紋長筒牛仔褲','厚薄：薄 彈性：無',599,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_pics\\main_image-1617222273622-knowledge_graph_logo.png','women'),(6,'活力花紋長筒牛仔褲','厚薄：薄 彈性：無',1299,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_pics\\main_image-1617222284204-knowledge_graph_logo.png','women'),(7,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_pics\\main_image-1617222324282-knowledge_graph_logo.png','women'),(8,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_pics\\main_image-1617222338288-knowledge_graph_logo.png','women'),(9,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_pics\\main_image-1617222350932-knowledge_graph_logo.png','women'),(10,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"S\", \"M\", \"L\" ]','upload_pics\\main_image-1617222359469-knowledge_graph_logo.png','women'),(11,'純色輕薄百搭襯衫','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222400426-knowledge_graph_logo.png','men'),(12,'純色輕薄百搭襯衫','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222404645-knowledge_graph_logo.png','men'),(13,'純色輕薄百搭襯衫','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222408769-knowledge_graph_logo.png','men'),(14,'純色輕薄百搭襯衫','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222412845-knowledge_graph_logo.png','men'),(15,'純色輕薄百搭襯衫','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222417895-knowledge_graph_logo.png','men'),(16,'活力花紋長筒牛仔褲','厚薄：薄 彈性：無',1299,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222452647-knowledge_graph_logo.png','accessories'),(17,'牛仔褲','厚薄：薄 彈性：無',1299,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222471332-knowledge_graph_logo.png','accessories'),(18,'牛仔褲','厚薄：薄 彈性：無',1299,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222475571-knowledge_graph_logo.png','accessories'),(19,'上衣','厚薄：薄 彈性：無',1299,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222485181-knowledge_graph_logo.png','accessories'),(20,'上衣','厚薄：薄 彈性：無',1299,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222495203-knowledge_graph_logo.png','accessories'),(21,'上衣123','厚薄：薄 彈性：無',1299,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[ \"M\", \"L\", \"XL\" ]','upload_pics\\main_image-1617222504591-knowledge_graph_logo.png','accessories');
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
INSERT INTO `stock` VALUES (1,'DDF0FF','S',8),(1,'DDF0FF','M',5),(1,'DDF0FF','L',6),(1,'CCCCCC','S',9),(1,'CCCCCC','M',10),(1,'CCCCCC','L',11),(2,'FFFFFF','S',9),(2,'FFFFFF','M',10),(2,'FFFFFF','L',11),(2,'BB7744','S',9),(2,'BB7744','M',10),(2,'BB7744','L',11),(3,'BB7744','S',9),(3,'BB7744','M',10),(3,'BB7744','S',11),(3,'DDFFBB','S',9),(3,'DDFFBB','M',10),(3,'DDFFBB','S',11),(4,'DDFFBB','S',1),(4,'DDFFBB','M',2),(4,'DDFFBB','S',3),(4,'334455','S',1),(4,'334455','M',2),(4,'334455','L',3),(4,'CCCCCC','S',1),(4,'CCCCCC','M',2),(4,'CCCCCC','L',3),(4,'DDF0FF','S',2),(4,'DDF0FF','M',3),(4,'DDF0FF','L',4),(4,'DDF0FF','S',8),(4,'DDF0FF','M',7),(4,'DDF0FF','L',8),(4,'CCCCCC','S',0),(4,'CCCCCC','M',4),(4,'CCCCCC','L',7),(4,'KKKKKK','S',0),(4,'KKKKKK','M',4),(4,'KKKKKK','L',7),(5,'KKKKKK','S',0),(5,'KKKKKK','M',4),(5,'KKKKKK','L',7),(5,'KKKKKK','S',0),(5,'KKKKKK','M',4),(5,'KKKKKK','L',7),(6,'SSSSSS','M',0),(6,'SSSSSS','L',4),(6,'SSSSSS','XL',7),(6,'SSSSSS','M',0),(6,'SSSSSS','L',4),(6,'SSSSSS','XL',7),(6,'SSSSSS','M',0),(6,'SSSSSS','L',4),(6,'SSSSSS','XL',7),(7,'ZZZZZZ','M',0),(7,'ZZZZZZ','L',4),(7,'ZZZZZZ','XL',7),(7,'ZZZZZZ','M',0),(7,'ZZZZZZ','L',4),(7,'ZZZZZZ','XL',7),(7,'ZZZZZZ','M',0),(7,'ZZZZZZ','L',4),(7,'ZZZZZZ','XL',7),(7,'ZZZZZZ','M',0),(7,'ZZZZZZ','L',4),(7,'ZZZZZZ','XL',7),(8,'AAAAAA','M',0),(8,'AAAAAA','L',4),(8,'AAAAAA','XL',7),(8,'AAAAAA','M',0),(8,'AAAAAA','L',4),(8,'AAAAAA','XL',7),(9,'EEEEEE','M',2),(9,'EEEEEE','L',4),(9,'EEEEEE','XL',7),(9,'EEEEEE','M',2),(9,'EEEEEE','L',4),(9,'EEEEEE','XL',7),(9,'EEEEEE','M',2),(9,'EEEEEE','L',4),(9,'EEEEEE','XL',7),(10,'BBBBBB','M',3),(10,'BBBBBB','L',2),(10,'BBBBBB','XL',1),(10,'BBBBBB','M',3),(10,'BBBBBB','L',2),(10,'BBBBBB','XL',1),(10,'BBBBBB','M',3),(10,'BBBBBB','L',2),(10,'BBBBBB','XL',1),(11,'BBBBBB','M',3),(11,'BBBBBB','L',2),(11,'BBBBBB','XL',1),(11,'BBBBBB','M',3),(11,'BBBBBB','L',2),(11,'BBBBBB','XL',1),(11,'BBBBBB','M',3),(11,'BBBBBB','L',2),(11,'BBBBBB','XL',1),(11,'BBBBBB','M',3),(11,'BBBBBB','L',2),(11,'BBBBBB','XL',1),(11,'BBBBBB','M',3),(11,'BBBBBB','L',2),(11,'BBBBBB','XL',1),(11,'BBBBBB','M',3),(11,'BBBBBB','L',2),(11,'BBBBBB','XL',1),(11,'BBBBBB','M',3),(11,'BBBBBB','L',2),(11,'BBBBBB','XL',1),(12,'BBBBBB','M',3),(12,'BBBBBB','L',2),(12,'BBBBBB','XL',1),(12,'BBBBBB','M',3),(12,'BBBBBB','L',2),(12,'BBBBBB','XL',1),(13,'BBBBBB','M',3),(13,'BBBBBB','L',2),(13,'BBBBBB','XL',1),(13,'BBBBBB','M',3),(13,'BBBBBB','L',2),(13,'BBBBBB','XL',1),(13,'BBBBBB','M',3),(13,'BBBBBB','L',2),(13,'BBBBBB','XL',1),(14,'OAO','M',3),(14,'OAO','L',2),(14,'OAO','XL',1),(14,'OAO','M',3),(14,'OAO','L',2),(14,'OAO','XL',1),(14,'OAO','M',3),(14,'OAO','L',2),(14,'OAO','XL',1),(14,'OAO','M',3),(14,'OAO','L',2),(14,'OAO','XL',1),(15,'o_O','M',0),(15,'o_O','L',0),(15,'o_O','XL',0),(15,'o_O','M',0),(15,'o_O','L',0),(15,'o_O','XL',0),(15,'o_O','M',0),(15,'o_O','L',0),(15,'o_O','XL',0),(15,'O_O','M',0),(15,'O_O','L',0),(15,'O_O','XL',0),(15,'O_O','M',0),(15,'O_O','L',0),(15,'O_O','XL',0),(15,'O_O','M',0),(15,'O_O','L',0),(15,'O_O','XL',0),(15,'o_o','M',0),(15,'o_o','L',0),(15,'o_o','XL',0),(15,'o_o','M',0),(15,'o_o','L',0),(15,'o_o','XL',0),(16,'A_A','M',0),(16,'A_A','L',0),(16,'A_A','XL',0),(16,'A_A','M',0),(16,'A_A','L',0),(16,'A_A','XL',0),(16,'A_A','M',0),(16,'A_A','L',0),(16,'A_A','XL',0),(17,'>_<','M',0),(17,'>_<','L',0),(17,'>_<','XL',0),(17,'>_<','M',0),(17,'>_<','L',0),(17,'>_<','XL',0),(17,'>_<','M',0),(17,'>_<','L',0),(17,'>_<','XL',0),(17,'~_~','M',0),(17,'~_~','L',0),(17,'~_~','XL',0),(18,'normal','M',5),(18,'normal','L',5),(18,'normal','XL',5),(18,'normal','M',5),(18,'normal','L',5),(18,'normal','XL',5),(18,'normal','M',5),(18,'normal','L',5),(18,'normal','XL',5),(19,'yeah','M',6),(19,'yeah','L',6),(19,'yeah','XL',6),(19,'yeah','M',6),(19,'yeah','L',6),(19,'yeah','XL',6),(19,'yeah','M',6),(19,'yeah','L',6),(19,'yeah','XL',6),(20,'yeah','M',6),(20,'yeah','L',6),(20,'yeah','XL',6),(20,'yeah','M',6),(20,'yeah','L',6),(20,'yeah','XL',6),(20,'final','M',6),(20,'final','L',6),(20,'final','XL',6),(20,'final','M',6),(20,'final','L',6),(20,'final','XL',6),(21,'final','S',6),(21,'final','M',6),(21,'final','L',6),(21,'final','S',6),(21,'final','M',6),(21,'final','L',6),(21,'final','S',6),(21,'final','M',6),(21,'final','L',6);
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

-- Dump completed on 2021-04-04  9:28:30
