'use strict'

//load libraries
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const axiose=require('axios');



//setup app
const app = express();

//middlewares
app.use(cors());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function handleHomePage(req, res) {
    const quotes=[];
    for (let i = 0; i < 5; i++) {

    quotes.push(axiose.get('https://api.kanye.rest')
    .then(res=>{

       return res.data.quote;
      
       }).catch(err => console.log("ouch!"))
    );

   }
   Promise.all(quotes).then(quote => {
    res.render('pages/index', {quotes:quote});
    console.log(quotes);
   })
}



module.exports = handleHomePage;