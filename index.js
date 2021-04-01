const express = require("express");
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mr00a.mongodb.net/groceries?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("groceries").collection("products");
  console.log("database connected successfully");

  // app.post("/addProducts", (req, res) => {
  //   console.log(req.body);
  //   const products = req.body;
  //   productsCollection.insertMany(products).then((result) => {
  //     console.log(result);
  //     res.send({ count: result.insertedCount });
  //   });
  // });

  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/checkout/:_id", (req, res) => {
    productsCollection
      .find({ _id: ObjectID(req.params._id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });
});

// that thing is for checking
app.get("/", (req, res) => {
  res.send("SO Now Let's begin the main thing that you wanna do");
});

app.listen(process.env.PORT || 5000);
