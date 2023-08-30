const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = ["Buy Food", "Eat Food", "Cook Food"];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {

    let currentDate = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    let day = currentDate.toLocaleDateString("en-US", options);

    res.render('list', {todayDate: day, newItems: items});
});

app.post("/", (request, response) => {
    let item = request.body.todoInput;
    items.push(item);

    response.redirect("/");
});

app.listen(3000, () => {
    console.log("Server is Running");
});