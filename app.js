const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var items = ['Buy Food', 'Eat Food', 'Cook Food'];

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {

    var currentDate = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = currentDate.toLocaleDateString("en-US", options);

    res.render('list', {todayDate: day, newItems: items});
});

app.post("/", (request, response) => {
    var item = request.body.todoInput;

    items.push(item);

    response.redirect("/");
})

app.listen(3000, () => {
    console.log("Server is Running");
});