const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");
const express = require("express");
const path = require("path");
const methodOverride =require("method-override")

const app = express();
const port = 4444;

//MARK: EJS Setup Configuration
app.set(methodOverride,("_method"));
app.use(express.urlencoded({extended :true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // FIXED: Changed app.use to app.set

//MARK: Database Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "delta",
    password: "nkitpraj.2003",
});

//MARK: Helper for generating users
let getRandomUser = () => {
    return [
        faker.internet.userId(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

//MARK: Routes
app.get("/", (req, res) => {
    let q = "SELECT COUNT(*) AS count FROM tanya";
    try {
        connection.query(q, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("The connection with the DB was interrupted");
            }

            console.log(result);

            let count = result[0].count;
            //MARK: Renders views/page.ejs and passes the result object
            res.render("page.ejs", { count });
        });
    } catch (error) {
        return res.status(500).send("The connection with the DB was interrupted");

    }

}); // FIXED: Properly uncommented and closed the route block


app.get('/user',(req,res)=>{
    let q= "select * from tanya";
    try {
        connection.query(q, (err, users) => {
            if (err) {
                console.error(err);
                return res.status(500).send("The connection with the DB was interrupted");
            }
            
             res.render("whole.ejs", { users });
        });
    } catch (error) {
        return res.status(500).send("The connection with the DB was interrupted");

    }

}); // FIXED: Properly uncommented and closed the route block

app.get("/user/:ID/edit",(req,res)=>{
    let {ID}=req.params;
    let q =`select * from tanya where ID='${ID}'`

   try {
        connection.query(q, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("The connection with the DB was interrupted");
            }
            let user=result[0]
            
             res.render("edit.ejs",{user});
        });
    } catch (error) {
        return res.status(500).send("The connection with the DB was interrupted");

    }
})
app.patch("/user/:id", (req, res) => {
    let { ID } = req.params;
    let { username, password } = req.body; // Extracted from form 'name' attributes
    
    // SQL Query updating both fields based on the ID
    let q = `UPDATE tanya SET username = ?, password = ? WHERE ID = ?`;

    connection.query(q, [username, password, ID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("The connection with the DB was interrupted");
        }
        
        // After successfully updating, redirect back to the user list
        res.redirect("/user");
    });
});

//MARK: Start Server
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});