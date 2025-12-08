-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: Bookishhouse
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `book` (
  `Book_ID` varchar(10) NOT NULL,
  `Book_Price` decimal(10,2) DEFAULT NULL,
  `Book_Name` varchar(100) DEFAULT NULL,
  `Book_Img` varchar(100) DEFAULT NULL,
  `Book_Detail` varchar(1000) DEFAULT NULL,
  `Book_Tag` varchar(100) DEFAULT NULL,
  `Book_Category` varchar(100) DEFAULT NULL,
  `Book_Quantity` int(15) DEFAULT 0,
  `Seller_ID` varchar(15) NOT NULL,
  PRIMARY KEY (`Book_ID`),
  KEY `Seller_ID` (`Seller_ID`),
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`Seller_ID`) REFERENCES `seller` (`Seller_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES ('B10623',125.00,'SHANGRI-LA FRONTIER เมื่อนักล่าเกมขยะท้าสู้ในเกมเทพ เล่ม 9','book_img-1765211317569.gif','เปิดศึกกับคู่ปรับแห่งชะตาอีกครั้ง!\r\nนี่คือบันทึกการผจญภัยในเกม\r\nที่เสียงคำรามดังกระหึ่ม!!\r\n\r\nหลังจากรู้ผลแพ้ชนะกับรุสท์ใน เนฟิลินฮอลโลว์\r\nซันราคุที่ต้องการข้อมูลของยูนีคมอนสเตอร์อย่าง\r\nคราบิดแห่งห้วงเหว ก็หวนคืนสู่ แซงฟรอน\r\nซันราคุเดินหน้าพิชิตดันเจี้ยนโดยมีไซงะ 0 ช่วยเหลือ\r\nแต่แล้ว SF-Zoo ที่อยู่ในกลุ่มพันธมิตรแคลนกลับโผล่มาขัดขวาง!\r\nในราตรีที่ความคิดของเหล่าผู้บุกเบิกปะทะกัน\r\nเงาหนึ่งรุกคืบเข้ามาโดยไร้เสียงฝีเท้า\r\nราชาหมาป่าปรากฏกายจากความมืดมิดอีกครั้ง—','Fantasy ','Manga',1,'SE70781'),('B11903',99.00,'คำอธิษฐานในวันที่จากลา FRIEREN เล่ม 07','book_img-1765211259877.gif','ฟรีเรนเมจที่นำพา\r\nอดีตของเหล่าผู้กล้าไปสู่อนาคต\r\nหลังจบจากการสอบเมจ\r\nก็ออกเดินทางไปสู่โอเรออล\r\nได้พบและลาจาก\r\nคำพูดของเหล่าผู้กล้าที่ชวนให้คิดถึง...\r\n\r\nเรื่องราวที่แสดงโลกหลังการตายของราชาปีศาจ แต่เพียงผ่านตา\r\n\r\nเรื่องราวแฟนตาซีภายหลังจากนั้นที่บอกเล่า ','Fantasy ','Manga',1,'SE70781'),('B24985',295.00,'ปรัชญากฎหมาย: ความรู้ฉบับพกพา','book_img-1765210650461.png',' ขยายพรมแดนความเข้าใจในปรัชญาซึ่งแฝงอยู่เบื้องหลังกฎหมาย ทั้งยังเผยให้เห็นว่ากฎหมายใกล้ชิดกับชีวิตคนเรามากกว่าที่คิด \r\n','knowledge','Philosophy',2,'SE19917'),('B28056',212.00,'121','book_img-1765202480098.jpg','212','21','Novel',0,'SE53357'),('B36274',125.00,'ตำนานดาบและคทาแห่งวิสตอเรีย 1','book_img-1765211411955.gif','เพื่อทำตามสัญญาที่ให้ไว้ในวัยเยาว์ เด็กหนุ่มถือดาบ วิล เชอร์โฮลท์ พยายามมุ่งสู่จุดสูงสุดในโลกเวทมนตร์ แต่เขากลับเป็นผู้ไม่มีพลังเวท วิธีเดียวที่จะไต่เต้าไปสู่จุดสูงสุดได้ มีเพียงวิธีเดียว โค่นล้มเหล่ามอนสเตอร์ในดันเจี้ยนให้สิ้น! บัดนี้บทแห่งการผจญภัย ที่มีเวทีเป็นเขาวงกต ได้เปิดม่านขึ้นแล้ว!','Fantasy ','Manga',0,'SE70781'),('B42774',96.00,'แก้กรรมทำได้ด้วยตัวเอง','book_img-1765210804878.png','','Dharma','Buddhist',1,'SE19917'),('B59539',345.00,'ประวัติศาสตร์สายธารแห่งปัญญา (A Little History of Philosophy)','book_img-1765210483120.png','หนังสือเล่มนี้จะทลายกำแพงที่กั้นขวางปรัชญาไว้เพียงในโลกของนักปรัชญา และแสดงให้เห็นว่าปรัชญาเปรียบดัง “กุญแจ” สู่ความจริงแห่งชีวิต ทว่าเบื้องหลังประตูบานนั้นหาใช่คำตอบตายตัว \r\n','history','Philosophy',1,'SE19917'),('B62474',429.00,' นาโนมาชิน ภาค มารสวรรค์ข้ามเวลา เล่ม 1','book_img-1765210953368.png','นาโนมาชิน ภาค มารสวรรค์ข้ามเวลา เล่ม 1\r\n‘ชอนยออุน’ ประมุขแห่งพรรคมารสวรรค์ผู้ยิ่งใหญ่ร่วงหล่นลงมายังโลกอนาคต \r\nในโลกแห่งนี้สถานะของเหล่าจอมยุทธ์และเคล็ดวิชาต่างๆ ล้วนเสื่อมถอยไปมาก สวนทางกับเทคโนโลยีที่นับวันยิ่งซับซ้อนและอันตราย\r\nชอนยออุนนั้นจำเป็นต้องรวบรวมข้อมูลเพื่อหาทางกลับไปสู่ยุคสมัยของตน แต่นั่นกลับทำให้เขาพบข่าวร้ายที่ไม่อยากจะเชื่อ...\r\n...นั่นคือพรรคมารสวรรค์ได้ล่มสลายไปแล้ว!\r\nทว่าสำนักหกดาบอรหันต์ซึ่งเป็นศัตรูคู่แค้นของเขากลับยังดำรงอยู่ ในฐานะบริษัทเบลดซิกซ์ผู้กุมอำนาจเศรษฐกิจของโลก!\r\nชอนยออุนจึงจำเป็นต้องรวบรวมสาวกของยุคนี้ที่กระจัดกระจายกัน เพื่อกอบกู้พรรคมารสวรรค์กลับคืนมาอีกครั้ง!\r\n','Action','Novel',1,'SE70781'),('B62612',125.00,'SHANGRI-LA FRONTIER เมื่อนักล่าเกมขยะท้าสู้ในเกมเทพ เล่ม 10','book_img-1765211366378.gif','จุดจบแด่ราชาหมาป่า!\r\n\r\nนี่คือบันทึกการผจญภัยในเกม ที่ทะลวงผ่านรัตติกาลมืดมิด!!\r\n\r\nซันราคุเผชิญหน้าท้าสู้กับพันธุ์สุดแกร่งทั้งเจ็ด\r\nอย่าง ไลคาออนรัตติกาลอีกครั้ง!\r\nวิธีปราบไลคาออนรัตติกาลที่เป็นดั่งราตรีมืดมิดจำแลงกายมา\r\nมีเพียง ไพ่ตาย ของไซงะ-0\r\nอันเป็นที่มาของสมญานาม ผู้ครองพลังทำลายสูงสุด เท่านั้น\r\nณ สนามรบดำมืดที่ประมาทไม่ได้แม้แต่พริบตาเดียว\r\nมรดกจากยุคโบราณจักพุ่งแหวกแผ่นฟ้า\r\nเงามืดจักเร้นกายโลดแล่นไปตามผืนดิน\r\n\r\nจงปราบราชาหมาป่าสุดแกร่งผู้เป็นความพรั่นพรึงแห่งรัตติกาลให้สิ้น-----!','Fantasy ','Manga',0,'SE70781'),('B63237',125.00,'ตำนานดาบและคทาแห่งวิสตอเรีย 2','book_img-1765211451480.gif','งานที่ถูกจัดขึ้นที่สถาบันเวทมนตร์ลีการ์เด้น 2 ปีต่อ 1 ครั้ง อีเวนต์ขนาดใหญ่ของการแข่งขันประลองทักษะเวทมนตร์และเป็นจุดศูนย์รวมแมวมองจากห้าคฑาสูงสุด (มาเกีย เวนเต้)!\r\n\r\nวิล เซอร์โฮล จอมห่วยแตกประจำสถาบัน ปกติแล้วเขาจะมองผ่านการเข้าร่วมเนื่องจากไม่สามารถใช้เวทมนตร์ได้ ทว่า ด้วยเหตุการ์บางอย่างจึงทำให้เด็กหนุ่มตัดสินใจที่จะเข้าร่วมงานเทศกาลเวทมนตร์นี้ด้วย—','Fantasy ','Manga',1,'SE70781'),('B68481',96.00,'จากหลวงปู่มั่น ภูริทัตโตถึงหลวงตามหาบัว','book_img-1765210738965.png','จากหลวงปู่มั่น ถึง หลวงตามหาบัว ญาณสัมปันโณ.....สืบสานตำนานพระป่าถือธุดงควัตรกำราบกิเลส\r\n','Dharma','Buddhist',1,'SE19917'),('B71098',289.00,'ชีวิตไม่ต้องเด่น ขอแค่เป็นเทพในเงา เล่ม 3 (ฉบับนิยาย)','book_img-1765211090624.gif','ชีวิตไม่ต้องเด่น ขอแค่เป็นเทพในเงา\r\nKage No Jitsuryokusha Ni Naritakute!\r\nThe Eminence in Shadow\r\n\r\nซิดถูกแคลร์ชวนไปยัง ‘นครไร้กฎหมาย’ และได้เข้าร่วมการปราบ ‘ราชินีโลหิต’ แวมไพร์ต้นกำเนิดซึ่งหลับใหลรอวันตื่น\r\nที่นั่น ‘แมรี่’ สาวสวยปริศนาได้ปรากฏตัวต่อหน้าเขาและอ้างตนว่าเป็น ‘นักล่าแวมไพร์รุ่นเก่าแก่’\r\n\r\n‘ทรราช’ จักเกอร์นอท ‘ปีศาจจิ้งจอก’ ยูคิเมะ และ ‘แวมไพร์’ คริมสัน\r\n\r\nสามขั้วอำนาจแห่งนครไร้กฎหมายเข้าปะทะกันโดยมี ‘ชาโดว์การ์เดน’ เข้าไปแทรกแซง\r\nเพื่อสืบหาความเกี่ยวข้องของ ‘เลือดต้นกำเนิด’ และ ‘ปีศาจสิงสู่’\r\n\r\nท่ามกลางสมรภูมิที่ทวีความโกลาหล ในที่สุด ‘แวมไพร์ต้นกำเนิดในตำนาน’ ก็ฟื้นคืนชีพขึ้นมา…!','Fantasy ','Novel',1,'SE70781'),('B73183',299.00,'Mushoku Tensei เล่ม 26','book_img-1765208315513.jpg','1','Fantasy','Novel',0,'SE53357'),('B81440',240.00,'ปรัชญาทั่วไป','book_img-1765210603156.png','หนังสือเล่มนี้เขียนขึ้นเพื่อแนะนำให้ผู้อ่านที่ไม่เคยรู้เรื่องเกี่ยวกับปรัชญามาก่อนเลยได้เข้าใจอย่างกว้างๆ ว่าปรัชญาคืออะไร มีเนื้อหาสาระอย่างไร การแนะนำให้รู้จักวิชาปรัชญานั้นทำได้หลายทาง','History','Philosophy',1,'SE19917'),('B83801',99.00,'คำอธิษฐานในวันที่จากลา FRIEREN เล่ม 14','book_img-1765211193435.gif','นักเวทฟรีเรนได้เดินทางไปยังจักรวรรดิ ซึ่งเป็นศูนย์กลางของอารยธรรมเวทมนตร์ที่เจริญจนถึงขีดสุด ตามคำขอร้องของฟรังเมผู้เป็นอาจารย์ ในขณะที่แผนลอบสังหารเซเลียกําลังดำเนินอยู่เบื้องหลังนั้นเอง สมาคมเวทมนตร์แห่งภาคพื้นทวีปก็ได้เข้ามารับหน้าที่เป็นผู้คุ้มกัน ขณะเดียวกัน ทางด้านหน่วยรบเวทมนตร์พิเศษ ก็ตั้งมั่นปกป้องจักรวรรดิ เมื่ออุดมการณ์และศักดิ์ศรีของแต่ละฝ่ายเข้าห้ำหั่นกัน เรื่องราวก็ค่อยๆ ถูกเงามืดกลืนกิน มันคือเรื่องราวที่ “ความคิด” ของเหล่าวีรบุรุษเริ่มปะทะและเชือดเฉือนกัน!','Fantasy ','Manga',1,'SE70781'),('B86179',96.00,'เจ้าแม่กวนอิม ไหว้แล้วพ้นทุกข์','book_img-1765210832245.png','เรื่องราวและตำนานเกี่ยวกับอภินิหารต่างๆ ของเจ้าแม่กวนอิม หนึ่งในเทพ\r\nผู้เปี่ยมด้วยความเมตตากรุณา หลายความเชื่อ\r\nและความศรัทธาและการนำมาซึ่ง ความเป็นสิริมงคลแก่ชีวิต','Dharma','Buddhist',1,'SE19917'),('B90276',269.00,'แมงมุมแล้วไง ข้องใจเหรอคะ 11 (ฉบับนิยาย)','book_img-1765211059276.gif','เผ่ามนุษย์กับเผ่าปีศาจทำสงครามกันมาเนิ่นนาน\r\nบุคคลที่ได้รับสมญานามว่า ‘ผู้กล้า’ ซึ่งจะกลายเป็นสัญลักษณ์ของเผ่ามนุษย์ คือเด็กหนุ่มอายุเพียงหกขวบ\r\nแม้จะถูกปฏิบัติเหมือนเป็นเครื่องประดับ ไม่ก็ตัวภาระ ทว่าเด็กชายยูริอุสก็บากบั่นช่วยเหลือผู้คนด้วยจิตใจมุ่งมั่น\r\nทั้งภารกิจเปิดโปงองค์กรค้ามนุษย์ ปราบปรามมอนสเตอร์ในแต่ละประเทศ รวมถึง ‘ลอบสังหารจอมมาร’ ซึ่งรับมาจากเผ่าปีศาจที่น่าจะเป็นศัตรูคู่แค้น...\r\nเมื่อวันเวลาผ่านไป ทุกคนต่างชื่นชมเขาและเชื่อมั่นว่าเขาคือความหวังของมนุษยชาติ\r\nเส้นทางที่เต็มไปด้วยขวากหนามของผู้กล้าวัยเยาว์กำลังจะถูกเปิดเผย—!','Fantasy ','Novel',1,'SE70781'),('B94228',329.00,'ชีวิตตัวประกอบอย่างตูช่างอยู่ยากเมื่ออยู่ในโลกเกมจีบหนุ่ม (นิยาย) 3','book_img-1765211121225.gif','ชีวิตตัวประกอบอย่างตูช่างอยู่ยากเมื่ออยู่ในโลกเกมจีบหนุ่ม\r\nOtomege Sekai wa Mob ni Kibishii Sekai desu\r\nThe World of Otome Games is Tough for Mobs\r\n\r\nลีออน ผู้มีอดีตชาติเป็นพนักงานเงินเดือนในญี่ปุ่น ซึ่งเกิดใหม่ในโลก “เกมจีบหนุ่ม” ที่มีดาบและเวทมนตร์ ก็พบกับความสิ้นหวังกับโลกที่ผู้หญิงเป็นใหญ่ ในโลกใบนี้ ผู้ชายมีค่าแค่ปศุสัตว์ไว้เลี้ยงดูผู้หญิง ผู้ที่เป็นข้อยกเว้น มีแค่กองกำลังหนุ่มหล่อของเจ้าชายรัชทายาทที่เป็นตัวละครให้จีบในเกมเท่านั้น ในสภาพแวดล้อมอันแสนจะไร้เหตุผลสิ้นดี ลีออนก็มีอาวุธอยู่อย่างหนึ่ง ใช่แล้ว มันคือความรู้ของเกมนี้ที่เขาถูกน้องสาวแก่แดดบังคับขู่เข็ญให้เล่นในชาติก่อน ลีออนที่เคยคิดอยากใช้ชีวิตเก็บตัวเงียบๆ ในบ้านนอก ก็หันมาใช้ความรู้นั้นต่อต้านเหล่าผู้หญิงและพวกหน้าหล่อที่ชอบทำอะไรตามใจตัวเอง นิยายแฟนตาซีของการโค่นล้มผู้อยู่เหนือกว่าอย่างสบายๆ (?) โดยพระเอกนอกรีต ได้เริ่มขึ้นแล้ว!','Fantasy ','Novel',1,'SE70781'),('B94744',200.00,'กุญแจปรัชญา (INTRODUCING PHILOSOPHY)','book_img-1765210518155.png','กุญแจปรัชญา ถ่ายทอดเนื้อหาสาระอันสลับซับซ้อนของปรัชญาและความคิดด้วยรูปแบบที่เข้าถึงได้ง่าย เป็นความพยายามนำเรากลับไปเรียนรู้พันธกิจของปรัชญา เพื่อให้เราแลเห็นพัฒนาการของความคิดอย่างเป็นระบบ และกระบวนการทางปรัชญาที่ฝึกฝนให้เราคิดเข้าใจและตระหนักต่อสรรพสิ่งตรงเส้นขอบฟ้าของความรักในปรัชญา','history','Philosophy',1,'SE19917'),('B98064',420.00,'Philosophy 101 : ปรัชญา 101','book_img-1765210695502.png','จากเพตโตและโสกราตีส ถึง จริยธรรมและอภิปรัชญา มูลบทที่จำเป็นสำหรับประวัติศาสตร์ของความคิด หลักสูตรเร่งรัดเกี่ยวกับหลักการของความรู้ความจริงและค่านิยม\r\n','knowledge','Philosophy',1,'SE19917');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetail`
--

DROP TABLE IF EXISTS `orderdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderdetail` (
  `Detail_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Order_ID` varchar(20) NOT NULL,
  `Book_ID` varchar(10) NOT NULL,
  `Book_Total` int(11) DEFAULT 1,
  `Unit_Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`Detail_ID`),
  KEY `Order_ID` (`Order_ID`),
  KEY `Book_ID` (`Book_ID`),
  CONSTRAINT `orderdetail_ibfk_1` FOREIGN KEY (`Order_ID`) REFERENCES `orders` (`Order_ID`) ON DELETE CASCADE,
  CONSTRAINT `orderdetail_ibfk_2` FOREIGN KEY (`Book_ID`) REFERENCES `book` (`Book_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetail`
--

LOCK TABLES `orderdetail` WRITE;
/*!40000 ALTER TABLE `orderdetail` DISABLE KEYS */;
INSERT INTO `orderdetail` VALUES (1,'BH837340','B28056',1,212.00),(2,'BH543954','B73183',1,299.00),(3,'BH543954','B36274',1,125.00),(4,'BH718563','B62612',1,125.00);
/*!40000 ALTER TABLE `orderdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `Order_ID` varchar(20) NOT NULL,
  `User_ID` varchar(15) DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'Pending',
  `Created_At` datetime DEFAULT current_timestamp(),
  `Order_Price` decimal(10,2) DEFAULT 0.00,
  `Order_Date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Order_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('BH543954','UID3407','Paid','2025-12-08 22:48:29',424.00,'2025-12-08 22:48:29'),('BH718563','UID3407','Paid','2025-12-08 23:31:44',125.00,'2025-12-08 23:31:44'),('BH837340','UID3407','Paid','2025-12-08 22:32:39',212.00,'2025-12-08 22:32:39'),('BH895785','UID3407','Pending','2025-12-08 23:42:40',0.00,'2025-12-08 23:42:40');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seller`
--

DROP TABLE IF EXISTS `seller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `seller` (
  `Seller_ID` varchar(15) NOT NULL,
  `Seller_Name` varchar(100) DEFAULT NULL,
  `Seller_Email` varchar(100) DEFAULT NULL,
  `Seller_Password` varchar(100) DEFAULT NULL,
  `Seller_img` varchar(100) DEFAULT NULL,
  `Seller_Birthday` date DEFAULT NULL,
  `Seller_Address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Seller_ID`),
  UNIQUE KEY `Seller_Name` (`Seller_Name`),
  UNIQUE KEY `Seller_Email` (`Seller_Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seller`
--

LOCK TABLES `seller` WRITE;
/*!40000 ALTER TABLE `seller` DISABLE KEYS */;
INSERT INTO `seller` VALUES ('SE19917','Monk001','Monk001@gmail.com','Monk001','avatar-1765210761247.png','2025-12-17','dsad'),('SE53357','ff','ff','aa','avatar-1765210231715.jpg','2025-12-14','ff'),('SE70781','fog','fog','Fog','avatar-1765211472559.gif','2025-12-12','fog');
/*!40000 ALTER TABLE `seller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `User_ID` varchar(15) NOT NULL,
  `User_Name` varchar(100) DEFAULT NULL,
  `User_Email` varchar(100) DEFAULT NULL,
  `User_Password` varchar(100) DEFAULT NULL,
  `User_img` varchar(100) DEFAULT NULL,
  `User_Birthday` date DEFAULT NULL,
  `User_Address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `User_Name` (`User_Name`),
  UNIQUE KEY `User_Email` (`User_Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('UID3407','ff','ff','ff','avatar-1765207890627.jpg','2025-12-05','ff');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-08 23:54:20
