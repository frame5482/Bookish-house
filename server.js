const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
const multer = require('multer');

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





const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}


app.post('/regisDB', async (req,res) => {
   try {

    let generatedID = "UID" + Math.floor(1000 + Math.random() * 9000);
    
        let sql  = `  CREATE TABLE IF NOT EXISTS User (
                User_ID VARCHAR(15) NOT NULL,
                User_Name VARCHAR(100),
                User_Email VARCHAR(100),
                User_Password VARCHAR(100),
                User_img VARCHAR(100),
                User_Birthday DATE,
                PRIMARY KEY (User_ID)
    )`; 
    let result = await queryDB(sql);

        sql = ` INSERT INTO User (User_ID, User_Name, User_Email, User_Password, User_Birthday) VALUES (
        "${generatedID}", 
        "${req.body.username}", 
        "${req.body.email}", 
        "${req.body.password}",
        "${req.body.birthday}"
    )`;   
    result = await queryDB(sql);
    }

    catch (err) {
        console.error("Error to Register", err);
    }
    return res.redirect('/Login/login.html');
})

app.post('/regisSeller', async (req, res) => {
    try {
        
        let generatedID = "SE" + Math.floor(10000 + Math.random() * 90000);

        
        let sql = `CREATE TABLE IF NOT EXISTS Seller (
            Seller_ID VARCHAR(15) NOT NULL,
            Seller_Name VARCHAR(100),
            Seller_Email VARCHAR(100),
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


    } catch (error) {
        console.error(" fail:", error);
        res.status(500).send("fail");
    }
     return res.redirect('/Login/login.html');

})





app.post('/checkLogin', async (req, res) => {
    try {

        const { username, password } = req.body;

        let sql = `SELECT * FROM User WHERE User_Name = "${username}"`;
        let result = await queryDB(sql);

        if (result.length > 0) {
            const foundUser = result[0];
            if (foundUser.User_Password === password) {
                console.log("Login success: User Role");
                
                
                res.cookie('User_Name', foundUser.User_Name);
                res.cookie('img', foundUser.User_img);

                return res.redirect('Hompage/Home.html'); 
            } else {
                console.log("Login fail: Wrong Password (User)");
                return res.redirect('/Login/login.html');
            }
        }


        sql = `SELECT * FROM Seller WHERE Seller_ID = "${username}"`;
        result = await queryDB(sql);

        if (result.length > 0) {
            const foundSeller = result[0];
            
            if (foundSeller.Seller_Password === password) {
                console.log("Login success: Seller Role");

                res.cookie('Seller_ID', foundSeller.Seller_ID);
                res.cookie('img', foundSeller.Seller_img);

                return res.redirect('/Seller/SellerHome.html'); 
            } else {
                console.log("Login fail: Wrong Password (Seller)");
                return res.redirect('/Login/login.html');
            }
        }

       
        console.log("User/Seller not found");
        return res.redirect('/Login/login.html');

    } catch (err) {
        console.error("Error login: มนตราวิบัติ", err);
        return res.redirect('/Login/login.html');
    }
})








app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('/Login/login.html');
})




app.post('/addBook', async (req, res) => {
    try {
        let sql = `CREATE TABLE IF NOT EXISTS Book (
            Book_ID VARCHAR(10) NOT NULL,
            Book_Price DECIMAL(10,2),
            Book_Name VARCHAR(100),
            Book_Img VARCHAR(100),
            Book_Detail VARCHAR(1000),
            Book_Tag VARCHAR(100),
            Book_Quantity INT(15) DEFAULT 0, 
            Seller_ID VARCHAR(15) NOT NULL,
            PRIMARY KEY (Book_ID),
            FOREIGN KEY (Seller_ID) REFERENCES Seller(Seller_ID) ON DELETE CASCADE
        )`;
        await queryDB(sql);
        
      
        let checkSql = `SELECT * FROM Book WHERE Book_Name = "${req.body.name}" AND Seller_ID = "${req.body.seller_id}"`;
        let existingBooks = await queryDB(checkSql);

        if (existingBooks.length > 0) {
            let currentBook = existingBooks[0];
            let updateSql = `UPDATE Book 
                             SET Book_Quantity = Book_Quantity + 1 
                             WHERE Book_ID = "${currentBook.Book_ID}"`;
            
            await queryDB(updateSql);
            res.send({ message: "เพิ่มจำนวนหนังสือเรียบร้อยแล้ว", bookID: currentBook.Book_ID, action: "updated" });

        }
        
        else {
            let generatedBookID = "B" + Math.floor(10000 + Math.random() * 90000);
            
            let insertSql = `INSERT INTO Book (
                Book_ID, 
                Book_Price, 
                Book_Name, 
                Book_Img, 
                Book_Detail, 
                Book_Tag, 
                Book_Quantity,
                Seller_ID
            ) VALUES (
                "${generatedBookID}", 
                ${req.body.price}, 
                "${req.body.name}", 
                "${req.body.img}",
                "${req.body.detail}",
                "${req.body.tag}",
                1, 
                "${req.body.seller_id}" 
            )`; 
            
            await queryDB(insertSql);
            res.send({ message: "done", bookID: generatedBookID, action: "inserted" });
        }

    } catch (error) {
        console.error("fail:", error);
        res.status(500).send("ล้มเหลว! อาจเพราะไม่พบ Seller_ID หรือโครงสร้างผิดพลาด");
    }
})



 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/Login/login.html`);
        
});





