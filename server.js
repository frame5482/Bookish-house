const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');

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
   

});




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

    let generatedID = "60" + Math.floor(1000 + Math.random() * 9000);
    
        let sql  = `  CREATE TABLE IF NOT EXISTS User (
                User_ID VARCHAR(15) NOT NULL,
                User_Name VARCHAR(100),
                User_Email VARCHAR(100),
                User_Password VARCHAR(100),
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
    return res.redirect('login.html');
})

app.post('/checkLogin',async (req,res) => {
  
try {
        const { username, password } = req.body;
        const sql = `SELECT * FROM User WHERE User_Name = "${username}"`;
        const result = await queryDB(sql);

        if (result.length === 0) {
            console.log("user not found");
            return res.redirect('login.html');
        }

    const foundUser = result[0];
    if (foundUser.User_Password === password) {
        console.log("Login success");
        res.cookie('User_Name', foundUser.User_Name);
        res.cookie('img', foundUser.img); 
        return res.redirect('Home.html');
    }

    else {
        console.log("Login fail");
        return res.redirect('/Login/login.html');
    }
    }
    catch (err) {
        console.error("Error login:", err);
        return res.redirect('/Login/login.html');
    }
})


app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('login.html');
})


app.post('/addBook', async (req, res) => {
    try {

        let generatedBookID = "B" + Math.floor(10000 + Math.random() * 90000);

        let sql = `CREATE TABLE IF NOT EXISTS Book (
            Book_ID VARCHAR(10) NOT NULL,
            Book_Price DECIMAL(10,2),
            Book_Name VARCHAR(100),
            Book_Img VARCHAR(100),
            Book_Detail VARCHAR(1000),
            Book_Tag VARCHAR(100),
            Seller_ID VARCHAR(15) NOT NULL,
            PRIMARY KEY (Book_ID),
            FOREIGN KEY (Seller_ID) REFERENCES Seller(Seller_ID) ON DELETE CASCADE
        )`;
        await queryDB(sql);


        sql = `INSERT INTO Book (
            Book_ID, 
            Book_Price, 
            Book_Name, 
            Book_Img, 
            Book_Detail, 
            Book_Tag, 
            Seller_ID
        ) VALUES (
            "${generatedBookID}", 
            ${req.body.price}, 
            "${req.body.name}", 
            "${req.body.img}",
            "${req.body.detail}",
            "${req.body.tag}",
            "${req.body.seller_id}" 
        )`;
        
        let result = await queryDB(sql);
        res.send({ message: "done", bookID: generatedBookID });

    } catch (error) {
        console.error("fail:", error);
        res.status(500).send("fail Seller_ID not found");
    }
});





















 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/Login/login.html`);
        
});





