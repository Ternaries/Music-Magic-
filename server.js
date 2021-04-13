'use strict';

//setup enviroment variables
require('dotenv').config();
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;

const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } } : { connectionString: DATABASE_URL };


//load libraries
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');


//setup app
const app = express();

//middlewares
app.use(cors());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect database
const client = new pg.Client(options);
client.on('error', err => { throw err });

// load other modules
const handleHomePage = require('./modules/handleHomePage.js');
const handleSearch = require('./modules/handleSearch.js');
const handleDetails = require('./modules/handleDetails.js');
// const handleFavorites = require('./modules/handleFavorites')

//API routes
app.get('/', handleHomePage)
app.get('/results', handleSearch);
app.get('/details/:id', handleDetails);
app.post('/addFavorites', handleFavorites);
app.get('/favorites', showFavorites);
app.delete('/favorites/:id',removeFavorites);
app.get('/addComment/:id',addComment)
app.post('/submitComment/:id',submitComment)

function handleFavorites(req, res) {
    let SQL = 'INSERT INTO songslist (id,title_short,artist_name,artist_picture,lyrics,audio) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;';
    let values = [req.body.id, req.body.songName, req.body.artistName, req.body.artistImg, req.body.lyrics, req.body.audio];
    console.log(values);
    // console.log(values);
    client.query(SQL, values).then((results) => {
            console.log(results.rows);
            res.redirect('/favorites');
        })
        .catch((err) => {
            console.log("ouch!!")
        })
}

function showFavorites(req, res) {
    const SQL = 'SELECT * FROM songslist';
    client.query(SQL).then(results => {
        console.log(results.rows);
        res.render('./pages/favorites', { favResults: results.rows });
    }).catch(error => errorHandler(error, req, res));
}

function removeFavorites(req,res){
    const deleteId = [req.params.id];
    const SQL='DELETE FROM songslist WHERE id=$1';
    client.query(SQL,deleteId).then(()=>{
        res.redirect('/favorites')
    }).catch((error)=>{
        console.log("no delete")
    })
}

function addComment(req,res){
    const SQL = 'SELECT * FROM songslist WHERE id=$1';
    const values = [req.params.id];
    console.log(values);
    client.query(SQL,values).then((results)=>{
        console.log(results.rows);
        res.render('./pages/addComment',{song : results.rows[0]});
        

    }).catch((error)=>{
        console.log("no comment")
    })
}

function submitComment(req,res){
    const SQL = 'INSERT INTO songslist(comment) VALUE ($1) RETURNING *; ';
    const values = req.body.comment 
    console.log(values)
    client.query(SQL,values).then((results)=>{
        // console.log(results.rows[0]);
        res.redirect('/favorites');
        

    }).catch((error)=>{
        console.log("oopps")
    })
}

app.get('*', (req, res) => res.status(404).send('Ouch Not Found!'));

function errorHandler(error, req, res) {
    res.status(500).send(error)
}

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    });
});