const express = require("express");
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware

app.use(cors())
app.use(express.json())




// const uri = `mongodb+srv://docHouseDB:2tSKr6pIdp2XtyWs@cluster0.anrbjpf.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-n1ztrwr-shard-00-00.anrbjpf.mongodb.net:27017,ac-n1ztrwr-shard-00-01.anrbjpf.mongodb.net:27017,ac-n1ztrwr-shard-00-02.anrbjpf.mongodb.net:27017/?ssl=true&replicaSet=atlas-nslw29-shard-0&authSource=admin&retryWrites=true&w=majority`;
console.log(process.env.DB_USER, process.env.DB_PASS);


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
    // await client.connect();

    const testCollection = client.db('docHouseDB').collection('tests')
    const userCollection = client.db('docHouseDB').collection('users')
    const serviceCollection = client.db('docHouseDB').collection('services')
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

});

app.put('/allTests/:id', async (req, res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const updatedTest = req.body;
  const updateDoc = {
    $set:{
      name: updatedTest.name,
      title_name: updatedTest.title_name,
      posting_time: updatedTest.posting_time,
      deadline: updatedTest.deadline,
      price: updatedTest.price,
      slot_number: updatedTest.slot_number,
      img_url: updatedTest.img_url,
      description: updatedTest.description,
    }
  }
  const result = await testCollection.updateOne(query, updateDoc);
  res.send(result)
})

app.delete('/allTests/:id', async(req, res)=> {
  const id = req.params.id;
  const query = { _id : new ObjectId(id) };
  const result = await testCollection.deleteOne(query);
  res.send(result);
})

app.get('/allTests/:id', async(req, res)=> {
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
 const result = await testCollection.findOne(query);
  res.send(result);
})
// Services  related  api
app.get('/service',  async (req, res) => {
    const result = await serviceCollection.find().toArray();
    res.send(result);
})

app.post('/service', async(req, res) => {
  const cartItem = req.body;
  const result = await serviceCollection.insertOne(cartItem);
  res.send(result)

})

app.get('/service/:id', async(req, res)=> {
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
 const result = await serviceCollection.findOne(query);
  res.send(result);
})

app.get('/reviews',  async (req, res) => {
    const result = await reviewCollection.find().toArray();
    res.send(result);
})


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
  const {email} = req.query
  let query = {};
  if(email){
    query= {email: email}
  }
  const result = await userCollection.find(query).toArray();
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

app.patch('/users/:email', async (req, res)=>{
  const email = req.params.email;
  const query = { email : email};
  const updatedUser = req.body;
  // const find = await userCollection.findOne(query)
  // console.log(find, email);
  const updateDoc = {
    $set:{
      name: updatedUser.name,
      email: updatedUser.email,
      photoURL: updatedUser.photoURL,
      upazila: updatedUser.upazila,
      districts: updatedUser.districts,
      blood_group: updatedUser.blood_group,
      password: updatedUser.password,
    }
  }
  const result = await userCollection.updateOne(query, updateDoc);
  res.send(result)
  
}

)
app.get('/singleUser/:email', async (req, res)=>{
  const email = req.params.email;
  const query = { email : email};
  const find = await userCollection.findOne(query)
  console.log(find, email);
  res.send(find)
  
}

)

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
    console.log(`diagnostic server is runnig on port ${port}`);
})