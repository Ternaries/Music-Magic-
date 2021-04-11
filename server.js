'use strict';

//setup enviroment variables
require('dotenv').config();
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV

const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorised: false } } : { connectionString: DATABASE_URL }

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


//set routes
app.get('/', handle);

function handle(req, res) {
  res.send('Hi');
}


client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
});

