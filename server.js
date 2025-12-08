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
app.use(cookieParser())


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

    con.changeUser({database : 'Bookishhouse'}, function(err) {
      if (err) throw err;
      console.log("Using Database Bookishhouse");

      con.query(`CREATE TABLE IF NOT EXISTS Seller (
        Seller_ID VARCHAR(15) NOT NULL,
        Seller_Name VARCHAR(100) UNIQUE,   
        Seller_Email VARCHAR(100) UNIQUE,   
        Seller_Password VARCHAR(100),
        Seller_img VARCHAR(100),
        Seller_Birthday DATE,
        Seller_Address VARCHAR(255),    
        PRIMARY KEY (Seller_ID)
      )`, function(err, result) {
        if(err) throw err;
        console.log("Seller table ready");
      });

      con.query(`CREATE TABLE IF NOT EXISTS User (
        User_ID VARCHAR(15) NOT NULL,
        User_Name VARCHAR(100) UNIQUE,  
        User_Email VARCHAR(100) UNIQUE,  
        User_Password VARCHAR(100),
        User_img VARCHAR(100),
        User_Birthday DATE,
        User_Address VARCHAR(255),
        PRIMARY KEY (User_ID)
      )`, function(err, result) {
        if(err) throw err;
        console.log("User table ready");
      });
    });
  });


});

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
      callback(null, 'img/Book_Img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const storageprofile = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'img/Profile_Img/');
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
const uploadprofile = multer({ storage: storageprofile, fileFilter: imageFilter });


app.post('/Updateinfo', uploadprofile.single("avatar"), async (req, res) => {
    try {
    

        // 1. ดึง ID จาก Cookie
        const userID = req.cookies.User_ID;
        const sellerID = req.cookies.Seller_ID;

        if (!userID && !sellerID) {
            console.log("ไม่พบ Cookie User_ID หรือ Seller_ID");
            return res.send("<script>alert('Session หมดอายุ กรุณาล็อกอินใหม่'); window.location='/Login/login.html';</script>");
        }

       const { username, email, date, address } = req.body;
        const newImage = req.file ? req.file.filename : null;

        let sql = "";
        let params = [];

        
        //   USER
        
        if (userID) {
            console.log(`👤 อัปเดต User ID: ${userID}`);
            if (newImage) {
                // เปลี่ยนรูป + ข้อมูล
                sql = `UPDATE User SET User_Name=?, User_Email=?, User_Birthday=?, User_Address=?, User_img=? WHERE User_ID=?`;
                params = [username, email, date, address, newImage, userID];
                res.cookie('img', newImage); 
            } else {
                // เปลี่ยนแค่ข้อมูล
                sql = `UPDATE User SET User_Name=?, User_Email=?, User_Birthday=?, User_Address=? WHERE User_ID=?`;
                params = [username, email, date, address, userID];
            }
        } 

        //  SELLER
        else if (sellerID) {
            console.log(`🏪 อัปเดต Seller ID: ${sellerID}`);
            if (newImage) {
                sql = `UPDATE Seller SET Seller_Name=?, Seller_Email=?, Seller_Birthday=?, Seller_Address=?, Seller_img=? WHERE Seller_ID=?`;
                params = [username, email, date, address, newImage, sellerID];
                res.cookie('img', newImage);
            } else {
                sql = `UPDATE Seller SET Seller_Name=?, Seller_Email=?, Seller_Birthday=?, Seller_Address=? WHERE Seller_ID=?`;
                params = [username, email, date, address, sellerID];
            }
        }

        if (sql) {
            await queryDB(sql, params);
            console.log(" Database Updated Successfully!");
            
            return res.send(`
                <script>
                    alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
                    window.location = '/Profile/profile.html';
                </script>
            `);
        } else {
            throw new Error("เกิดข้อผิดพลาดในการสร้างคำสั่ง SQL");
        }

    } catch (err) {
        console.error("🔥 Update Info Error:", err);
        return res.send(`
            <script>
                alert('เกิดข้อผิดพลาด: ${err.message.replace(/'/g, "")}');
                window.history.back();
            </script>
        `);
    }
});




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

         const username = req.body.username;  
           const email = req.body.email;
     // ตรวจสอบว่าชื่อซ้ำใน User
        let existingUser = await queryDB(`SELECT * FROM User WHERE User_Name = ? OR User_Email = ? LIMIT 1`, [username, email]);
        if (existingUser.length > 0) {
            return res.send(`<script>alert('ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว'); window.history.back();</script>`);
        }

        // ตรวจสอบชื่อซ้ำกับ Seller
        let existingSeller = await queryDB(`SELECT * FROM Seller WHERE Seller_Name = ? LIMIT 1`, [username]);
        if (existingSeller.length > 0) {
            return res.send(`<script>alert('ชื่อนี้มีผู้ค้าจองอยู่แล้ว'); window.history.back();</script>`);
        }


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
                    alert(' ชื่อ Username หรือ Email นี้มีผู้ครอบครองแล้ว ');
                    window.history.back();
                </script>
            `);
        }

        console.error("Error to Register", err);
        return res.send("เกิดข้อผิดพลาดในการสมัคร!");
    }
});

app.post('/regisSeller', async (req, res) => {
    try {
       
        let generatedID = "SE" + Math.floor(10000 + Math.random() * 90000);

        let sql = `CREATE TABLE IF NOT EXISTS Seller (
            Seller_ID VARCHAR(15) NOT NULL,
            Seller_Name VARCHAR(100) UNIQUE,   
            Seller_Email VARCHAR(100) UNIQUE,   
            Seller_Password VARCHAR(100),
            Seller_img VARCHAR(100),
            Seller_Birthday DATE,
            PRIMARY KEY (Seller_ID)
        )`;
        
        let result = await queryDB(sql);

         const username = req.body.username;  
        const email = req.body.email;

         // ตรวจสอบว่าชื่อซ้ำใน User
        let existingUser = await queryDB(`SELECT * FROM User WHERE User_Name = ? OR User_Email = ? LIMIT 1`, [username, email]);
        if (existingUser.length > 0) {
            return res.send(`<script>alert('ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว'); window.history.back();</script>`);
        }

        // ตรวจสอบชื่อซ้ำกับ Seller
        let existingSeller = await queryDB(`SELECT * FROM Seller WHERE Seller_Name = ? LIMIT 1`, [username]);
        if (existingSeller.length > 0) {
            return res.send(`<script>alert('ชื่อนี้มีผู้ค้าจองอยู่แล้ว'); window.history.back();</script>`);
        }



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

        console.log("กำเนิด Seller ใหม่สำเร็จ: " + req.body.username);
        return res.redirect('/Login/login.html');

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.warn("มีการพยายามใช้นามผู้ค้าซ้ำ:", error.sqlMessage);
            
            return res.send(`
                <script>
                    alert('ช้าก่อน! ชื่อร้านค้าหรืออีเมลนี้มีผู้จับจองแล้ว');
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
        res.clearCookie('name');
        res.clearCookie('Seller_ID');
        res.clearCookie('User_ID');
        res.clearCookie('img');

        // ตรวจ USER 
        let sql = `SELECT * FROM User WHERE User_Name = ?`;
        let result = await queryDB(sql, [username]);

        if (result.length > 0) {
            const u = result[0];

            if (u.User_Password === password) {
                console.log("Login success: User Role");

                res.cookie('name', u.User_Name);
                res.cookie('User_ID', u.User_ID);
                res.cookie('img', u.User_img);

                return res.redirect('Hompage/Home.html');
            }

            console.log("Login fail: Wrong Password (User)");
            return res.redirect('/Login/login.html');
        }

        // ตรวจ SELLER 
        sql = `SELECT * FROM Seller WHERE Seller_Name = ?`;
        result = await queryDB(sql, [username]);

        if (result.length > 0) {
            const s = result[0];

            if (s.Seller_Password === password) {
                console.log("Login success: Seller Role");
                res.cookie('name', s.Seller_Name);
                res.cookie('Seller_ID', s.Seller_ID);
                res.cookie('img', s.Seller_img);

                return res.redirect('StorageSeller/storageseller.html');
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

app.post('/logout', (req,res) => {
        res.clearCookie('name');
        res.clearCookie('Seller_ID');
        res.clearCookie('User_ID');
        res.clearCookie('img');
    return res.redirect('/Login/login.html');
})


app.post('/addBook', upload.single("book_img"), async (req, res) => {
    try {

        let filename = req.file ? req.file.filename : "";
        let name = req.body.name || "";
        let Seller_ID = req.body.Seller_ID || "";
        let price = parseFloat(req.body.price) || 0; 
        
        console.log(" กำลังรับข้อมูล:", req.body); // ดู Log ว่าค่าส่งมาครบไหม

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

       
        let checkSql = `SELECT * FROM Book WHERE Book_Name = "${name}" AND Seller_ID = "${Seller_ID}"`;
        let existingBooks = await queryDB(checkSql);

        if (existingBooks.length > 0) {
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
            
            if (!filename) {
                return res.status(400).send({ message: "กรุณาแนบรูปภาพหนังสือด้วยขอรับ!" });
            }

            let generatedBookID = "B" + Math.floor(10000 + Math.random() * 90000);
            
          

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
       
        console.error(" Server Error Log:", error);

        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.message.includes('foreign key constraint fails')) {
            return res.status(500).send({ message: `ล้มเหลว! ไม่พบ Seller ID: ${req.body.seller_id} ในระบบ (กรุณาสมัครสมาชิกก่อน)` });
        }

        res.status(500).send({ message: "ล้มเหลว! " + error.message });
    }
})

app.get('/getBooks', async (req, res) => {
    try {
        const sql = `SELECT * FROM Book`;
        const books = await queryDB(sql);
        res.json(books);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลหนังสือได้" });
    }
});
app.post('/addToOrder', async (req, res) => {
    try {
        const userID = req.cookies.User_ID;
        const bookID = req.body.Book_ID;
        const quantity = req.body.Quantity || 1;

        if(!userID) {
            return res.send(`<script>alert('ต้องเข้าสู่ระบบก่อน'); window.location='/Login/login.html';</script>`);
        }

        let bookSql = `SELECT Book_Price, Book_Quantity 
               FROM Book 
               WHERE Book_ID = ? 
               FOR UPDATE`;
        let bookResult = await queryDB(bookSql, [bookID]);
        if(bookResult.length === 0) return res.send(`<script>alert('ไม่พบหนังสือเล่มนี้'); window.history.back();</script>`);
        if (bookResult[0].Book_Quantity <= 0 || bookResult[0].Book_Quantity < quantity) {
             return res.send(`<script>alert('จำนวนหนังสือไม่เพียงพอแล้ว'); window.history.back();</script>`);
}

        let pricePerUnit = bookResult[0].Book_Price;

        // สร้าง table 
        await queryDB(`
            CREATE TABLE IF NOT EXISTS Orders (
                Order_ID VARCHAR(20) PRIMARY KEY,
                User_ID VARCHAR(15),
                Status VARCHAR(20) DEFAULT 'Pending',
                Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
                Order_Price DECIMAL(10,2) DEFAULT 0,
                Order_Date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await queryDB(`
            CREATE TABLE IF NOT EXISTS OrderDetail (
                Detail_ID INT AUTO_INCREMENT PRIMARY KEY,
                Order_ID VARCHAR(20) NOT NULL,
                Book_ID VARCHAR(10) NOT NULL,
                Book_Total INT DEFAULT 1,
                Unit_Price DECIMAL(10,2),
                FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
                FOREIGN KEY (Book_ID) REFERENCES Book(Book_ID) ON DELETE CASCADE
            )
        `);

        // หา order pending ของ user
        let findOrderSql = `SELECT Order_ID FROM Orders WHERE User_ID = ? AND Status = 'Pending' LIMIT 1`;
        let orderResult = await queryDB(findOrderSql, [userID]);

        let currentOrderID;
        if(orderResult.length > 0){
            currentOrderID = orderResult[0].Order_ID;
        } else {
            currentOrderID = "BH" + Math.floor(100000 + Math.random() * 900000);
            await queryDB(`INSERT INTO Orders (Order_ID, User_ID) VALUES (?, ?)`, [currentOrderID, userID]);
        }

        // ตรวจสอบ OrderDetail
        let checkItemSql = `SELECT * FROM OrderDetail WHERE Order_ID = ? AND Book_ID = ?`;
        let existingItem = await queryDB(checkItemSql, [currentOrderID, bookID]);

        if(existingItem.length > 0){
            // update จำนวน
            let updateSql = `
                UPDATE OrderDetail
                SET Book_Total = Book_Total + ?,
                    Unit_Price = (Book_Total + ?) * ?
                WHERE Order_ID = ? AND Book_ID = ?
            `;
            await queryDB(updateSql, [quantity, quantity, pricePerUnit, currentOrderID, bookID]);
        } else {
            // insert ใหม่
            await queryDB(`
                INSERT INTO OrderDetail (Order_ID, Book_ID, Book_Total, Unit_Price)
                VALUES (?, ?, ?, ?)
            `, [currentOrderID, bookID, quantity, pricePerUnit * quantity]);
        }
        await queryDB(`UPDATE Book SET Book_Quantity = Book_Quantity - ? WHERE Book_ID = ?`, [quantity, bookID]);


        // อัปเดตราคารวม
        let total = await queryDB(`SELECT SUM(Unit_Price) AS Total FROM OrderDetail WHERE Order_ID = ?`, [currentOrderID]);
        let sumPrice = total[0].Total || 0;
        await queryDB(`UPDATE Orders SET Order_Price = ? WHERE Order_ID = ?`, [sumPrice, currentOrderID]);

        return res.redirect('/Hompage/Home.html');

    } catch(err) {
        console.error(" AddToOrder Error:", err);
        return res.send("เกิดข้อผิดพลาด: " + err.message);
    }
});
app.get('/getOrderDetail', async (req, res) => {
    try {
        const userID = req.cookies.User_ID;

        if (!userID) {
            return res.status(401).json({ message: "โปรดเข้าสู่ระบบก่อน" });
        }

        // ดึง order pending ล่าสุด
        const orderSql = `SELECT Order_ID FROM Orders WHERE User_ID = ? AND Status = 'Pending' LIMIT 1`;
        const orders = await queryDB(orderSql, [userID]);

        if (orders.length === 0) {
            return res.json({ orderID: null, items: [] });
        }

        const orderID = orders[0].Order_ID;

        // ดึง OrderDetail พร้อมข้อมูลหนังสือ
        const detailSql = `
            SELECT od.Book_ID, od.Book_Total, od.Unit_Price, b.Book_Name, b.Book_Img
            FROM OrderDetail od
            JOIN Book b ON od.Book_ID = b.Book_ID
            WHERE od.Order_ID = ?
        `;
        const items = await queryDB(detailSql, [orderID]);

        res.json({ orderID, items });
    } catch (err) {
        console.error("Error fetching OrderDetail:", err);
        res.status(500).json({ message: "ไม่สามารถดึงรายการสั่งซื้อได้" });
    }
});
app.post('/removeFromOrder', async (req, res) => {
    try {
        const userID = req.cookies.User_ID;
        const bookID = req.body.Book_ID;
        const quantity = parseInt(req.body.Quantity) || 1;

        if (!userID) {
            return res.status(401).json({ message: "โปรดเข้าสู่ระบบก่อน" });
        }

        // หา order pending ของ user
        const orderSql = `SELECT Order_ID FROM Orders WHERE User_ID = ? AND Status = 'Pending' LIMIT 1`;
        const orders = await queryDB(orderSql, [userID]);
        if (orders.length === 0) {
            return res.status(400).json({ message: "ไม่พบ order ที่ค้างอยู่" });
        }

        const orderID = orders[0].Order_ID;

        // ดึง Book_Total ปัจจุบัน
        const detailSql = `SELECT Book_Total, Unit_Price FROM OrderDetail WHERE Order_ID = ? AND Book_ID = ?`;
        const details = await queryDB(detailSql, [orderID, bookID]);
        if (details.length === 0) {
            return res.status(400).json({ message: "ไม่พบสินค้านี้ใน order" });
        }

        const currentTotal = details[0].Book_Total;
        const unitPrice = details[0].Unit_Price / currentTotal;

        if (quantity >= currentTotal) {
            // ลบทั้งหมดถ้า remove มากกว่าหรือเท่ากับจำนวนที่มี
            await queryDB(`DELETE FROM OrderDetail WHERE Order_ID = ? AND Book_ID = ?`, [orderID, bookID]);
        } else {
            // ลดจำนวนและอัปเดตราคา
            const newTotal = currentTotal - quantity;
            const newUnitPrice = unitPrice * newTotal;
            await queryDB(`UPDATE OrderDetail SET Book_Total = ?, Unit_Price = ? WHERE Order_ID = ? AND Book_ID = ?`,
                [newTotal, newUnitPrice, orderID, bookID]);
        }

        // อัปเดตราคารวม order ใหม่
        const totalResult = await queryDB(`SELECT SUM(Unit_Price) AS Total FROM OrderDetail WHERE Order_ID = ?`, [orderID]);
        const sumPrice = totalResult[0].Total || 0;
        await queryDB(`UPDATE Orders SET Order_Price = ? WHERE Order_ID = ?`, [sumPrice, orderID]);

        res.json({ message: "ลบสินค้าเรียบร้อย", newTotal: sumPrice });

    } catch (err) {
        console.error("🔥 RemoveFromOrder Error:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบสินค้า" });
    }
});

app.post('/Checkout', async (req, res) => {
    try {
        const userID = req.cookies.User_ID;
        if (!userID) return res.status(401).json({ message: 'โปรดเข้าสู่ระบบก่อน' });

        // หา Order Pending ปัจจุบัน
        const orderSql = `SELECT Order_ID FROM Orders WHERE User_ID = ? AND Status = 'Pending' LIMIT 1`;
        const orders = await queryDB(orderSql, [userID]);

        if (orders.length === 0) return res.status(400).json({ message: 'ไม่มีรายการสินค้า' });

        const currentOrderID = orders[0].Order_ID;

        // ทำเครื่องหมาย Order เป็น "Paid" หรือ "Completed"
        await queryDB(`UPDATE Orders SET Status = 'Paid' WHERE Order_ID = ?`, [currentOrderID]);

        // สร้าง Order ใหม่ 
        const newOrderID = "BH" + Math.floor(100000 + Math.random() * 900000);
        await queryDB(`INSERT INTO Orders (Order_ID, User_ID) VALUES (?, ?)`, [newOrderID, userID]);

        
        res.json({ message: 'ชำระเงินเรียบร้อย', newOrderID });
    } catch (err) {
        console.error("Checkout Error:", err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดขณะชำระเงิน' });
    }
});


 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/Login/login.html`);
        
});





