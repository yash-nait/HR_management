const mongoose = require("mongoose");
const _ = require("lodash");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/hrDB", {
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
  dob: String,
  dept: String
};

const Employee = mongoose.model("Employee", employeeSchema);

// const newEmployee = new Employee({
//   name: 'Shivam',
//   emp_id:'1234',
//   post: 'Admin',
//   phone: '123455',
//   email: 'abc@xyz.com',
//   salary: '10',
//   address:'Janakpuri',
//   doj:'11/08/2000',
//   dob:'11/08/1990'
// });


app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});
  ///////////////// GET Req ////////////////////////
  app.get("/", function (req, res) {
    res.render("index");
  });
  app.get("/team", function (req, res) {
    res.render("team");
  });
  app.get("/empquery",function(req,res){
    res.render("emp_query");
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
  app.post("/profile/del",function(req,res){
    Employee.deleteOne(req.body,function(err){
      if(!err){
        res.render("result",{r:"SUCCSES"});
      }else{
        res.render("result",{r:"FAILURE"});
      }
    })
  })
///////////////////// Route req ////////////////////
  app.route('/profile')
    .get(function(req,res){
      res.render("profile");
    })
    .post(function(req,res){
      console.log(req);
      const newEmployee = new Employee({
        name: req.body.emp_name,
        emp_id:req.body.emp_id,
        post: req.body.emp_post,
        phone: req.body.emp_no,
        email: req.body.emp_email,
        salary: req.body.emp_sal,
        address:req.body.emp_add,
        doj:req.body.emp_doj,
        dob:req.body.emp_dob,
        dept:req.body.emp_dept
      });
      newEmployee.save(function(err){
        if(!err){
          res.render("result",{r:"SUCCSES"});
        }else{
          res.render("result",{r:"FAILURE"});
        }
      })
    });
