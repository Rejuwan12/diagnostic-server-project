const express = require("express");
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anrbjpf.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const testCollection = client.db('docHouseDB').collection('tests')
    const userCollection = client.db('docHouseDB').collection('users')
    const reviewCollection = client.db('docHouseDB').collection('reviews')
    const appointCollection = client.db('docHouseDB').collection('appoint')

   
// Test  related  api
app.get('/allTests',  async (req, res) => {
    const result = await testCollection.find().toArray();
    res.send(result);
})

app.post('/allTests', async(req, res) => {
  const cartItem = req.body;
  const result = await testCollection.insertOne(cartItem);
  res.send(result)

})

app.get('/allTests/:id', async(req, res)=> {
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
 const result = await testCollection.findOne(query);
  res.send(result);
})

app.get('/reviews',  async (req, res) => {
    const result = await reviewCollection.find().toArray();
    res.send(result);
})

// carts related

// app.get('/appoints',  async (req, res) => {
//   const email = req.query;
//   const result = await appointCollection.find().toArray();
//   res.send(result);
// })

// app.get('/appoints/all',  async (req, res) => {
//   const email = req.query.email;
//   const query = {email: email}
//   const result = await appointCollection.find(query).toArray();
//   res.send(result);
// })

app.get('/appoints/:email', async (req, res) => {
  const email = req.params.email;
  const query =  {user_email: email}
  const result = await appointCollection.find(query).toArray();
  res.send(result);
})

app.post('/appoints', async(req, res) => {
  const cartItem = req.body
  const result = await appointCollection.insertOne(cartItem);
  res.send(result)
})

app.delete('/appoint/:id', async(req, res)=> {
  const id = req.params.id;
  const query = { _id : new ObjectId(id) };
  const result = await appointCollection.deleteOne(query);
  res.send(result);
})



// users related api
app.get('/users', async (req, res) => {
  const result = await userCollection.find().toArray();
  res.send(result);
})

app.delete('/users/:id', async(req, res)=> {
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await userCollection.deleteOne(query);
  res.send(result);
})


app.post('/users', async(req, res) => {
  const user = req.body;
  const query = {email: user.email};
  const exisTingUser = await userCollection.findOne(query);
  if(exisTingUser){
    return res.send({ message: 'alredy have an account', insertedId: null})
  }
  const result = await userCollection.insertOne(user);
  res.send(result)

})

app.patch('/users/admin/:id', async (req, res) => {
  const id = req.params.id;
  const filter = {_id : new ObjectId(id)};
  const updateDoc = {
    $set:{
      role: 'admin'
    }
  }
  const result = await userCollection.updateOne(filter, updateDoc);
  res.send(result)
})

// email veruified












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('diagnostic center server running')
})

app.listen(port, ()=>{
    console.log(`bistro boss server is runnig on port ${port}`);
})