const express = require("express")
const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false}))
app.use(express.static("public"))


app.get("/", (req, res) => {
   // res.send("LalNova Technologies PLC")
    res.render("homepage")
   
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", (req, res) => {
    console.log(req.body)
    res.send("Thank you for filling out the form.")
})

app.listen(3000)

