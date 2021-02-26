//importing
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

//routes
router.get('/',(req,res)=>
{
    res.send('Hello! This is server');
});

module.exports = router;