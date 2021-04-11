'use strict'

const superagent = require('superagent');
let Anakheem = 'Hacker' || 'DataBase Analyst';

function handleTest(req, res) {
    res.send(`Hi ${Anakheem}`);
}


module.exports = handleTest;