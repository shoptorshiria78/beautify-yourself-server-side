const express = require('express');
const cors = require('cors');
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER, process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7bvfsss.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // await client.connect();

    const productCollection = client.db('ProductDB').collection("product");
    const brandCollection = client.db('ProductDB').collection("brand");
    const myCartCollection = client.db('ProductDB').collection("myCart");

    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result)
    })

    app.post('/myCart', async (req, res) => {
      const newProduct = req.body;
      const result = await myCartCollection.insertOne(newProduct);
      res.send(result)
    })
    app.get('/myCart', async (req, res) => {
      const cursor = myCartCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/brand', async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    app.get('/product/:brand', async (req, res) => {
      const brand = req.params.brand;
      const filter = { brand: brand }
      const result = await productCollection.find(filter).toArray();
      res.send(result);

    })

    app.get('/productDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);

    })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
  res.send("server is ready")
})

app.listen(port, () => {
  console.log(`server is running on port:${port}`)
})