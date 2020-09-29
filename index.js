const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const password = '5DHAQO5tUozcs9j4';

const uri = "mongodb+srv://taskUser:5DHAQO5tUozcs9j4@cluster0.cskwv.mongodb.net/tasksdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
    const tasksCollection = client.db("tasksdb").collection("tasks");

    // insert database form backend or index.js
    // const task = { name: 'study', location: 'college', timeofTask: '12' }
    // tasksCollection.insertOne(task)
    //     .then(resutlt => {
    //         console.log('one task inserted');
    //     })

    // insert data from frontend ui or site database
    app.post('/addTasks', (req, res) => {
        const task = req.body;
        tasksCollection.insertOne(task)
            .then(resutlt => {
                res.redirect('/')
            })
    });


    // to read or find database to website ui from backend database
    app.get('/todos', (req, res) => {
        tasksCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    // to update the database from clinent website, for this load the database first
    app.get('/todo/:id', (req, res) => {
        tasksCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    });
    //to update database from client site
    app.patch('/update/:id', (req, res) => {
        tasksCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { location: req.body.location, timeofTask: req.body.timeofTask }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    });

    // to delete database from backend database
    app.delete('/delete/:id', (req, res) => {
        tasksCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })
});



app.listen(3000);