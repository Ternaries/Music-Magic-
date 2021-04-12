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
// const handleTest = require('./modules/handleTest.js'); //Muhannad
// const handleSearch = require('./modules/handleSearch.js'); //Reem-Rawan

//API routes
// app.get('/test', handleTest);
app.get('/results', handleSearch);

function handleSearch (req ,res){
const url = `https://api.deezer.com/search?q=${req.query.search}`;
console.log(req.query.search);
console.log(url);
superagent.get(url).then((data)=>{
    // res.send(data.body);
    console.log(data.body)
    const songs = data.body.data.map(values =>{
        return new Songs (values); 
    })
    res.render('./pages/results', {song : songs });
}).catch((error) =>{
    res.status(500).send(error)
  })

}

function Songs(data){
    this.id = data.id;
    this.title_short = data.title_short ? data.title_short : 'No Title Was Found' ;
    this.previewAudio = data.preview ? data.preview : 'No Audio preview Was Found' ;
    // this.lyrics = lyrics;
    this.artist_name = data.artist.name? data.artist.name : 'No Artist Name Was Found' ; 
    this.artist_picture = data.artist.picture_big ? data.artist.picture_big : '../project-images/no-image.png';
    this.cover_medium = data.album.cover_medium ? data.album.cover_medium : 'No Medium Cover Was Found';
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