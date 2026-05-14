-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nidec_gages
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `act_inact`
--

DROP TABLE IF EXISTS `act_inact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `act_inact` (
  `ActId` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`ActId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `act_inact`
--

LOCK TABLES `act_inact` WRITE;
/*!40000 ALTER TABLE `act_inact` DISABLE KEYS */;
INSERT INTO `act_inact` VALUES (1,'Activo'),(2,'Inactivo');
/*!40000 ALTER TABLE `act_inact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calibracion`
--

DROP TABLE IF EXISTS `calibracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calibracion` (
  `CalibracionId` int(11) NOT NULL AUTO_INCREMENT,
  `FolioCertificado` varchar(50) DEFAULT NULL,
  `GagesId` int(11) NOT NULL,
  `FechaCalibracion` date NOT NULL,
  `Resultado` text NOT NULL,
  `EstatusPasa` tinyint(1) DEFAULT 1 COMMENT '1=Pasa, 0=Falla',
  `CalibracionBy` varchar(120) NOT NULL,
  `CapturadoPor` int(11) DEFAULT NULL,
  `FechaProxima` date NOT NULL,
  `E_Pusados` varchar(200) NOT NULL,
  `Temperatura` decimal(10,4) NOT NULL,
  `Humedad` decimal(10,4) NOT NULL,
  PRIMARY KEY (`CalibracionId`),
  KEY `GagesId` (`GagesId`),
  KEY `CapturadoPor` (`CapturadoPor`),
  CONSTRAINT `calibracion_ibfk_1` FOREIGN KEY (`GagesId`) REFERENCES `gage_master` (`GageId`),
  CONSTRAINT `calibracion_ibfk_2` FOREIGN KEY (`CapturadoPor`) REFERENCES `usuarios` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calibracion`
--

LOCK TABLES `calibracion` WRITE;
/*!40000 ALTER TABLE `calibracion` DISABLE KEYS */;
INSERT INTO `calibracion` VALUES (1,'hola202604001',2,'2026-04-16','Resultado positivo calibracion exitosa',1,'Santos',1,'2026-06-16','VER-000P34',28.5400,58.3300),(4,'123456',1,'2026-04-15','12 mm de afinacion',1,'Santos',1,'2026-04-30','',0.0000,0.0000),(5,NULL,5,'2026-04-16','12',1,'HECTOR E',1,'2026-07-16','',0.0000,0.0000),(6,'VE202604002',8,'2026-04-02','',1,'Hector',1,'2026-10-02','galgas',29.0000,54.0000),(7,'NID-202603001',3,'2026-03-24','',1,'GAEL G',1,'2026-04-24','Gauge Blocks',20.0000,45.0000),(8,'Test202601001',6,'2026-02-25','',1,'GAEL G',1,'2026-03-24','Ring Gages',26.5600,60.0500),(9,'Niv202603001',7,'2026-04-21','',0,'Yaneth',1,'2026-06-21','galgas',22.5600,38.0000),(10,'',6,'2026-04-23','',1,'HECTOR E',1,'2026-05-23','TG10.32',20.5000,50.0000),(14,'VER112233',9,'2026-04-29','',1,'SANTOS',NULL,'2026-07-29','BPC0001, BPC0002, MGB182420, RG10.31500, TM-445814',21.5000,35.0000),(15,'ES28072023',4,'2026-04-30','',1,'SANTOS',NULL,'2026-07-30','BPC0001, BPC0002, MGB182420',26.0600,28.0000),(16,'',11,'2026-04-13','',1,'',NULL,'2026-05-13','BPC0001, BPC0002, MGB182420',0.0000,0.0000);
/*!40000 ALTER TABLE `calibracion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calibracion_patrones`
--

DROP TABLE IF EXISTS `calibracion_patrones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calibracion_patrones` (
  `CalibracionId` int(11) NOT NULL,
  `PatronId` int(11) NOT NULL,
  PRIMARY KEY (`CalibracionId`,`PatronId`),
  KEY `PatronId` (`PatronId`),
  CONSTRAINT `calibracion_patrones_ibfk_1` FOREIGN KEY (`CalibracionId`) REFERENCES `calibracion` (`CalibracionId`),
  CONSTRAINT `calibracion_patrones_ibfk_2` FOREIGN KEY (`PatronId`) REFERENCES `patrones_maestro` (`PatronId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calibracion_patrones`
--

LOCK TABLES `calibracion_patrones` WRITE;
/*!40000 ALTER TABLE `calibracion_patrones` DISABLE KEYS */;
/*!40000 ALTER TABLE `calibracion_patrones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calibraciondtl`
--

DROP TABLE IF EXISTS `calibraciondtl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calibraciondtl` (
  `MedicionId` int(11) NOT NULL AUTO_INCREMENT,
  `Categoria` varchar(50) DEFAULT NULL,
  `CalibracionId` int(11) NOT NULL,
  `PuntoNominal` decimal(10,4) NOT NULL,
  `ToleranciaMin` decimal(10,4) NOT NULL,
  `ToleranciaMax` decimal(10,4) NOT NULL,
  `ValorLeido` decimal(10,4) NOT NULL,
  `Diferencia` decimal(10,4) NOT NULL,
  PRIMARY KEY (`MedicionId`),
  KEY `CalibracionId` (`CalibracionId`),
  CONSTRAINT `calibraciondtl_ibfk_1` FOREIGN KEY (`CalibracionId`) REFERENCES `calibracion` (`CalibracionId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calibraciondtl`
--

LOCK TABLES `calibraciondtl` WRITE;
/*!40000 ALTER TABLE `calibraciondtl` DISABLE KEYS */;
INSERT INTO `calibraciondtl` VALUES (2,NULL,6,1.0229,0.0000,0.0000,1.0230,0.0001),(3,NULL,7,2.5000,0.0000,0.0000,2.4998,-0.0002),(4,NULL,8,2.0033,0.0000,0.0000,2.0034,0.0001),(6,NULL,10,0.1000,0.0000,0.0000,0.1005,0.0005),(8,'Externo',14,0.0500,0.0000,0.0000,0.0500,0.0000),(9,'Externo',14,0.1000,0.0000,0.0000,0.0000,0.0000),(10,'Externo',14,0.1040,0.0000,0.0000,0.0000,0.0000),(11,'Externo',14,0.1170,0.0000,0.0000,0.0000,0.0000),(12,'Externo',14,0.1270,0.0000,0.0000,0.0000,0.0000),(13,'Externo',14,0.1390,0.0000,0.0000,0.0000,0.0000),(14,'Externo',14,0.1480,0.0000,0.0000,0.0000,0.0000),(15,'Externo',14,0.1500,0.0000,0.0000,0.0000,0.0000),(16,'Externo',14,0.2000,0.0000,0.0000,0.0000,0.0000),(17,'Externo',14,0.3000,0.0000,0.0000,0.0000,0.0000),(18,'Externo',14,0.4000,0.0000,0.0000,0.0000,0.0000),(19,'Externo',14,0.5000,0.0000,0.0000,0.0000,0.0000),(20,'Externo',14,0.6000,0.0000,0.0000,0.0000,0.0000),(21,'Externo',14,0.7000,0.0000,0.0000,0.0000,0.0000),(22,'Externo',14,0.8000,0.0000,0.0000,0.0000,0.0000),(23,'Externo',14,0.9000,0.0000,0.0000,0.0000,0.0000),(24,'Externo',14,1.0000,0.0000,0.0000,0.0000,0.0000),(25,'Externo',14,2.0000,0.0000,0.0000,0.0000,0.0000),(26,'Externo',14,3.0000,0.0000,0.0000,0.0000,0.0000),(27,'Externo',14,4.0000,0.0000,0.0000,0.0000,0.0000),(28,'Externo',14,125.0000,0.0000,0.0000,0.0000,0.0000),(29,'Externo',14,150.0000,0.0000,0.0000,0.0000,0.0000),(30,'Externo',14,175.0000,0.0000,0.0000,0.0000,0.0000),(31,'Externo',14,200.0000,0.0000,0.0000,0.0000,0.0000),(32,'Externo',14,225.0000,0.0000,0.0000,0.0000,0.0000),(33,'Externo',14,250.0000,0.0000,0.0000,0.0000,0.0000),(34,'Externo',14,275.0000,0.0000,0.0000,0.0000,0.0000),(35,'Externo',14,300.0000,0.0000,0.0000,0.0000,0.0000),(36,'Interno',14,0.3150,0.0000,0.0000,0.0000,0.0000),(37,'Interno',14,1.3390,0.0000,0.0000,0.0000,0.0000),(38,'Profundidad',14,1.0000,0.0000,0.0000,0.0000,0.0000),(39,'Altura',14,1.0000,0.0000,0.0000,0.0000,0.0000),(40,'Altura',14,4.0000,0.0000,0.0000,0.0000,0.0000),(41,'Externa',15,0.1251,0.0000,0.0000,0.1250,-0.0001),(46,'Interno',1,1.0000,0.0000,0.0000,1.0001,0.0001),(47,'Externa',1,2.0000,0.0000,0.0000,1.9998,-0.0002),(48,'Interno',16,0.0010,0.0000,0.0000,0.0005,-0.0005),(50,NULL,9,2.5000,0.0000,0.0000,2.4998,-0.0002);
/*!40000 ALTER TABLE `calibraciondtl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_gage`
--

DROP TABLE IF EXISTS `estado_gage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_gage` (
  `EstadoId` int(11) NOT NULL AUTO_INCREMENT,
  `NombreEstado` varchar(50) NOT NULL,
  PRIMARY KEY (`EstadoId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_gage`
--

LOCK TABLES `estado_gage` WRITE;
/*!40000 ALTER TABLE `estado_gage` DISABLE KEYS */;
INSERT INTO `estado_gage` VALUES (1,'Aprobado'),(2,'No Aprobado');
/*!40000 ALTER TABLE `estado_gage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `externo_interno`
--

DROP TABLE IF EXISTS `externo_interno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `externo_interno` (
  `Ext_IntId` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre_extint` varchar(50) NOT NULL,
  PRIMARY KEY (`Ext_IntId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `externo_interno`
--

LOCK TABLES `externo_interno` WRITE;
/*!40000 ALTER TABLE `externo_interno` DISABLE KEYS */;
INSERT INTO `externo_interno` VALUES (1,'Interno'),(2,'Externo');
/*!40000 ALTER TABLE `externo_interno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frecuencia_gage`
--

DROP TABLE IF EXISTS `frecuencia_gage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frecuencia_gage` (
  `FreqId` int(11) NOT NULL AUTO_INCREMENT,
  `NomFreq` varchar(50) NOT NULL,
  `ValorMeses` int(11) DEFAULT NULL,
  PRIMARY KEY (`FreqId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frecuencia_gage`
--

LOCK TABLES `frecuencia_gage` WRITE;
/*!40000 ALTER TABLE `frecuencia_gage` DISABLE KEYS */;
INSERT INTO `frecuencia_gage` VALUES (1,'1 Mes',1),(2,'2 Meses',2),(3,'3 Meses',3),(4,'6 Meses',6),(5,'12 Meses',12),(6,'24 Meses',24),(7,'4 Meses',4);
/*!40000 ALTER TABLE `frecuencia_gage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gage_master`
--

DROP TABLE IF EXISTS `gage_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gage_master` (
  `GageId` int(11) NOT NULL AUTO_INCREMENT,
  `GageSerie` varchar(100) NOT NULL,
  `Descripcion` varchar(120) NOT NULL,
  `Usuario` int(11) NOT NULL,
  `Tipo` int(11) NOT NULL,
  `Estado` int(11) NOT NULL,
  `Act_Inact` int(11) NOT NULL,
  `Ex_Int` int(11) NOT NULL,
  `Vendedor` varchar(100) NOT NULL,
  `FechaAlta` date NOT NULL,
  `FreqCalibracion` int(11) NOT NULL,
  `Locacion` varchar(120) NOT NULL,
  `Informacion` text NOT NULL,
  `ProcedimientoId` int(11) NOT NULL,
  `PlantillaNombre` varchar(100) DEFAULT NULL,
  `Marca` varchar(50) NOT NULL,
  `Modelo` varchar(50) NOT NULL,
  `Codigo` varchar(20) NOT NULL,
  `Serie` varchar(30) NOT NULL,
  `Rango` varchar(50) NOT NULL,
  `Resolucion` varchar(100) NOT NULL,
  `OrdenCompra` varchar(50) NOT NULL,
  PRIMARY KEY (`GageId`),
  KEY `Estado` (`Estado`),
  KEY `Tipo` (`Tipo`),
  KEY `Ex_Int` (`Ex_Int`),
  KEY `Usuario` (`Usuario`),
  KEY `ProcedimientoId` (`ProcedimientoId`),
  KEY `Act_Inact` (`Act_Inact`),
  KEY `FreqCalibracion` (`FreqCalibracion`),
  CONSTRAINT `gage_master_ibfk_1` FOREIGN KEY (`Estado`) REFERENCES `estado_gage` (`EstadoId`),
  CONSTRAINT `gage_master_ibfk_2` FOREIGN KEY (`Tipo`) REFERENCES `tipo_gage` (`TipoGageId`),
  CONSTRAINT `gage_master_ibfk_3` FOREIGN KEY (`Ex_Int`) REFERENCES `externo_interno` (`Ext_IntId`),
  CONSTRAINT `gage_master_ibfk_4` FOREIGN KEY (`Usuario`) REFERENCES `usuarios` (`UserID`),
  CONSTRAINT `gage_master_ibfk_5` FOREIGN KEY (`ProcedimientoId`) REFERENCES `procedimiento` (`ProceId`),
  CONSTRAINT `gage_master_ibfk_6` FOREIGN KEY (`Act_Inact`) REFERENCES `act_inact` (`ActId`),
  CONSTRAINT `gage_master_ibfk_7` FOREIGN KEY (`FreqCalibracion`) REFERENCES `frecuencia_gage` (`FreqId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gage_master`
--

LOCK TABLES `gage_master` WRITE;
/*!40000 ALTER TABLE `gage_master` DISABLE KEYS */;
INSERT INTO `gage_master` VALUES (1,'NID_Prueba01','LLAVE XX',1,1,1,1,2,'stenum','2026-04-09',1,'Nidec','SOY UNA LLAVE NUDA',1,'GAGE DE PERPEN','','','','','','',''),(2,'wqeqwewq','hola',1,3,1,1,1,'nidec2','2026-03-01',2,'nidec1','hola es prueba',2,NULL,'','','','','','',''),(3,'NID-Test','prueba2',1,2,1,1,1,'Caseta2','2026-04-06',1,'caseta1','otra prueba mas',1,NULL,'','','','','','',''),(4,'011','Erika',1,1,1,1,1,'Colima','2026-04-01',3,'Veracruz','prueba de que ya no envia console.log',1,NULL,'','','','','','',''),(5,'VE2000698','VERNIER',1,2,1,1,1,'STENUM','2026-04-15',2,'CALIBRADORES','MARCA: MITUTOYO\nMODELO: C66\nCODIGO:\nSERIE: 35255\nRANGO:\nRESOLUCION:\nPO: RMN-11485\n',3,'VERNIER 12\'','MITUTOYO',' C66','','35255','','','RMN-11485'),(6,'Test-01','GageTest',1,2,1,1,1,'Coppel','2026-04-16',1,'Smart','Color negro mate',1,NULL,'Dell','aspire','12345','88710','10mm','por favor','DELLOP88710'),(7,'NIV-001','Nivel',1,1,2,1,2,'HEB','2026-04-17',2,'Waltmart','Es naranja con colores dorados',1,NULL,'SMART','TITANIUM','C5M80PP01','NIV1234','120','claro','ascendente'),(8,'VE2000700','VERNIER',1,1,1,1,1,'STENUM','2026-04-16',4,'CALIBRADORES','es rojo',3,'VERNIER 12\'','STENUM','WD-40','115','935','128','1080','88710'),(9,'VE2000699','VERNIER',1,1,1,1,1,'LG','2026-04-29',3,'Calibracion','Solo calibrar en temperaturas menores a 28 grados',3,'VERNIER 12\'','LG','LG-VER001','VER010203','20260101','12','1920','1202'),(10,'VE2000701','VERNIER',1,1,1,1,1,'STENUM','2026-04-16',4,'CALIBRADORES','es verde',3,'VERNIER 12\'','STENUM','WD-40','115','123456','128','1080','88710'),(11,'VE2000702','VERNIER',1,1,1,1,1,'STENUM','2026-04-30',1,'CALIBRADORES','es solo para uso en motores',3,'VERNIER 12\'','STENUM','VER-0102','115','78910','128','2440','88726'),(12,'PIER1234','Pie De Rey',1,1,1,1,1,'TEC','2026-05-08',2,'UTTN','Para calibrar verniers',1,'PIE DE REY','TOYOTA','PRIUS','12-34-56','1234','1-10','1920','12');
/*!40000 ALTER TABLE `gage_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patrones_maestro`
--

DROP TABLE IF EXISTS `patrones_maestro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patrones_maestro` (
  `PatronId` int(11) NOT NULL AUTO_INCREMENT,
  `CodigoPatron` varchar(50) DEFAULT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `FechaVencimiento` date DEFAULT NULL,
  `Estatus` enum('Activo','Vencido','Mantenimiento') DEFAULT 'Activo',
  PRIMARY KEY (`PatronId`),
  UNIQUE KEY `CodigoPatron` (`CodigoPatron`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patrones_maestro`
--

LOCK TABLES `patrones_maestro` WRITE;
/*!40000 ALTER TABLE `patrones_maestro` DISABLE KEYS */;
INSERT INTO `patrones_maestro` VALUES (1,'BPC0001','Bloque Patrón Cerámico / Grado 0',NULL,'Activo'),(2,'BPC0002','Bloque Patrón Cerámico / Grado 0',NULL,'Activo'),(3,'MGB182420','Mesa de Granito / Base de Referencia',NULL,'Activo'),(4,'RG10.31500','Anillo Patrón (Ring Gage)',NULL,'Activo'),(5,'MRG1.5802','Anillo Patrón Maestro',NULL,'Activo'),(6,'TM-445814','Termohigrómetro (Sensor Temp/Hum)',NULL,'Activo'),(7,'SV1.004','Bloque Patrón de Verificación',NULL,'Activo'),(8,'BPC0003','Bloque Patrón Cerámico',NULL,'Activo'),(9,'BPC0004','Bloque Patrón Cerámico',NULL,'Activo');
/*!40000 ALTER TABLE `patrones_maestro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantilla_puntos`
--

DROP TABLE IF EXISTS `plantilla_puntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantilla_puntos` (
  `PlantillaId` int(11) NOT NULL AUTO_INCREMENT,
  `GageTipo` varchar(100) DEFAULT NULL,
  `Categoria` varchar(50) DEFAULT NULL,
  `PuntoNominal` decimal(10,4) DEFAULT NULL,
  `ToleranciaMin` decimal(10,4) DEFAULT NULL,
  `ToleranciaMax` decimal(10,4) DEFAULT NULL,
  `Orden` int(11) DEFAULT NULL,
  PRIMARY KEY (`PlantillaId`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantilla_puntos`
--

LOCK TABLES `plantilla_puntos` WRITE;
/*!40000 ALTER TABLE `plantilla_puntos` DISABLE KEYS */;
INSERT INTO `plantilla_puntos` VALUES (1,'VERNIER 12\'','Externo',0.0500,NULL,NULL,1),(2,'VERNIER 12\'','Externo',0.1000,NULL,NULL,2),(3,'VERNIER 12\'','Externo',0.1040,NULL,NULL,3),(4,'VERNIER 12\'','Externo',0.1170,NULL,NULL,4),(5,'VERNIER 12\'','Externo',0.1270,NULL,NULL,5),(6,'VERNIER 12\'','Externo',0.1390,NULL,NULL,6),(7,'VERNIER 12\'','Externo',0.1480,NULL,NULL,7),(8,'VERNIER 12\'','Externo',0.1500,NULL,NULL,8),(9,'VERNIER 12\'','Externo',0.2000,NULL,NULL,9),(10,'VERNIER 12\'','Externo',0.3000,NULL,NULL,10),(11,'VERNIER 12\'','Externo',0.4000,NULL,NULL,11),(12,'VERNIER 12\'','Externo',0.5000,NULL,NULL,12),(13,'VERNIER 12\'','Externo',0.6000,NULL,NULL,13),(14,'VERNIER 12\'','Externo',0.7000,NULL,NULL,14),(15,'VERNIER 12\'','Externo',0.8000,NULL,NULL,15),(16,'VERNIER 12\'','Externo',0.9000,NULL,NULL,16),(17,'VERNIER 12\'','Externo',1.0000,NULL,NULL,17),(18,'VERNIER 12\'','Externo',2.0000,NULL,NULL,18),(19,'VERNIER 12\'','Externo',3.0000,NULL,NULL,19),(20,'VERNIER 12\'','Externo',4.0000,NULL,NULL,20),(21,'VERNIER 12\'','Externo',125.0000,NULL,NULL,21),(22,'VERNIER 12\'','Externo',150.0000,NULL,NULL,22),(23,'VERNIER 12\'','Externo',175.0000,NULL,NULL,23),(24,'VERNIER 12\'','Externo',200.0000,NULL,NULL,24),(25,'VERNIER 12\'','Externo',225.0000,NULL,NULL,25),(26,'VERNIER 12\'','Externo',250.0000,NULL,NULL,26),(27,'VERNIER 12\'','Externo',275.0000,NULL,NULL,27),(28,'VERNIER 12\'','Externo',300.0000,NULL,NULL,28),(29,'VERNIER 12\'','Interno',0.3150,NULL,NULL,29),(30,'VERNIER 12\'','Interno',1.3390,NULL,NULL,30),(31,'VERNIER 12\'','Profundidad',1.0000,NULL,NULL,31),(32,'VERNIER 12\'','Altura',1.0000,NULL,NULL,32),(33,'VERNIER 12\'','Altura',4.0000,NULL,NULL,33),(34,'PIE DE REY','Resultados',0.0500,NULL,NULL,1),(35,'PIE DE REY','Resultados',0.1000,NULL,NULL,2),(36,'PIE DE REY','Resultados',0.1050,NULL,NULL,3),(37,'PIE DE REY','Resultados',0.1160,NULL,NULL,4),(38,'PIE DE REY','Resultados',0.1390,NULL,NULL,5),(39,'PIE DE REY','Resultados',0.1500,NULL,NULL,6),(40,'PIE DE REY','Resultados',0.2000,NULL,NULL,7),(41,'PIE DE REY','Resultados',0.3000,NULL,NULL,8),(42,'PIE DE REY','Resultados',0.4000,NULL,NULL,9),(43,'PIE DE REY','Resultados',0.5000,NULL,NULL,10),(44,'PIE DE REY','Resultados',0.6000,NULL,NULL,11),(45,'PIE DE REY','Resultados',0.7000,NULL,NULL,12),(46,'PIE DE REY','Resultados',0.8000,NULL,NULL,13),(47,'PIE DE REY','Resultados',0.9000,NULL,NULL,14),(48,'PIE DE REY','Resultados',1.0000,NULL,NULL,15),(49,'PIE DE REY','Resultados',2.0000,NULL,NULL,16),(50,'PIE DE REY','Resultados',3.0000,NULL,NULL,17),(51,'PIE DE REY','Resultados',4.0000,NULL,NULL,18),(52,'PIE DE REY','Resultados',125.0000,NULL,NULL,19),(53,'PIE DE REY','Resultados',150.0000,NULL,NULL,20),(54,'PIE DE REY','Resultados',175.0000,NULL,NULL,21),(55,'PIE DE REY','Resultados',200.0000,NULL,NULL,22),(56,'PIE DE REY','Resultados',225.0000,NULL,NULL,23),(57,'PIE DE REY','Resultados',250.0000,NULL,NULL,24),(58,'PIE DE REY','Resultados',275.0000,NULL,NULL,25),(59,'PIE DE REY','Resultados',300.0000,NULL,NULL,26),(60,'GAGE DE PERPEN','Resultados',1.2500,NULL,NULL,1),(61,'GAGE DE PERPEN','Resultados',1.2500,NULL,NULL,2),(62,'GAGE DE PERPEN','Resultados',1.2500,NULL,NULL,3),(63,'GAGE DE PERPEN','Resultados',1.2500,NULL,NULL,4),(64,'GAGE DE PERPEN','Resultados',1.2800,NULL,NULL,5),(65,'GAGE DE PERPEN','Resultados',1.2800,NULL,NULL,6),(66,'GAGE DE PERPEN','Resultados',0.0600,NULL,NULL,7),(67,'GAGE DE PERPEN','Resultados',0.0600,NULL,NULL,8);
/*!40000 ALTER TABLE `plantilla_puntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantillas_detalle`
--

DROP TABLE IF EXISTS `plantillas_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantillas_detalle` (
  `DetalleId` int(11) NOT NULL AUTO_INCREMENT,
  `PlantillaId` int(11) DEFAULT NULL,
  `GageId` int(11) DEFAULT NULL,
  PRIMARY KEY (`DetalleId`),
  KEY `fk_plantilla` (`PlantillaId`),
  CONSTRAINT `fk_plantilla` FOREIGN KEY (`PlantillaId`) REFERENCES `plantillas_maestro` (`PlantillaId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantillas_detalle`
--

LOCK TABLES `plantillas_detalle` WRITE;
/*!40000 ALTER TABLE `plantillas_detalle` DISABLE KEYS */;
INSERT INTO `plantillas_detalle` VALUES (1,1,5),(2,1,8),(3,1,9),(4,1,10),(5,1,11);
/*!40000 ALTER TABLE `plantillas_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantillas_maestro`
--

DROP TABLE IF EXISTS `plantillas_maestro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantillas_maestro` (
  `PlantillaId` int(11) NOT NULL AUTO_INCREMENT,
  `NombrePlantilla` varchar(100) NOT NULL,
  `Area` varchar(100) DEFAULT NULL,
  `TurnoId` int(11) DEFAULT NULL,
  `FechaCreacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`PlantillaId`),
  KEY `TurnoId` (`TurnoId`),
  CONSTRAINT `plantillas_maestro_ibfk_1` FOREIGN KEY (`TurnoId`) REFERENCES `turno` (`TurnoId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantillas_maestro`
--

LOCK TABLES `plantillas_maestro` WRITE;
/*!40000 ALTER TABLE `plantillas_maestro` DISABLE KEYS */;
INSERT INTO `plantillas_maestro` VALUES (1,'Gages linea 7','Linea 7',1,'2026-05-12 15:20:11');
/*!40000 ALTER TABLE `plantillas_maestro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestamo`
--

DROP TABLE IF EXISTS `prestamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamo` (
  `PrestamoId` int(11) NOT NULL AUTO_INCREMENT,
  `NoEmpleado` int(11) NOT NULL,
  `Nombre` varchar(120) NOT NULL,
  `GageId` int(11) NOT NULL,
  `HPrestamo` datetime NOT NULL,
  `HDevolucion` datetime NOT NULL,
  `TurnoId` int(11) NOT NULL,
  `Area` varchar(100) NOT NULL,
  PRIMARY KEY (`PrestamoId`),
  KEY `GageId` (`GageId`),
  KEY `TurnoId` (`TurnoId`),
  CONSTRAINT `prestamo_ibfk_1` FOREIGN KEY (`GageId`) REFERENCES `gage_master` (`GageId`),
  CONSTRAINT `prestamo_ibfk_2` FOREIGN KEY (`TurnoId`) REFERENCES `turno` (`TurnoId`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamo`
--

LOCK TABLES `prestamo` WRITE;
/*!40000 ALTER TABLE `prestamo` DISABLE KEYS */;
INSERT INTO `prestamo` VALUES (2,1234,'SantosGomez',1,'2026-04-10 22:22:30','2026-04-10 22:22:30',1,'Oficina'),(3,1122,'ola',1,'2026-04-11 18:21:44','2026-04-11 18:29:44',2,'Embarque'),(4,1314,'Gael',3,'2026-04-11 18:25:21','2026-04-11 18:29:47',4,'IT'),(5,2708,'Erika',2,'2026-04-11 18:32:42','2026-04-11 19:38:39',3,'Linea 12'),(6,2324,'Gael',1,'2026-04-11 18:35:46','2026-04-11 19:45:45',1,'Techo'),(7,1003,'Jose',4,'2026-04-11 19:37:08','2026-04-11 19:45:48',2,'Gardenias'),(8,1202,'Erika',4,'2026-04-13 16:05:00','2026-04-13 16:46:10',2,'Caseta'),(9,1111,'prueba',2,'2026-04-13 16:23:53','2026-04-13 16:46:14',4,'hola'),(10,2222,'pruebanueva',1,'2026-04-13 16:46:51','2026-04-13 12:01:28',1,'nidec'),(11,3333,'PruebaFuego',1,'2026-04-13 13:17:43','2026-04-13 13:20:43',1,'Pruebas'),(12,12344,'rodolfo p',7,'2026-04-16 12:48:02','2026-04-16 14:55:44',1,'laboratorio'),(13,1875,'Santos',8,'2026-05-04 09:27:50','2026-05-04 11:00:40',1,'Linea 30'),(14,1875,'Santos',9,'2026-05-04 09:27:50','2026-05-12 15:11:14',1,'Linea 30'),(15,1875,'Santos',5,'2026-05-04 09:27:50','2026-05-12 15:10:58',1,'Linea 30'),(16,1873,'Gael',3,'2026-05-04 09:47:09','2026-05-12 16:36:06',4,'Oficinas'),(17,1873,'Gael',4,'2026-05-04 09:47:09','2026-05-12 16:36:07',4,'Oficinas'),(18,1873,'Gael',6,'2026-05-04 09:47:09','2026-05-12 16:36:09',4,'Oficinas'),(19,10502,'mario rios',8,'2026-05-04 11:23:24','2026-05-04 11:25:23',4,'l-16'),(20,10502,'mario rios',1,'2026-05-04 11:23:24','2026-05-12 16:36:11',4,'l-16'),(21,1875,'SANTOS',7,'2026-05-12 15:03:10','2026-05-12 16:36:04',2,'IT'),(22,1875,'Santos',5,'2026-05-12 16:35:39','2026-05-12 16:35:57',1,'Linea 7'),(23,1875,'Santos',8,'2026-05-12 16:35:39','2026-05-12 16:35:58',1,'Linea 7'),(24,1875,'Santos',9,'2026-05-12 16:35:39','2026-05-12 16:35:59',1,'Linea 7'),(25,1875,'Santos',10,'2026-05-12 16:35:39','2026-05-12 16:36:01',1,'Linea 7'),(26,1875,'Santos',11,'2026-05-12 16:35:39','2026-05-12 16:36:02',1,'Linea 7');
/*!40000 ALTER TABLE `prestamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procedimiento`
--

DROP TABLE IF EXISTS `procedimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `procedimiento` (
  `ProceId` int(11) NOT NULL AUTO_INCREMENT,
  `NombreProce` varchar(120) NOT NULL,
  `Proposito` text DEFAULT NULL,
  `Alcance` text DEFAULT NULL,
  `Materiales` text DEFAULT NULL,
  `Precauciones` text DEFAULT NULL,
  `Tolerancia` varchar(255) DEFAULT NULL,
  `Instrucciones` longtext DEFAULT NULL,
  `ImgProce` varchar(255) DEFAULT NULL,
  `ManualPDF` varchar(255) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL,
  `Fecha_Actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ProceId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procedimiento`
--

LOCK TABLES `procedimiento` WRITE;
/*!40000 ALTER TABLE `procedimiento` DISABLE KEYS */;
INSERT INTO `procedimiento` VALUES (1,'Procedimiento de prueba','ESTO TAMBIEN ES PRUEBA','DE AQUI A LA ENTRADA','ZAPATOS','QUE LOS ZAPATOS ESTEN AMARRADOS','0.1 PIES','prueba para ver si se funciono la conexion  asi que\n1. funciono\n2. blabalbalba\n3. lorem ipsum\n4. asereje ajaeje\n5. altoooooo, yo ya estuve en estos juegos\n6. sipirili\n7.noporolo','/Nidec Institutional Logo_Original Version.jpg',NULL,0,'2026-05-04 21:58:01'),(2,'MOTOR/ROTOR  SHAFT','Establecer un procedimiento estandar de calibracion para los gages motor shaft y rotor shaft',' Los gages usados para medir, evaluar, probar, inspeccionar o examinar material y/o producto, para determinar si cumplen con las especificaciones.','<span id=\"docs-internal-guid-61bc23df-7fff-744b-73bd-258610504302\"><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"></p><ol><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Vernier y/o pie de rey .</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Solvente para limpiar</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Trapos</span></li></ol></span>','Usar extrema precaución cuando use el material solvente de tal manera que remueva solo las imperfecciones positivas de la superficie en las superficies a calibrar.','El criterio de aceptación será de \"+0.0005/-0.0005\" para el NO-GO y de acuerdo a lo que especifica el requerimiento o el dibujo del material, o modelo.','<span id=\"docs-internal-guid-85fed0c1-7fff-d040-6b3d-82e51b21876c\"><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">PROCEDIMIENTO</span></p><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"></p><ol><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Seleccionar la escala minima&nbsp; maxima del gage.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Usando el equipo de medicion adecuado medir y registrar lecturas de ambas escalas del gage.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Hacer comparación en ambas&nbsp; escalas para definir estado del gage.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">El criterio de aceptación esta dado en el parrafo 5.1</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">De acuerdo con resultados de calibración definir el status del gage en la computadora como </span><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">OK reparación o desperdicio.</span></li></ol><p></p><div><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\"><span id=\"docs-internal-guid-4b72fc35-7fff-55a2-ed1c-3811d912bc7e\"><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"><span style=\"font-size: 11pt; background-color: transparent; font-variant: normal; vertical-align: baseline;\"><br></span></p><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"><span style=\"font-size: 11pt; background-color: transparent; font-variant: normal; vertical-align: baseline;\">CORRECCIONES.</span></p><div><span style=\"font-size: 11pt; background-color: transparent; font-variant: normal; vertical-align: baseline;\"><span id=\"docs-internal-guid-b273ef5d-7fff-7bb4-eb94-832e56457daf\"><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"></p><ol><li><span style=\"font-size: 11pt; background-color: transparent; font-variant: normal; vertical-align: baseline;\">Cualquier gage que sobrepase las tolerancias especificadas de acuerdo al parrafo 5.1, en cualquier momento durante la calibración deberá ser recalibrado, reparado o desechado.</span></li></ol></span></span></div></span></span></div></span>',NULL,NULL,1,'2026-05-04 21:56:40'),(3,'VERNIERS','Establecer un procedimiento estandar para la calibración de  los verniers usados en MOTORES REYNOSA.','Los verniers usados para medir, probar, inspeccionar o examinar articulos para determinar concordancia con especificaciones.','<span id=\"docs-internal-guid-834e3813-7fff-10d1-ba8d-7698ec01d4f1\"><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"></p><ol><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Solución limpiadora.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Pañuelo libre de pelusa</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Calibrador maestro, o blocks patron.</span></li></ol></span>','Tenga cuidado cuando remueva el polvo, huellas de los dedos y otras substancias externas de tal forma que la solución limpiadora no penetre en las partes internas de este gage (sobre todo si es digital)','El vernier debe tener una tolerancia que no exceda de +/- .0005\". o el porcentaje de error que trae de fabrica marcado el equipo','<span id=\"docs-internal-guid-0e5a6bf1-7fff-a1a3-ac6f-c97412ad187d\"><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">PROCEDIMIENTO</span></p><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"></p><ol><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Examine cuidadosamente todas las superficies del vernier por posibles rebabas, rayaduras, u&nbsp; otras señales de maltrato o deterioro.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Aplicar suficiente cantidad de solución limpiadora para humedecer un pañuelo libre de pelusa. Limpie cuidadosamente todas las superficies expuestas removiendo todas las sustancias externas y otro tipo de partículas.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Cheque los trazadores del vernier cuando esten en posición cerradas.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Observe los espacios entre trazadores (si existe) mirando a través del área entre los dos trazadores enfocando una fuente de luz . Ninguna luz debe verse a través de los trazadores si estas estan en buenas condiciones. Si existe señal de luz entre los dos trazadores (debido a deterioro) vea en punto 7.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Verificar el ajuste a cero del vernier observando las lecturas indicadas con los trazadores en posición cerrada.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Si el vernier no lee a 0.000\"&nbsp; puede ser facilmente ajustado a cero, aflojando el tornillo que aprieta la guia, entonces gire la guia para alinear el indicador a graduación cero, si el vernier es digital oprima el boton zero.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Registre las lecturas del vernier, consulte el punto 5.0 para tolerancias.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Si cualquier defecto ha sido encontrado en este punto que pudiera afectar la exactitud o función del gage, interrumpa la calibración y consulte la sección 7.0 para acción remedial.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Realize al menos 2 mediciones al minimo una al medio y 2 al maximo segun el rango del equipo (6\'\' 8\'\' y 12\'\').</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Alinear el vernier para que este lo mas paralelamete posible a la linea de medicion.</span></li><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Repita los pasos de medición un número suficiente de veces para descartar cualquier lectura incorrecta.</span></li></ol><p></p><br><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">CORRECCIONES.</span></p><p dir=\"ltr\" style=\"line-height:1.2;margin-top:0pt;margin-bottom:0pt;\"></p><ol><li><span style=\"font-size: 11pt; font-family: Calibri, sans-serif; background-color: transparent; font-variant: normal; vertical-align: baseline; white-space: pre-wrap;\">Cualquier gage que sobrepase las tolerancias especificadas de acuerdo al parrafo 5.0, en cualquier momento durante la calibración deberá ser recalibrado o desechado.</span></li></ol></span>',NULL,NULL,1,'2026-05-04 21:57:04');
/*!40000 ALTER TABLE `procedimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_gage`
--

DROP TABLE IF EXISTS `tipo_gage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_gage` (
  `TipoGageId` int(11) NOT NULL AUTO_INCREMENT,
  `NombreTipo` varchar(100) NOT NULL,
  PRIMARY KEY (`TipoGageId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_gage`
--

LOCK TABLES `tipo_gage` WRITE;
/*!40000 ALTER TABLE `tipo_gage` DISABLE KEYS */;
INSERT INTO `tipo_gage` VALUES (1,'Mecanico'),(2,'Digital'),(3,'Electrico');
/*!40000 ALTER TABLE `tipo_gage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turno`
--

DROP TABLE IF EXISTS `turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turno` (
  `TurnoId` int(11) NOT NULL AUTO_INCREMENT,
  `TurnoNombre` varchar(20) NOT NULL,
  PRIMARY KEY (`TurnoId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turno`
--

LOCK TABLES `turno` WRITE;
/*!40000 ALTER TABLE `turno` DISABLE KEYS */;
INSERT INTO `turno` VALUES (1,'Turno A'),(2,'Turno B'),(3,'Turno C'),(4,'Turno D'),(6,'Turno E');
/*!40000 ALTER TABLE `turno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Usuario` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Rol` varchar(50) DEFAULT NULL,
  `edit_gage` tinyint(1) DEFAULT 0,
  `edit_gageId` tinyint(4) DEFAULT NULL,
  `edit_calibracion` tinyint(1) DEFAULT 0,
  `edit_reportes` tinyint(1) DEFAULT 0,
  `edit_procedimientos` tinyint(1) DEFAULT 0,
  `edit_prestamo` tinyint(1) NOT NULL DEFAULT 0,
  `ver_prestamo` tinyint(1) NOT NULL DEFAULT 0,
  `ver_gage` tinyint(1) DEFAULT 0,
  `ver_calibracion` tinyint(1) DEFAULT 0,
  `ver_reportes` tinyint(1) DEFAULT 0,
  `ver_procedimientos` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Usuario` (`Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'UsuarioPrueba','$2b$10$JJmnhDC6DmA0SraMXRGAWu0uQsBUFBZ.Bog7Dj9vKEbOy2qx.EMIW','Admin',1,1,1,1,1,1,1,1,1,1,1,'2026-04-08 14:47:15'),(2,'AdminTI','$2b$10$VuAH2E7LhkhkrXf5Q8Ze1uBZPqMn4c7YPDv3zXTrkUiY1/dL7.NtW','SuperAdmin',1,1,1,1,1,0,0,1,1,1,1,'2026-04-23 18:41:41'),(3,'Hector','$2b$10$2Y9GZmhqFyeP0xHF2VsZOOgFSezyB9bg3VY5TzNR5Hrk/jUFtxMG.','Supervisor',0,0,1,1,1,0,0,1,1,1,1,'2026-04-24 14:36:20');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14  7:23:20
