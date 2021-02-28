//importing
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

//routes
router.get('/',(req,res)=>
{
    res.send('Hello! This is server');
});

router.get('/login',(req,res)=>
{
    res.render('login',{
        error : 'none'
    });
});

router.get('/signup',(req,res)=>{
    res.render('signup',{
        error : 'none'
    });
});

module.exports = router;