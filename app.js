const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const _ = require("lodash");

//Express
const app = express();

//EJS
app.set('view engine', 'ejs');

//Body-parser
app.use(bodyParser.urlencoded({extended:true}));
//Express
app.use(express.static("public"));

//Mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

//Schema for the list item
const itemsSchema = new mongoose.Schema({
    name: String
});

//Collection/Table for MongoDB
const Item = mongoose.model("Item", itemsSchema);

//Default data for the database
const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItem = [item1, item2, item3];

//Schema for every new page created
const listSchema = {
    name: String,
    items: [itemsSchema]
};

//Collection/table for MongoDB
const List = mongoose.model("List", listSchema);


//Date JS
let day = date();

//Home Route
app.get("/", (req, res) => {
    //Read data from MongoDB using Mongoose
    Item.find({}).then((foundItems) => {
        if(foundItems.length === 0){
            //Insert default item
            Item.insertMany(defaultItem);
            //Redirect page
            res.redirect("/");
        } else{
            //Render page with the data from MongoDB
            res.render('list', {listTitle: day, newItems: foundItems});
        }
    });
});

//Custom Route
app.get("/:customListPage", (req,res) => {
    //Store what user type in the search bar
    const customListPage = _.capitalize(req.params.customListPage);

    //Check for existing data
    List.findOne({name:customListPage}).then((result) =>{
        if (result){
            //Show existing list
            console.log("Already Existed");
            //Render page
            res.render('list', {listTitle: result.name, newItems: result.items});
        } else {
            //Create new list
            const list = new List({
                name: customListPage,
                items: defaultItem
            });
            //Save data into MongoDB
            list.save();
            //Redirect page after saving data into the database
            res.redirect("/" + customListPage);
        }
    });
});

//Handle post request from HTML file
app.post("/", (req, res) => {
    //Store input from HTML textbox input
    const itemName = req.body.todoInput;
    //Store input from HTML buttom
    const listName = req.body.list;
    //Insert input from HTML file into MongoDB
    const newItem = new Item({
        name: itemName
    });

    //Check which collection/table to store data
    if (listName === day){
        //Save data into MongoDB
        newItem.save();
        //Redirect Page
        res.redirect("/");
    } else{
        //Find which collection/table user want to access
        List.findOne({name:listName}).then((foundList) => {
            //Push new data into MongoDB
            foundList.items.push(newItem);
            //Save data into MongoDB
            foundList.save();
            //Redirect Page
            res.redirect("/" + listName);
        });
    }
});

//Handle post request from HTML file
app.post("/delete", (req,res) => {
    //Store data from HTML checkbox input
    const checkItem = req.body.checkbox;
    //Store data from HTML hidden input
    const listName = req.body.listName;

    if(listName === day){
        //Search and delete data based on the HTML checkbox input
        Item.findByIdAndRemove(checkItem).exec().then(() => {
            console.log("Data deleted");
            //Redirect page
            res.redirect("/");
        }).catch((err) => {
            //Show error
            console.log(err);
        });
    } else{
        //Search and delete data based on the HTML checkbox input and hidden input
        List.findOneAndUpdate({
            //Condition
            name: listName
        }, {
            $pull: {
                //Value
                items: {
                    _id: checkItem
                }
            }
        }).exec().then((foundList) => {
            //Redirect page
            res.redirect("/" + listName);
        }).catch((err) => {
            //Show error
            console.log(err);
        })
    }
    
});

//Start express server
app.listen(3000, () => {
    console.log("Server is Running");
});