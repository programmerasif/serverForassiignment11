const express = require('express');
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// midelwere
app.use(cors());
app.use(express())


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
        await client.connect();
        const AllCarsCollection = client.db('allCars').collection('totalCar')
        const sportsCarsCollection = client.db('sportsToy').collection('sports')
        const busCarsCollection = client.db('busToy').collection('cars')
        const privateCarsCollection = client.db('privateToy').collection('privateCar')

        // All cars
        app.get('/allCars', async (req, res) => {
            const cursor = AllCarsCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })


        // sports cars
        app.get('/sportsCar', async (req, res) => {
            const cursor = sportsCarsCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        // bus car 
        app.get('/busCar', async (req, res) => {
            const cursor = busCarsCollection.find()
            const result = await cursor.toArray()
            console.log(result);
            res.send(result)
        })
        // private cars 
        app.get('/privateCar', async (req, res) => {
            const cursor = privateCarsCollection.find()
            const result = await cursor.toArray()
            console.log(result);
            res.send(result)
        })
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
    res.send('toy cars shop is open')
})

app.listen(port, () => {
    console.log(`toy car is running on ${port}`);
})