const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const ObjectID = require('mongodb').ObjectId
const port = 5050;
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@1stcluster0.xmai6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    //book collection
    const booksCollection = client
      .db(process.env.DB_NAME)
      .collection(process.env.DB_BOOK_COLLECTION);
    //orders collection
    const ordersCollection = client
      .db(process.env.DB_NAME)
      .collection(process.env.DB_ORDERS_COLLECTION);
    //add new products
    app.post("/addProduct", (req, res) => {
      const product = req.body;
      console.log(res, "1st response");
      booksCollection.insertOne(product).then((res) => {
        console.log(res, "1st response");
      });
    });
    //add orders
    app.post("/addOrders", (req, res) => {
      const order = req.body;
      console.log(res, "1st response");
      ordersCollection.insertOne(order).then((res) => {
        console.log(res, "1st response");
      });
    });

    app.get('/allProducts', (req, res) => {
      booksCollection.find( {} )
      .toArray((err, docs) => {
        res.send(docs)
      })
    })

    //get all the products for
    app.get('/orderdProducts', (req, res) => {
      console.log(req.query.email)
      ordersCollection.find( {email: req.query.email} )
      .toArray((err, docs) => {
        res.send(docs)
      })
    })

    //get all the products added by the admin
    app.get('/userProducts', (req, res) => {
      console.log(req.query.email)
      booksCollection.find( {admin: req.query.email} )
      .toArray((err, docs) => {
        res.send(docs)
      })
    })

    //delete product
    app.delete('/delete/:id', (req, res) => {
      console.log(req.params.id)
      booksCollection.deleteOne(
        { _id : ObjectID(req.params.id) } // specifies the document to delete
    ).then(res => console.log(res.deletedCount,))
    })

    //deleteOrder
    app.delete('/deleteOrder/:id', (req, res) => {
      console.log(req.params.id)
      ordersCollection.deleteOne(
        { _id : ObjectID(req.params.id) } // specifies the document to delete
    ).then(res => console.log(res.deletedCount,))
    })
  }

  // perform actions on the collection object
  //   client.close();
});

app.get("/", (req, res) => {
  res.send("this is from server");
});

app.listen(process.env.PORT || port);
