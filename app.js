const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

const app = express();
const items = ["Buy Food", "Eat Food", "Cook Food"];
const workItems = [];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    let day = date();

    res.render('list', {listTitle: day, newItems: items});
});

app.get("/work", (req, res) => {
    res.render('list', {listTitle: "Work List", newItems:workItems});
})

app.post("/", (request, response) => {
    const item = request.body.todoInput;
    if(request.body.list === "Work"){
        workItems.push(item);
        response.redirect("/work");
    } else {
        items.push(item);
        response.redirect("/");
    }
   
    response.redirect("/");
});

app.post("/work", (req, res) => {
    const item = res.body.todoInput;
    workItems.push(item);
    
    res.redirect("/work");
})

app.listen(3000, () => {
    console.log("Server is Running");
});