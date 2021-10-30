const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
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
        const Userscollection = database.collection('users');
        const eventcollection = database.collection('events');
        
        //get all users
        app.get('/users' , async (req , res) => {
            const result = await Userscollection.find({}).toArray();
            console.log(result);
            res.send(result);
        })

        //insert new event
        app.post('/add-event' , async (req , res) => {
            const data = req.body;
            const result = await eventcollection.insertOne(data);
            res.send(result.acknowledged);
            console.log('Data Added',result);
        })

        //get all event
        app.get('/events', async (req , res) => {
            const events = await eventcollection.find({}).toArray();
            res.send(events);
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