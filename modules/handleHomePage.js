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
    // for (let i = 0; i < 5; i++) {
     
        // const VQ=axiose.get('https://api.kanye.rest')
        //  .then(res=>{
        //      const Qresult=res.data
             // console.log(res.data);
             // res.send(res.data.quote)
            //  console.log(quotes);
            //  return Qresult
            // })
            // res.render('pages/index',{quotes:VQ})
               res.render('pages/index')
   
   

}



module.exports = handleHomePage;