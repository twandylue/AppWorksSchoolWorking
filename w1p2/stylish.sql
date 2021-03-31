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
INSERT INTO `colors` VALUES ('亮綠','DDFFBB'),('夜空灰','SSSSSS'),('深藍','334455'),('淺棕','BB7744'),('淺灰','CCCCCC'),('淺藍','DDF0FF'),('白色','FFFFFF');
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
INSERT INTO `images` VALUES (1,'publicupload_picsimages-1617166047083-knowledge_graph_logo.png'),(1,'publicupload_picsimages-1617166047084-knowledge_graph_logo.png'),(1,'publicupload_picsimages-1617166047084-knowledge_graph_logo.png'),(20200331000,'publicupload_picsimages-1617166068948-knowledge_graph_logo.png'),(20200331000,'publicupload_picsimages-1617166068948-knowledge_graph_logo.png'),(20200331000,'publicupload_picsimages-1617166068949-knowledge_graph_logo.png'),(20200331001,'publicupload_picsimages-1617166076055-knowledge_graph_logo.png'),(20200331001,'publicupload_picsimages-1617166076056-knowledge_graph_logo.png'),(20200331001,'publicupload_picsimages-1617166076057-knowledge_graph_logo.png'),(20200331003,'publicupload_picsimages-1617166083118-knowledge_graph_logo.png'),(20200331003,'publicupload_picsimages-1617166083118-knowledge_graph_logo.png'),(20200331003,'publicupload_picsimages-1617166083119-knowledge_graph_logo.png'),(20200331004,'publicupload_picsimages-1617166089882-knowledge_graph_logo.png'),(20200331004,'publicupload_picsimages-1617166089882-knowledge_graph_logo.png'),(20200331004,'publicupload_picsimages-1617166089883-knowledge_graph_logo.png'),(20200331005,'publicupload_picsimages-1617166097042-knowledge_graph_logo.png'),(20200331005,'publicupload_picsimages-1617166097043-knowledge_graph_logo.png'),(20200331005,'publicupload_picsimages-1617166097043-knowledge_graph_logo.png'),(20200331006,'publicupload_picsimages-1617166102711-knowledge_graph_logo.png'),(20200331006,'publicupload_picsimages-1617166102711-knowledge_graph_logo.png'),(20200331006,'publicupload_picsimages-1617166102712-knowledge_graph_logo.png'),(20200331007,'publicupload_picsimages-1617166109433-knowledge_graph_logo.png'),(20200331007,'publicupload_picsimages-1617166109433-knowledge_graph_logo.png'),(20200331007,'publicupload_picsimages-1617166109434-knowledge_graph_logo.png'),(201807201824,'publicupload_picsimages-1617166116961-knowledge_graph_logo.png'),(201807201824,'publicupload_picsimages-1617166116962-knowledge_graph_logo.png'),(201807201824,'publicupload_picsimages-1617166116963-knowledge_graph_logo.png'),(201807202140,'publicupload_picsimages-1617166123119-knowledge_graph_logo.png'),(201807202140,'publicupload_picsimages-1617166123119-knowledge_graph_logo.png'),(201807202140,'publicupload_picsimages-1617166123120-knowledge_graph_logo.png'),(201807202150,'publicupload_picsimages-1617166129400-knowledge_graph_logo.png'),(201807202150,'publicupload_picsimages-1617166129400-knowledge_graph_logo.png'),(201807202150,'publicupload_picsimages-1617166129401-knowledge_graph_logo.png'),(201807202157,'publicupload_picsimages-1617166135989-knowledge_graph_logo.png'),(201807202157,'publicupload_picsimages-1617166135989-knowledge_graph_logo.png'),(201807202157,'publicupload_picsimages-1617166135990-knowledge_graph_logo.png'),(201807242211,'publicupload_picsimages-1617166144107-knowledge_graph_logo.png'),(201807242211,'publicupload_picsimages-1617166144107-knowledge_graph_logo.png'),(201807242211,'publicupload_picsimages-1617166144108-knowledge_graph_logo.png'),(201807242216,'publicupload_picsimages-1617166149525-knowledge_graph_logo.png'),(201807242216,'publicupload_picsimages-1617166149525-knowledge_graph_logo.png'),(201807242216,'publicupload_picsimages-1617166149526-knowledge_graph_logo.png'),(202003310001,'publicupload_picsimages-1617166156116-knowledge_graph_logo.png'),(202003310001,'publicupload_picsimages-1617166156116-knowledge_graph_logo.png'),(202003310001,'publicupload_picsimages-1617166156117-knowledge_graph_logo.png'),(2,'publicupload_picsimages-1617177248604-knowledge_graph_logo.png'),(2,'publicupload_picsimages-1617177248607-knowledge_graph_logo.png'),(2,'publicupload_picsimages-1617177248611-knowledge_graph_logo.png'),(3,'publicupload_picsimages-1617177311757-knowledge_graph_logo.png'),(3,'publicupload_picsimages-1617177311758-knowledge_graph_logo.png'),(3,'publicupload_picsimages-1617177311759-knowledge_graph_logo.png');
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
INSERT INTO `product_table` VALUES (1,'testtest','testtesttesttesttesttesttesttesttesttesttesttesttesttest',100,'testtesttesttesttesttesttesttest','testtesttesttesttesttest','testtesttesttesttesttest','testtesttesttesttesttesttesttest','testtesttesttesttesttesttesttest','[\"S\",\"L\",\"XL\"]','publicupload_picsmain_image-1617164572395-knowledge_graph_logo.png','men'),(2,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\",\"L\"]','publicupload_picsmain_image-1617177248598-knowledge_graph_logo.png','women'),(3,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\",\"L\"]','publicupload_picsmain_image-1617177311751-knowledge_graph_logo.png','women'),(20200331000,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\",\"L\"]','publicupload_picsmain_image-1617138231144-knowledge_graph_logo.png','women'),(20200331001,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\"]','publicupload_picsmain_image-1617138287329-knowledge_graph_logo.png','women'),(20200331003,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\"]','publicupload_picsmain_image-1617138335215-knowledge_graph_logo.png','accessories'),(20200331004,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\"]','publicupload_picsmain_image-1617138347534-knowledge_graph_logo.png','accessories'),(20200331005,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\"]','publicupload_picsmain_image-1617138368803-knowledge_graph_logo.png','accessories'),(20200331006,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\"]','publicupload_picsmain_image-1617138377020-knowledge_graph_logo.png','men'),(20200331007,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\"]','publicupload_picsmain_image-1617138406459-knowledge_graph_logo.png','accessories'),(201807201824,'前開衩扭結洋裝','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\",\"L\"]','publicupload_picsmain_image-1617078754619-knowledge_graph_logo.png','women'),(201807202140,'透肌澎澎防曬襯衫','厚薄：薄 彈性：無',599,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\",\"XL\"]','publicupload_picsmain_image-1617080717667-knowledge_graph_logo.png','women'),(201807202150,'小扇紋細織上衣','厚薄：薄 彈性：無',599,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"M\",\"L\",\"XL\"]','publicupload_picsmain_image-1617081131450-knowledge_graph_logo.png','women'),(201807202157,'活力花紋長筒牛仔褲','厚薄：薄 彈性：無',1299,'棉 100%\"','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\",\"L\"]','publicupload_picsmain_image-1617136415857-knowledge_graph_logo.png','women'),(201807242211,'純色輕薄百搭襯衫','厚薄：薄 彈性：無',799,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"M\",\"L\",\"XL\"]','publicupload_picsmain_image-1617137550370-knowledge_graph_logo.png','men'),(201807242216,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\",\"L\"]','publicupload_picsmain_image-1617137890744-knowledge_graph_logo.png','men'),(202003310001,'時尚輕鬆休閒西裝','厚薄：薄 彈性：無',2399,'棉 100%','手洗，溫水','中國','實品顏色依單品照為主','O.N.S is all about options, which is why we took our staple polo shirt and upgraded it with slubby linen jersey, making it even lighter for those who prefer their summer style extra-breezy.','[\"S\",\"M\",\"L\"]','publicupload_picsmain_image-1617138250580-knowledge_graph_logo.png','women');
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
INSERT INTO `stock` VALUES (201807201824,'FFFFFF','S',2),(201807201824,'FFFFFF','M',1),(201807201824,'FFFFFF','L',2),(201807201824,'DDFFBB','S',9),(201807201824,'DDFFBB','M',0),(201807201824,'DDFFBB','L',5),(201807201824,'CCCCCC','S',8),(201807201824,'CCCCCC','M',5),(201807201824,'CCCCCC','L',9),(201807202140,'DDFFBB','S',7),(201807202140,'DDFFBB','M',5),(201807202140,'DDFFBB','L',8),(201807202140,'CCCCCC','S',1),(201807202140,'CCCCCC','M',6),(201807202140,'CCCCCC','L',2),(201807202150,'DDFFBB','S',3),(201807202150,'DDFFBB','M',5),(201807202150,'CCCCCC','S',4),(201807202150,'CCCCCC','M',1),(201807202150,'BB7744','S',2),(201807202150,'BB7744','M',6),(201807202157,'DDF0FF','S',8),(201807202157,'DDF0FF','L',6),(201807202157,'DDF0FF','M',5),(201807202157,'CCCCCC','S',1),(201807202157,'CCCCCC','M',6),(201807202157,'CCCCCC','L',5),(201807202157,'334455','S',2),(201807202157,'334455','M',7),(201807202157,'334455','L',9),(201807242211,'FFFFFF','M',5),(201807242211,'FFFFFF','L',7),(201807242211,'FFFFFF','XL',1),(201807242211,'DDF0FF','M',1),(201807242211,'DDF0FF','L',4),(201807242211,'DDF0FF','XL',3),(201807242216,'FFFFFF','S',10),(201807242216,'FFFFFF','M',6),(201807242216,'FFFFFF','L',6),(201807242216,'CCCCCC','S',1),(201807242216,'CCCCCC','M',3),(201807242216,'CCCCCC','L',10),(20200331000,'FFFFFF','S',5),(20200331000,'FFFFFF','M',7),(20200331000,'FFFFFF','L',10),(20200331000,'FFFFFF','S',5),(20200331000,'FFFFFF','M',7),(20200331000,'FFFFFF','L',10),(20200331000,'DDF0FF','S',6),(20200331000,'DDF0FF','M',5),(20200331000,'DDF0FF','L',12),(20200331001,'DDF0FF','S',6),(20200331001,'DDF0FF','M',5),(20200331001,'CCCCCC','M',12),(20200331001,'334455','S',6),(20200331001,'334455','M',5),(20200331001,'CCCCCC','M',12),(20200331001,'334455','S',6),(20200331001,'334455','M',5),(20200331001,'CCCCCC','M',12),(20200331003,'BB7744','S',6),(20200331003,'334455','M',5),(20200331003,'CCCCCC','M',12),(20200331003,'BB7744','S',6),(20200331003,'334455','M',5),(20200331003,'CCCCCC','M',12),(20200331003,'BB7744','S',6),(20200331003,'334455','M',5),(20200331003,'CCCCCC','M',12),(20200331004,'FFFFFF','S',6),(20200331004,'334455','M',5),(20200331004,'CCCCCC','M',12),(20200331004,'FFFFFF','S',6),(20200331004,'334455','M',5),(20200331004,'CCCCCC','M',12),(20200331004,'FFFFFF','S',6),(20200331004,'334455','M',5),(20200331004,'CCCCCC','M',12),(20200331005,'DDFFBB','S',6),(20200331005,'334455','M',5),(20200331005,'CCCCCC','M',12),(20200331005,'DDFFBB','S',6),(20200331005,'334455','M',5),(20200331005,'CCCCCC','M',12),(20200331005,'DDFFBB','S',6),(20200331005,'334455','M',5),(20200331005,'CCCCCC','M',12),(20200331005,'DDFFBB','S',6),(20200331005,'334455','M',5),(20200331005,'CCCCCC','M',12),(20200331006,'BB7744','S',6),(20200331006,'334455','M',5),(20200331006,'CCCCCC','M',12),(20200331006,'BB7744','S',6),(20200331006,'334455','M',5),(20200331006,'CCCCCC','M',12),(20200331006,'BB7744','S',6),(20200331006,'334455','M',5),(20200331006,'CCCCCC','M',12),(20200331007,'DDFFBB','S',6),(20200331007,'334455','M',5),(20200331007,'CCCCCC','M',12),(20200331007,'DDFFBB','S',6),(20200331007,'334455','M',5),(20200331007,'CCCCCC','M',12),(20200331007,'DDFFBB','S',6),(20200331007,'334455','M',5),(20200331007,'CCCCCC','M',12),(202003310001,'DDF0FF','S',6),(202003310001,'334455','M',5),(202003310001,'CCCCCC','M',12),(202003310001,'DDF0FF','S',6),(202003310001,'334455','M',5),(202003310001,'CCCCCC','M',12),(202003310001,'DDF0FF','S',6),(202003310001,'334455','M',5),(202003310001,'CCCCCC','M',12),(202003310001,'DDF0FF','S',0),(202003310001,'334455','M',5),(202003310001,'CCCCCC','M',12),(202003310001,'DDF0FF','S',0),(202003310001,'334455','M',5),(202003310001,'CCCCCC','M',12),(1,'SSSSSS','S',1),(1,'SSSSSS','L',5),(1,'SSSSSS','XL',3),(1,'SSSSSS','S',1),(1,'SSSSSS','L',5),(1,'SSSSSS','XL',3),(1,'SSSSSS','S',1),(1,'SSSSSS','L',5),(1,'SSSSSS','XL',3),(2,'DDFFBB','S',5),(2,'DDFFBB','M',4),(2,'CCCCCC','L',3),(3,'CCCCCC','S',3),(3,'CCCCCC','M',4),(3,'CCCCCC','L',5);
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

-- Dump completed on 2021-03-31 16:06:08
