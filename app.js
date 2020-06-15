/* app dependency packages*/

const express = require("express");
const bodyParser = require("body-parser");
const dayjs = require("dayjs");
const mongoose = require("mongoose");

/* initializing the express app, set the view engine and point 
to static files in public */

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/Todo", {useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema ={
  name:String
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "GYM"
});

const item2 = new Item({
  name: "Play Games"
});

const item3 = new Item({
  name: "Buy Food"
});

const defaultItem = [ item1,item2,item3];

/* app looks at the root directory, uses dayjs to format date and renders using ejs
also storing default items to db */

app.get("/", (req, res) => {
  const day = dayjs().format("MMMM D, YYYY");
  const copyrightDate = dayjs().format("YYYY");

  Item.find({},(err, defaultItems)=>{
    if(defaultItems.length === 0){
      Item.insertMany(defaultItem,(err)=>{
        if(err){
          console.log(err)
        }else{
          console.log("successfully saved default items to DB")
        }
      });
      res.redirect("/")
    }else{
    res.render("todo", { date: day, newlist: defaultItems, year: copyrightDate });
    }
  });
});

/*Add and delete items from DB, using body parser
to grab user inputs from views form*/
app.post("/", (req, res) => {
  const item = req.body.newItem;
  const addItem = new Item({
     name: item
  });
 addItem.save();
 console.log("items added succesfully");
 res.redirect("/");
});

app.post("/delete", (req, res)=>{
  const deleteItem = req.body.checkbox
  Item.findByIdAndRemove(deleteItem,(err)=>{
    if(!err){
      console.log('items deleted successfully');
      res.redirect("/");
    }
  });
});

/* express server starts and listens on this port */
app.listen(3000, () => console.log("Server started on port 3000."));
