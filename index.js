const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-Parser')
require('dotenv').config()

const port = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcoir.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(err => {
  console.log('connection error', err);
  const productCollection = client.db("fooddb").collection("products");
  const productCheckCollection = client.db("fooddb").collection("productCheck");


    app.get('/product',(req,res)=>{
      productCollection.find()
      .toArray((err,items)=>{
        res.send(items)
        //console.log('from database',item)
      })
    })
  

  app.post("/addProduct",(req, res)=>{
    const newProduct =req.body;
    console.log('adding new Product:', newProduct);
    productCollection.insertOne(newProduct)
    .then(result=>{
      console.log('inserted count:', result.insertedCount)
      res.send(result.insertedCount>0);
    })
  })


  app.post('/productCheck',(req,res)=>{
    const checkProduct=req.body;
    productCheckCollection.insertOne(checkProduct)
    .then(result=>{
      res.send(result.insertedCount>0);
    })
    console.log(checkProduct);
  })

  app.get('/checkOut',(req,res)=>{
    productCheckCollection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })



  //client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})