import express from 'express';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: './config.env',
});

const app = express();

const port = 3000;

// MONGO_URI=create mongoDB uri and store it in the 'config.env' file
const uri = process.env.MONGO_URI;

const mongoClient = mongodb.MongoClient;

mongoClient.connect(uri)
.then(client => {
    console.log("Connected to MongoDB");

    const db = client.db('movies');
    const movies = db.collection('movies');

    app.use(express.json());

    app.listen(port, ()=>{console.log(`Server is listening at ${port}`)});
    
    // create a new movie

    app.post('/movies/add-movie', (req, res) => {
        movies.insertMany(req.body)
        .then(result => {
            res.status(201).json({
                success: true,
                data: result
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
            })
        })
    })

    // get all movies

    app.get('/movies/get-all', (req, res) => {
        movies.find({})
        .toArray()
        .then(results => {
            res.status(200).json({
                success: true,
                data: results,
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
            })
        })
    })

    // find particular movie

    app.get('/movies/get-single/', (req, res) => {
        const { index } = req.query;
        console.log(index);
        movies.find({
            index: index,
        })
        .toArray()
        .then(results => {
            res.status(200).json({
                success: true,
                data: results,
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
            })
        })
    })

    // fetch movies using pagination

    app.get('/movies/get-paginated/', (req, res) => {
        const pageNo = parseInt(req.query.page) || 0;
        const moviesNo = parseInt(req.query.size);
        movies.find()
        .skip(pageNo * moviesNo)
        .limit(moviesNo)
        .toArray()
        .then(results => {
            res.status(200).json({
                success: true,
                data: results
            })
        })
        .catch(error => {
            res.status(500).json({
                success: false,
            })
        })
    })
})
.catch(error => {
    console.log(error.message);
});

app.get('/', (req, res) => {
    res.send('api is working')
});
