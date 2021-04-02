const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const bodyParser = require("body-parser");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mr00a.mongodb.net/groceries?retryWrites=true&w=majority`;
const uri1 = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mr00a.mongodb.net/placeOrder?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const client1 = new MongoClient(uri1, {
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

  app.post("/addproduct", (req, res) => {
    console.log(req.body);
    productsCollection.insertOne(req.body).then((result) => {
      console.log(result);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    productsCollection
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        console.log(result);
      });
  });

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

client1.connect((err) => {
  const orderCollection = client1.db("placeOrder").collection("orders");
  console.log("second database connected successfully");
  app.post("/placeorder", (req, res) => {
    const product = req.body;
    console.log(product);
    orderCollection.insertOne(product).then((result) => {
      console.log(result);
      res.send(result.insertedCount);
    });
  });

  app.get("/orders", (req, res) => {
    console.log(req.query.email);
    orderCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
});

// that thing is for checking
app.get("/", (req, res) => {
  res.send("SO Now Let's begin the main thing that you wanna do");
});

app.listen(process.env.PORT || 5000);
