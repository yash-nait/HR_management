const mongoose = require("mongoose");
const _ = require("lodash");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// mongoose.connect('mongodb://localhost/employee', {useNewUrlParser: true, useUnifiedTopology: true});
//
// const employeeSchema = new mongoose.Schema({
//   name: String,
//   post: String,
//   contact: String,
//   email: String
// })
//
// const Employee = mongoose.model("Employee", employeeSchema);
//
// const newEmployee = new Employee({
//   name: 'Shivam',
//   post: 'Admin',
//   contact: '123455',
//   email: 'abc@xyz.com'
// });
//
// newEmployee.save();

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
  });
  app.get("/", function (req, res) {
    res.render("index");
  });
  app.get("/team", function (req, res) {
    res.render("team");
  });
  app.get("/empquery",function(req,res){
    res.render("emp_query");
  });
  app.get("/profile",function(req,res){
    res.render("profile");
  });
  app.get("/signup",function(req,res){
    res.render("sign_up");
  });
  app.get("/reg",function(req,res){
    res.render("register");
  });
// mongoose.connection.close();
