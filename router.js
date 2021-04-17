//importing
const express = require('express');
const bodyParser = require('body-parser');
const EmailValidator = require('email-validator');
const conn = require('./connection');
const {getProductDetails,getSearchedProduct,getProductFromID} = require('./api/productdetails');
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
    req.session.email = Email;
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
                    let userName,userEmail;
                    result.forEach(row => {
                        userName = row['Name'];
                        userEmail = row['Email'];
                    });
                    req.session.userName = userName;
                    let profileCode = (userName.charAt(0)).toUpperCase();

                    //get product details from backend
                    getProductDetails().then(response => {
                        // console.log(response);
                        res.render('product',{
                            status : 'success',
                            userName : userName,
                            userEmail : userEmail,
                            profileCode : profileCode,
                            data : response
                        });
                    }).catch(error => {
                        res.render('product',{
                            status : 'error'
                        });
                    })

                    
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

router.post('/wishlist',urlencodedParser,(req,res)=>{
    console.log(req.body);
    let wishlist;

    //get stored data
    conn.query(`SELECT * FROM user_wishlist WHERE Email='${req.body.email}'`,(err,result)=>{
        if(!err)
        {
            if(result.length > 0)
            {
                result.forEach(row => {
                    wishlist = row.ProductID;
                });
                wishlist = wishlist+','+req.body.id;
                conn.query(`UPDATE user_wishlist SET ProductID='${wishlist}' WHERE Email='${req.body.email}'`,(error,response)=>{
                    if(!error)
                    {
                        res.json({
                            'status' : 'success'
                        });
                    }
                    else
                    {
                        console.log(error)
                        res.json({
                            'status' : 'error'
                        });
                    }
                })
            }
            else
            {
                wishlist = req.body.id;
                console.log('Add into wishlist');
                //add new record
                conn.query(`INSERT INTO user_wishlist (Email,ProductID) VALUES('${req.body.email}','${wishlist}')`,(error,response)=>{
                    if(!error)
                    {
                        res.json({
                            'status' : 'success'
                        });
                    }
                    else
                    {
                        console.log(error)
                        res.json({
                            'status' : 'error'
                        });
                    }
                })
            }
        }
        else
        {
            console.log(err);
            res.json({
                'status' : 'error'
            })
        }
        console.log(wishlist);
    })
    

    
});

//virtual trial
router.post('/trial',urlencodedParser,(req,res)=>{
    let id = req.body.id;
    // console.log(id);
    getProductFromID(id)
    .then((response)=>{
        // console.log(response);
        res.render('trial',{
            status : 'success',
            data : response
        });
    })
    .catch((error)=>{
        console.log(error);
    })
})

//favourites
router.get('/favourites',urlencodedParser,(req,res)=>{
    let Email = req.session.email;
    let userName = req.session.userName;
    let profileCode = (userName.charAt(0)).toUpperCase();

    conn.query(`SELECT * FROM user_wishlist WHERE Email='${req.body.email}'`,(err,result)=>{
        if(result.length > 0)
        {
            let products = [];
            result.forEach(row => {
                getProductFromID(row.ProductID)
                .then((response)=>{
                    products.push(response);
                })
                .catch((err)=>{
                    console.log(err);
                })
            });
            res.render('wishlist',{
                status : 'success',
                isEmpty : true,
                profileCode : profileCode,
                products : products
            })
        }
        else
        {
            res.render('wishlist',{
                status : 'success',
                isEmpty : false,
                profileCode : profileCode
            })
        }
    });
    
});

//product search
router.post('/search',urlencodedParser,(req,res)=>{

    console.log(req.body);
    let product = req.body.search;
    let userName = req.session.userName;
    let profileCode = (userName.charAt(0)).toUpperCase();
    getSearchedProduct(product).then(response => {
        // console.log(response);
        let isEmpty = response.length > 0 ? false : true;
        res.render('search',{
            status : 'success',
            profileCode : profileCode,
            data : response,
            product : product,
            isEmpty : isEmpty
        });
    })
    
});


module.exports = router;