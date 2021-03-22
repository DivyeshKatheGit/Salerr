//importing
const express = require('express');
const bodyParser = require('body-parser');
const EmailValidator = require('email-validator');
const conn = require('./connection');
const router = express.Router();

//body parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//routes
router.get('/',(req,res)=>
{
    res.send('Hello! This is server');
});

//login page
router.get('/login',(req,res)=>
{
    res.render('login',{
        status : 'success',
        message : 'success'
    });
});

//signup page
router.get('/signup',(req,res)=>{
    res.render('signup',{
        status : 'success',
        message : 'success'
    });
});

//login data
router.post('/loginApp',urlencodedParser,(req,res)=>{
    let Email = req.body.email;
    let Password = req.body.password;
    if(EmailValidator.validate(Email))
    {
        conn.query(`SELECT * FROM user_accounts WHERE Email='${Email}' AND Password='${Password}'`,(err,result)=>{
            if(err)
            {
                console.log(err);
                res.render('login',{
                    status : 'error',
                    message : 'Connection Error'
                });
            }
            else
            {
                // console.log(result.length);
                if(result.length > 0)
                {
                    let userName;
                    result.forEach(row => {
                        userName = row['Name'];
                    });
                    let profileCode = (userName.charAt(0)).toUpperCase();
                    res.render('product',{
                        status : 'success',
                        userName : userName,
                        profileCode : profileCode
                    });
                }
                else
                {
                    res.render('login',{
                        status : 'error',
                        message : 'User not found!'
                    });
                }
            }
        });
        
    }
    else
    {
        console.log('validation failed');
        res.render('login',{
            status : 'error',
            message : 'Please Enter Correct Email Format'
        });
    }
});

//signup data
router.post('/signupApp',urlencodedParser,(req,res)=>{
    let Name = req.body.name;
    let Email = req.body.email;
    let Password = req.body.password;
    if(EmailValidator.validate(Email))
    {

        conn.query(`SELECT * FROM user_accounts WHERE Email='${Email}'`,(err,result)=>{
            if(err)
            {
                console.log(err);
                res.render('signup',{
                    status : 'error',
                    message : 'Connection Error'
                });
            }
            else
            {
                console.log(result.length);
                if(result.length > 0)
                {
                    res.render('signup',{
                        status : 'error',
                        message : 'User already exists!'
                    });
                }
                else
                {
                    conn.query(`INSERT INTO user_accounts (Name,Email,Password) VALUES ('${Name}','${Email}','${Password}')`,(err,result)=>{
                        if(!err)
                        {
                            console.log('inserted');
                            res.render('signup',{
                                status : 'success',
                                message : 'Signup Successful'
                            });
                        }
                        else
                        {
                            console.log(err);
                            res.render('signup',{
                                status : 'error',
                                message : 'Connection Error'
                            });
                        }
                    });
                }
                
            }
        });
    }
    else
    {
        res.render('signup',{
            status : 'error',
            message : 'Please Enter Correct Email Format'
        });
    }
});


module.exports = router;