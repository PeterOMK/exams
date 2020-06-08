const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const session = require("express-session");
const cookieParser = require("cookie-parser");

//Mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/company", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

//Declaring Schema
var materialschema = mongoose.Schema({
  code: {
    type: String,
  },
  name: {
    type: String,
  },
  unitPrice: {
    type: Number,
  },
  stockLevel: {
    type: Number,
  },
});

//Model for the material database
var material = mongoose.model("customer", materialschema);

//Post For Creating
app.post("/material/add", (req, res) => {
  var newmaterial = new material({
    code: req.body.code,
    name: req.body.name,
    unitPrice: req.body.unitPrice,
    stockLevel: req.body.stockLevel,
  });
  newmaterial.save();
});

//Deleting
app.delete("/material/delete", (req, res) => {
  material.findByIdAndRemove(
    {
      _id: req.params.id,
    },
    (err, done) => {
      if (err) {
        res.json(err);
      } else {
        console.log("done");
      }
    }
  );
});

//Update
app.put('/words/:id', function(req, res) {
    const doc = {
      code: req.body.code,
      name: req.body.name,
      unitPrice: req.body.unitPrice,
      stockLevel: req.body.stockLevel,
    });
    material.update({}, doc, function(err, raw) {
      if (err) {
        res.send(err);
      }
      res.send(raw);
    });
  });

app.listen(port, () => {});
