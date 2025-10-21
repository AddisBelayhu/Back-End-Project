const express = require("express")
//call the package 
const bcrypt = require("bcrypt")
const { errors } = require("web3")
const db = require("better-sqlite3")("ourApp.db")
//to increase the database performance do the next one
db.pragma("journal_mode = WAL") 
 // database setup starts here
 const createTables = db.transaction(() => {
    db.prepare(
        `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username STRING NOT NULL UNIQUE,
            password STRING NOT NULL
        )
        `
    ).run()
 })

 createTables()
 // database setup ennds heare
const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false}))
app.use(express.static("public"))

//this is middleware
app.use(function (req, res, next) {
    res.locals.errors = []
    next()
})

app.get("/", (req, res) => {
   // res.send("LalNova Technologies PLC")
    res.render("homepage")
   
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", (req, res) => {
    //console.log(req.body)
    const errors = []

    if(typeof req.body.username !== "string") req.body.username = ""
    if(typeof req.body.password !== "string") req.body.password = ""


    req.body.username = req.body.username.trim()

if (!req.body.username) errors.push("You must provide a username")
if (req.body.username && req.body.username.length < 3) errors.push("Username must be at least 3 characters.")
if (req.body.username && req.body.username.length > 10) errors.push("Username cannot exceed 10 characters.")
if (req.body.username && !req.body.username.match(/^[a-zA-Z0-9]+$/))errors.push("Username can only contain letters and numbers")

if (!req.body.password) errors.push("You must provide a Password")
if (req.body.password && req.body.password.length < 8) errors.push("Password must be at least 8 characters.")
if (req.body.password && req.body.password.length > 12) errors.push("Password cannot exceed 12 characters.")


if (errors.length){
    return res.render("homepage", { errors })
} 
    
// save the new user into a database
// to make the password encrypted make shure to install// npm install bcrypt
const salt = bcrypt.genSaltSync(10)
req.body.password = bcrypt.hashSync(req.body.password, salt)
// install a databse called sqllite3, npm install better-sqlite3
const ourStatement = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)")
ourStatement.run(req.body.username, req.body.password)

// log the user in by giving them a cookie
res.cookie("ourSimpleApp", "supertopsecretvalue", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24
})

res.send("Thank You")
})

app.listen(3000)

