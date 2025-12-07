const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const con = mysql.createConnection({
     host: "localhost",
    user: "root", 
    password: ""
})

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
  con.query("CREATE DATABASE IF NOT EXISTS Bookishhouse", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

    con.changeUser({database : 'Bookishhouse'}, function(err) {
    if (err) throw err;
    console.log("Using Database Bookishhouse");
  });
   

})
function queryDB(sql, params = []) {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}
//avatar upload setup
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'img/Logo_Icon/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });


app.post('/profilepic', upload.single("avatar"),async(req,res) => {
        try{
        const username = req.cookies.username;
        
        if (!req.file) {
            console.log("No file uploaded.");
            return res.redirect('feed.html');
        }
        
        const newFilename = req.file.filename;
        await updateImg(username, newFilename);

        res.cookie('img', newFilename);
        return res.redirect('feed.html');

    }catch (err) {
        console.error("Error uploading profile picture:", err);
        return res.redirect('feed.html');
    }
})

const updateImg = async (username, filen) => {
    let sql = `UPDATE userInfo SET img = '${filen}' WHERE username = '${username}'`;
    try {
        await queryDB(sql);

    } catch (err) {
        console.error("Error in updateImg helper:", err);
    }
}




app.post('/regisDB', async (req, res) => {
    try {
        let generatedID = "UID" + Math.floor(1000 + Math.random() * 9000);

        let sql = `CREATE TABLE IF NOT EXISTS User (
            User_ID VARCHAR(15) NOT NULL,
            User_Name VARCHAR(100) UNIQUE,  
            User_Email VARCHAR(100) UNIQUE,  
            User_Password VARCHAR(100),
            User_img VARCHAR(100),
            User_Birthday DATE,
            PRIMARY KEY (User_ID)
        )`;
        await queryDB(sql);

        sql = `INSERT INTO User (
            User_ID, User_Name, User_Email, User_Password, User_Birthday
        ) VALUES (
            "${generatedID}", 
            "${req.body.username}", 
            "${req.body.email}", 
            "${req.body.password}",
            "${req.body.birthday}"
        )`;
        
        await queryDB(sql);

        console.log(" User ใหม่: " + req.body.username);
        return res.redirect('/Login/login.html');

    } catch (err) {

        if (err.code === 'ER_DUP_ENTRY') {
            console.warn("มีการพยายามใช้นามซ้ำ:", err.sqlMessage);
            
            return res.send(`
                <script>
                    alert('บังอาจนัก! ชื่อ Username หรือ Email นี้มีผู้ครอบครองแล้ว จงไปคิดนามใหม่ซะ!');
                    window.history.back();
                </script>
            `);
        }

        console.error("Error to Register", err);
        return res.send("เกิดข้อผิดพลาดในพิธีกรรมการสมัคร!");
    }
});

app.post('/regisSeller', async (req, res) => {
    try {
        let generatedID = "SE" + Math.floor(10000 + Math.random() * 90000);

        let sql = `CREATE TABLE IF NOT EXISTS Seller (
            Seller_ID VARCHAR(15) NOT NULL,
            Seller_Name VARCHAR(100) UNIQUE,    /* 🔥 ห้ามชื่อร้านซ้ำ! */
            Seller_Email VARCHAR(100) UNIQUE,   /* 🔥 ห้ามอีเมลซ้ำ! */
            Seller_Password VARCHAR(100),
            Seller_img VARCHAR(100),
            Seller_Birthday DATE,
            PRIMARY KEY (Seller_ID)
        )`;
        let result = await queryDB(sql);

        sql = `INSERT INTO Seller (
            Seller_ID, 
            Seller_Name, 
            Seller_Email, 
            Seller_Password, 
            Seller_Birthday
        ) VALUES (
            "${generatedID}", 
            "${req.body.username}", 
            "${req.body.email}", 
            "${req.body.password}",
            "${req.body.birthday}"
        )`;
        
        result = await queryDB(sql);

        // ✨ หากสำเร็จ: ส่งไปยังหน้าเข้าสู่ระบบทันที
        console.log("กำเนิด Seller ใหม่สำเร็จ: " + req.body.username);
        return res.redirect('/Login/login.html');

    } catch (error) {
        //  ดักจับปีศาจชื่อซ้ำ (Duplicate Entry)
        if (error.code === 'ER_DUP_ENTRY') {
            console.warn("มีการพยายามใช้นามผู้ค้าซ้ำ:", error.sqlMessage);
            
            // ส่งเวทย์มนตร์แจ้งเตือน แล้วถีบกลับไปหน้าเดิม
            return res.send(`
                <script>
                    alert('ช้าก่อน! ชื่อร้านค้าหรืออีเมลนี้มีผู้จับจองแล้ว จงตั้งนามใหม่เสียเถิด!');
                    window.history.back();
                </script>
            `);
        }

        console.error(" fail:", error);
        res.status(500).send("fail");
    }
});




