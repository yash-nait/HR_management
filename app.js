const mongoose = require("mongoose");
const _ = require("lodash");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const employeeSchema = {
  name: String,
  emp_id:String,
  post: String,
  phone: String,
  email: String,
  salary: String,
  address: String,
  doj: String,
  dob: String

};

const Employee = mongoose.model("Employee", employeeSchema);

const newEmployee = new Employee({
  name: 'Shivam',
  emp_id:'1234',
  post: 'Admin',
  phone: '123455',
  email: 'abc@xyz.com',
  salary: '10',
  address:'Janakpuri',
  doj:'11/08/2000',
  dob:'11/08/1990'
});

newEmployee.save();

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
  app.get("/signin",function(req,res){
    res.render("sign_in");
  });
  app.get("/reg",function(req,res){
    res.render("register");
  });
  
  app.get("/emp_prf/:emp_id",function(req,res){
    const id = req.params.emp_id;

    Employee.findOne({emp_id: id }, function (err,obj) {
      
      if(err) {
        console.log("Not found");
      }
      else {        
        res.render("emp_prf",{obj});
      }
    })
  });


