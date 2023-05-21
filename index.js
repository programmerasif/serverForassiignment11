const express = require('express');
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// midelwere
app.use(cors());
app.use(express.json())


console.log(process.env.DB_pass);

// const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.0rmdzda.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb://${process.env.DB_user}:${process.env.DB_pass}@ac-wotlaa2-shard-00-00.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-01.0rmdzda.mongodb.net:27017,ac-wotlaa2-shard-00-02.0rmdzda.mongodb.net:27017/?ssl=true&replicaSet=atlas-as340s-shard-0&authSource=admin&retryWrites=true&w=majority`;
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
        const AllCarsCollection = client.db('allCars').collection('totalCar')
        const forHomrCarsCollection = client.db('AllcarForHome').collection('home')
        const topRaitedCollection = client.db('toSelling').collection('top')
    

        // const indeing = {name: 1}
        // const option = {string: "text"}
        // const result  = await AllCarsCollection.createIndex(indeing,option)
        app.get("/toySearcing/:text", async (req, res) => {
            const searchText = req.params.text;
    
            const result = await AllCarsCollection.find({
                  $or: [{ name: { $regex: searchText, $options: "i"}}]
            })
            .toArray();
    
            res.send(result)
        })
       


        // All cars
        app.get('/allCar', async (req, res) => {
            const cursor = AllCarsCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        app.post('/allCars', async (req, res) => {
            const newCar = req.body;
            
            const result = await AllCarsCollection.insertOne(newCar)
            res.send(result)

        })
        app.get('/allCars/:id', async(req,res) =>{
            const id = req.params.id
            const query = { _id : new ObjectId(id)}
            const result = await AllCarsCollection.findOne(query)
            console.log(result);
            res.send(result)
        })
        app.patch('/allCars/:id', async(req,res) =>{
            const id = req.params.id;
            const filter = {_id :new ObjectId(id)};
            const updated = req.body;
            const updateDoc = {
                $set: {
                    price:updated.price,
                    availableQuantity:updated.Quantity,
                    description:updated.description
                }
            }
            const result = await AllCarsCollection.updateOne(filter,updateDoc)
            res.send(result)
        })
        app.delete('/allCars/:id', async(req,res) =>{
            const id = req.params.id;
            const quary = {_id :new ObjectId(id)};
            const result = await AllCarsCollection.deleteOne(quary)
            res.send(result)
        })


        app.get('/allCars', async(req,res) =>{
            
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email}
            }
            const result = await AllCarsCollection.find(query).toArray()
            res.send(result)
        })

        // for home page 
        
        // private 
        app.get('/private', async(req,res) =>{
           const quary = {type:'private'}
           const result = await forHomrCarsCollection.find(quary).toArray();
           res.send(result)
        }) 
        // Bus 
        app.get('/bus', async(req,res) =>{
           const quary = {type:'Bus'}
           const result = await forHomrCarsCollection.find(quary).toArray();
           res.send(result)
        })
        // sports 
        app.get('/sports', async(req,res) =>{
           const quary = {type:'sports'}
           const result = await forHomrCarsCollection.find(quary).toArray();
           res.send(result)
        })

        // view detils for home car 

        app.get('/allcarForhome/:id', async(req,res) =>{
            const id = req.params.id
            const query = { _id : new ObjectId(id)}
            const result = await forHomrCarsCollection.findOne(query)
            console.log(result);
            res.send(result)
        })

        // toprated product 

        app.get('/topRated', async (req, res) => {
            const result = await topRaitedCollection.find().toArray()
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('toy cars shop is open')
})

app.listen(port, () => {
    console.log(`toy car is running on ${port}`);
})