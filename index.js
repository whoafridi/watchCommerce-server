const express = require("express");
const CORS = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
app.use(CORS());
app.use(express.json());

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j9yy4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();

    const database = client.db('watch_store');
    const productCollection = database.collection('products');
    //const bookCollection = database.collection('booked');

    // get all services
    app.get("/products", async (req,res)=>{
      const cursor = productCollection.find({});
      const service = await cursor.toArray();
      res.send(service);
    });

    // GET Single Service
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await productCollection.findOne(query);
      res.json(service);
    });
    
    // POST API
    app.post('/products', async (req, res) => {
      const service = req.body;
      const result = await productCollection.insertOne(service);
      res.json(result);
    });

  //    // get API for booking var query = { address: /^S/ }
  //    app.get('/booked', async (req, res) => {
  //     let query = {email : /\S+@\S+\.\S+/}
  //     const cursor = bookCollection.find(query);
  //     const service = await cursor.toArray();
  //     res.send(service);
  //   });

  //   // POST API for booking added
  //   app.post('/booked', async (req, res) => {
  //     const booked = req.body;
  //     const result = await bookCollection.insertOne(booked);
  //     res.json(result);
  //   });

   
  // // DELETE API for a booking
  // app.delete('/booked/:id', async (req, res) => {
  //     const id = req.params.id;
  //     const query = { _id: ObjectId(id) };
  //     const result = await bookCollection.deleteOne(query);
  //     res.json(result);
  // })

  }
  finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running  Server');
});

app.listen(port,()=>{console.log("listing from port", port)})

