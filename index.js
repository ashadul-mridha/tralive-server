const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()

//middleware
app.use(cors())
app.use( express.json())

const port = process.env.PORT || 5000

//mongodb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.riphr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

    try{
        await client.connect();
        const database = client.db('tralive');
        const UsersCollection = database.collection('users');
        const eventCollection = database.collection('events');
        const orderCollection = database.collection('orders');
        
        //get all users
        app.get('/users' , async (req , res) => {
            const result = await UsersCollection.find({}).toArray();
            console.log(result);
            res.send(result);
        })

        //insert new event
        app.post('/add-event' , async (req , res) => {
            const data = req.body;
            const result = await eventCollection.insertOne(data);
            res.send(result.acknowledged);
            console.log('Data Added',result);
        })

        //get all event
        app.get('/events', async (req , res) => {
            const events = await eventCollection.find({}).toArray();
            res.send(events);
        })

        //get single event
        app.get('/event/:id' , async (req , res) => {
            const id = req.params.id;
            const  query = {_id: ObjectId(id)};
            const result = await eventCollection.findOne( query ); 
            res.send(result);

            console.log('hitted single event',result);
        })

        //post order data

        app.post('/checkout' , async ( req , res) => {
            const data = req.body;
            const result = await orderCollection.insertOne(data);
            res.send(result.acknowledged);
            console.log('order Added',result);
        })


    }
    finally{

    }
}

run().catch( console.dir )

app.get('/', (req , res) => {
    res.send('Data Home Show Successfully');
})

app.listen( port , (req , res) => {
    console.log('Hey Ashadul In Sha Allah One Day You Will Be Success Man');
})