app.post('/checkLogin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // ล้างทุกคุกกี้ทุกครั้งที่ล็อกอิน
        res.clearCookie('Seller_ID');
        res.clearCookie('User_ID');
        res.clearCookie('img');

        // ตรวจ USER ก่อน
        let sql = `SELECT * FROM User WHERE User_Name = ?`;
        let result = await queryDB(sql, [username]);

        if (result.length > 0) {
            const u = result[0];

            if (u.User_Password === password) {
                console.log("Login success: User Role");

                res.cookie('User_ID', u.User_ID);
                res.cookie('img', u.User_img);

                return res.redirect('Hompage/Home.html');
            }

            console.log("Login fail: Wrong Password (User)");
            return res.redirect('/Login/login.html');
        }

        // ตรวจ SELLER ต่อ
        sql = `SELECT * FROM Seller WHERE Seller_Name = ?`;
        result = await queryDB(sql, [username]);

        if (result.length > 0) {
            const s = result[0];

            if (s.Seller_Password === password) {
                console.log("Login success: Seller Role");

                res.cookie('Seller_ID', s.Seller_ID);
                res.cookie('img', s.Seller_img);

                return res.redirect('Sell/Sell.html');
            }

            console.log("Login fail: Wrong Password (Seller)");
            return res.redirect('/Login/login.html');
        }

        console.log("User/Seller not found");
        return res.redirect('/Login/login.html');

    } catch (err) {
        console.error("Error login: มนตราวิบัติ", err);
        return res.redirect('/Login/login.html');
    }
});

app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('/Login/login.html');
})


app.post('/addBook', upload.single("book_img"), async (req, res) => {
    try {
        
        let filename = req.file ? req.file.filename : "";
        let name = req.body.name || "";
        let Seller_ID = req.body.Seller_ID || "";
        let price = parseFloat(req.body.price) || 0; 
        
        console.log("📦 กำลังรับข้อมูล:", req.body); // ดู Log ว่าค่าส่งมาครบไหม

        // สร้างตาราง (ถ้ายังไม่มี)
        let createTableSql = `CREATE TABLE IF NOT EXISTS Book (
            Book_ID VARCHAR(10) NOT NULL,
            Book_Price DECIMAL(10,2),
            Book_Name VARCHAR(100),
            Book_Img VARCHAR(100),
            Book_Detail VARCHAR(1000),
            Book_Tag VARCHAR(100),
            Book_Category VARCHAR(100),
            Book_Quantity INT(15) DEFAULT 0, 
            Seller_ID VARCHAR(15) NOT NULL,
            PRIMARY KEY (Book_ID),
            FOREIGN KEY (Seller_ID) REFERENCES Seller(Seller_ID) ON DELETE CASCADE
        )`;
        await queryDB(createTableSql);

        // 2. ตรวจสอบว่ามีหนังสือซ้ำหรือไม่
        // (ระวัง: การใช้ ${} ตรงนี้ถ้าชื่อมี ' หรือ " จะ Error ได้ แต่ข้าคงไว้ตาม style ท่านก่อน)
        let checkSql = `SELECT * FROM Book WHERE Book_Name = "${name}" AND Seller_ID = "${Seller_ID}"`;
        let existingBooks = await queryDB(checkSql);

        if (existingBooks.length > 0) {
            // ⚔️ กรณีเจอของเดิม (Update)
            let currentBook = existingBooks[0];
            let updateSql = `UPDATE Book SET Book_Quantity = Book_Quantity + 1`;

            if (filename) {
                updateSql += `, Book_Img = "${filename}"`;
            }

            updateSql += ` WHERE Book_ID = "${currentBook.Book_ID}"`;
            
            await queryDB(updateSql);
            console.log("Update สำเร็จ!");
            res.send({ message: "เพิ่มจำนวนหนังสือเรียบร้อยแล้ว", bookID: currentBook.Book_ID, action: "updated" });

        } else {
            // ✨ กรณีของใหม่ (Insert)
            if (!filename) {
                return res.status(400).send({ message: "กรุณาแนบรูปภาพหนังสือด้วยขอรับ!" });
            }

            // สุ่ม ID
            let generatedBookID = "B" + Math.floor(10000 + Math.random() * 90000);
            
            // 🛡️ เช็คก่อนว่า Seller_ID มีจริงไหม (กันเหนียว)
            // ถ้ามั่นใจว่า Database ท่านมี FK แล้ว ข้ามส่วนนี้ไปให้ SQL ตัดสินก็ได้
            // แต่ถ้า Seller_ID มั่ว SQL จะ Error ตรงนี้แหละขอรับ

            let insertSql = `INSERT INTO Book (
                Book_ID, Book_Price, Book_Name, Book_Img, Book_Detail, 
                Book_Tag, Book_Category, Book_Quantity, Seller_ID
            ) VALUES (
                "${generatedBookID}", 
                ${price}, 
                "${name}", 
                "${filename}", 
                "${req.body.detail || ''}",
                "${req.body.tag || ''}", 
                "${req.body.category || ''}", 
                1, 
                "${Seller_ID}" 
            )`; 
            
            await queryDB(insertSql);
            console.log("Insert สำเร็จ!");
            res.send({ message: "done", bookID: generatedBookID, action: "inserted" });
        }

    } catch (error) {
        // 🚨 จุดสำคัญ! ดู Error ที่ Terminal (จอดำ) นะขอรับ
        console.error("🔥 Server Error Log:", error);

        // เช็คว่าเป็นเพราะ Seller_ID ไม่มีจริงหรือไม่
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.message.includes('foreign key constraint fails')) {
            return res.status(500).send({ message: `ล้มเหลว! ไม่พบ Seller ID: ${req.body.seller_id} ในระบบ (กรุณาสมัครสมาชิกก่อน)` });
        }

        res.status(500).send({ message: "ล้มเหลว! " + error.message });
    }
})


 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/Login/login.html`);
        
});





