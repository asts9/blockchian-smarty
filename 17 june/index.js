// const mysql = require("mysql2")
// const faker = require("@faker-js/faker")

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'delta',
//   password: "nkitpraj.2003"
// });



// let  getRandomUser=()=>{
//   return [

// faker.class.class(),
// faker.email.email(),
// faker.pass.password(),

// faker.internet.userName(),
//  faker.person.jobTitle(),
// faker.person.fullName(),
//  faker.animal.bear(),
// ];};
// const sql = "INSERT INTO tanya (id, username, email, pass) VALUES ? ";
// let data = [];
// for (i = 1;i<=100;i++){
//   data.push(getRandomUser());
// }
// // let users =
// //   [[122, "2_name", "1234@email", 212],
// //   [125, "3_name", "123fa@email", 12122],
// //   [126, "4_name", "123asas@email", 12212]];
// try {
//   connection.query(sql, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result)
//     console.log(result.length)
//   })
// } catch (error) {
//   console.log(err)
// }
// connection.end();
const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");
const express = require('express');
const app = express();


const port = 4444;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password: "nkitpraj.2003"
});

// Refactored to match exactly: [id, username, email, pass]
let getRandomUser = (userId) => {
  return [
    faker.internet.userId(),                   // id (passing the loop index)
    faker.internet.username(), // username
    faker.internet.email(),    // email
    faker.internet.password()  // pass
  ];
};

// const sql = "INSERT INTO tanya (id, username, email, pass) VALUES ? ";
// let data = [];

// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser(i));
// }

// // Bulk insert 100 users on startup
// connection.query(sql, [data], (err, result) => {
//   if (err) {
//     console.error("Database Error:", err);
//   } else {
//     console.log("Success! Rows inserted:", result.affectedRows);
//   }
// });

// Routes
app.get('/', (req, res) => {
  // res.send("welcome home my brother");

  let q = "select count(*) from tanya";

connection.query(q, (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).send("the connection with db was intruptd");
    }
    
    console.log(result);
    res.send(result); 
});
});
// FIXED: Removed the quotes around port so it passes the number 4444
app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});