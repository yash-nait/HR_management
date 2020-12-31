const mongoose = require("mongoose");
const _ = require("lodash");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
var encrypt = require('mongoose-encryption');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

let isLoggedIn = {
  id: null,
  check: false
}
//////////////////DataBase Related Work////////////////////////////////////
mongoose.connect("mongodb://localhost:27017/hrDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const employeeSchema = {
  name: String,
  emp_id: String,
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

const leaveSchema = {
  emp_id: String,
  description: String,
  start_date: String,
  end_date: String,
  email: String
}
const Leave = mongoose.model("Leave", leaveSchema);

const loanSchema = {
  emp_id: String,
  description: String,
  amount: String,
  email: String
}
const Loan = mongoose.model("Loan", loanSchema);

const otherSchema = {
  emp_id: String,
  description: String,
  subject: String,
  email: String
}
const Others = mongoose.model("Others", otherSchema)

var adminSchema = new mongoose.Schema({
  name: String,
  id: String,
  password: String

});

const secret = "asdfghjkljijkkalskals"

adminSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"]
})

const Admin = mongoose.model("Admin", adminSchema)

////////////////////////Database Ends//////////////////////////////

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
///////////////// GET Req ////////////////////////
app.get("/", function(req, res) {
  res.render("index");
});
app.get("/team", function(req, res) {
  Employee.find({}, function(err, found) {
    if (!err) {
      res.render("team", {
        obj: found
      });
    } else res.render("result2", {
      r: "Failure"
    })
  })

});
app.get("/empquery", function(req, res) {
  res.render("emp_query");
});
app.get("/signin", function(req, res) {
  console.log(isLoggedIn);
  if (isLoggedIn.check === true) {
    Admin.findOne({
      id: isLoggedIn.id
    }, function(err, found) {
      if (!err) {
        res.render("profile", {
          found
        })
      } else {
        res.render("result2", {
          r: "Failure"
        })
      }
    })
  } else {
    res.render("sign_in", {
      auth: true
    });
  }
});
app.get("/reg", function(req, res) {
  res.render("register");
});

app.get("/emp_prf/:emp_id", function(req, res) {
  const id = req.params.emp_id;

  Employee.findOne({
    emp_id: id
  }, function(err, found) {

    if (err) {
      console.log("Not found");
    } else {
      res.render("emp_prf", {
        obj: found
      });
    }
  })
});
app.get("/leave", function(req, res) {

  if (isLoggedIn.check === true) {
    Leave.find({}, function(err, found) {
      if (!err) res.render("leave", {
        obj: found
      })
      else res.render("result", {
        r: "Failure"
      })
    })
  } else {
    res.render("sign_in", {
      auth: true
    });
  }
})
app.get("/loan", function(req, res) {
  if (isLoggedIn.check === true) {
    Loan.find({}, function(err, found) {
      if (!err) res.render("loan", {
        obj: found
      })
      else res.render("result", {
        r: "Failure"
      })
    })
  } else {
    res.render("sign_in", {
      auth: true
    });
  }
})
app.get("/others", function(req, res) {
  if (isLoggedIn.check === true) {
    Others.find({}, function(err, found) {
      if (!err) res.render("others", {
        obj: found
      })
      else res.render("result", {
        r: "Failure"
      })
    })
  } else {
    res.render("sign_in", {
      auth: true
    });
  }
})
app.get("/delete/leave/:x", function(req, res) {
  let emp_id = req.params.x;
  Leave.deleteOne({
    emp_id: emp_id
  }, function(err) {
    if (err) {
      res.render("result", {
        r: "Failure"
      })
    } else {
      Leave.find({}, function(err, found) {
        if (!err) res.render("leave", {
          obj: found
        })
        else res.render("result", {
          r: "Failure"
        })
      })
    }
  })
})
app.get("/delete/loan/:x", function(req, res) {
  let emp_id = req.params.x;
  Loan.deleteOne({
    emp_id: emp_id
  }, function(err) {
    if (err) {
      res.render("result", {
        r: "Failure"
      })
    } else {
      Loan.find({}, function(err, found) {
        if (!err) res.render("loan", {
          obj: found
        })
        else res.render("result", {
          r: "Failure"
        })
      })
    }
  })
})
app.get("/delete/others/:x", function(req, res) {
  let emp_id = req.params.x;
  Others.deleteOne({
    emp_id: emp_id
  }, function(err) {
    if (err) {
      res.render("result", {
        r: "Failure"
      })
    } else {
      Others.find({}, function(err, found) {
        if (!err) res.render("others", {
          obj: found
        })
        else res.render("result", {
          r: "Failure"
        })
      })
    }
  })
})

app.get("/register", function(req, res) {
  res.render("register")
})

app.get("/logout", function(req, res) {
  isLoggedIn.check = false
  res.render("index")
})


////////////////////////POST REQ///////////////////////////////
app.post("/profile/del", function(req, res) {
  Employee.deleteOne(req.body, function(err) {
    if (!err) {
      res.render("result", {
        r: "SUCCSES"
      });
    } else {
      res.render("result", {
        r: "FAILURE"
      });
    }
  })
});
app.post("/empquery/leave", function(req, res) {
  const newLeave = new Leave(req.body)
  newLeave.save(function(err) {
    if (!err) res.render("result2", {
      r: "Success"
    })
    else res.render("result2", {
      r: "Failed"
    })
  })

})
app.post("/empquery/loan", function(req, res) {
  const newLoan = new Loan(req.body)
  newLoan.save(function(err) {
    if (!err) res.render("result2", {
      r: "Success"
    })
    else res.render("result2", {
      r: "Failed"
    })
  })

})
app.post("/empquery/others", function(req, res) {
  const newOthers = new Others(req.body)
  newOthers.save(function(err) {
    if (!err) res.render("result2", {
      r: "Success"
    })
    else res.render("result2", {
      r: "Failed"
    })
  })

})

app.post("/admin/sign_in", function(req, res) {
  console.log(req.body);
  Admin.findOne({
    id: req.body.id
  }, function(err, found) {

    if (!err) {
      if (found == null) {
        res.render("sign_in", {
          auth: false
        })
      } else {
        if (found.password === req.body.password) {
          isLoggedIn.check = true;
          isLoggedIn.id = req.body.id;

          res.render("profile", {
            found
          })
        } else {
          res.render("sign_in", {
            auth: false
          })
        }
      }
    } else {
      console.log("No match found");
    }
  })

})
app.post("/admin/register", function(req, res) {
  const newAdmin = new Admin(req.body)
  newAdmin.save()
  res.render("sign_in", {
    auth: true
  })
})

///////////////////// Route req ////////////////////
app.route('/profile')
  .get(function(req, res) {
    if (isLoggedIn.check === true) {
      Admin.findOne({
        id: isLoggedIn.id
      }, function(err, found) {
        res.render("profile", {
          found
        });
      });
    } else {
      res.render("sign_in", {
        auth: isLoggedIn.check
      })
    }
  })
  .post(function(req, res) {
    const newEmployee = new Employee({
      name: req.body.emp_name,
      emp_id: req.body.emp_id,
      post: req.body.emp_post,
      phone: req.body.emp_no,
      email: req.body.emp_mail,
      salary: req.body.emp_sal,
      address: req.body.emp_add,
      doj: req.body.emp_doj,
      dob: req.body.emp_dob,
      dept: req.body.emp_dept
    });
    newEmployee.save(function(err) {
      if (!err) {
        res.render("result", {
          r: "SUCCSES"
        });
      } else {
        res.render("result", {
          r: "FAILURE"
        });
      }
    })
  });
