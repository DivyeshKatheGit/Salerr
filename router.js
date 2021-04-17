//importing
const express = require('express');
const bodyParser = require('body-parser');
const EmailValidator = require('email-validator');
const conn = require('./connection');
const {getProductDetails,getSearchedProduct,getProductFromID,getWishlist} = require('./api/productdetails');
const e = require('express');
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
                    let userName,userEmail,productsIDarr;
                    result.forEach(row => {
                        userName = row['Name'];
                        userEmail = row['Email'];
                    });
                    req.session.userName = userName;
                    let profileCode = (userName.charAt(0)).toUpperCase();

                    //get product details from backend
                    getProductDetails().
                    then(response => {
                        // console.log(response);
                        
                        //get favourite products id
                        // console.log(userEmail);
                        conn.query(`SELECT * FROM user_wishlist WHERE Email='${Email}'`,(err,result)=>{
                            if(result.length > 0)
                            {
                                result.forEach(row => {
                                    let idString = row.ProductID;
                                    if(idString) 
                                    {
                                        productsIDarr = idString.split(',');
                                        res.render('product',{
                                            status : 'success',
                                            userName : userName,
                                            userEmail : userEmail,
                                            profileCode : profileCode,
                                            data : response,
                                            IDarr : productsIDarr
                                        });
                                    }
                                    else
                                    {
                                        res.render('product',{
                                            status : 'success',
                                            userName : userName,
                                            userEmail : userEmail,
                                            profileCode : profileCode,
                                            data : response,
                                            IDarr : ''
                                        });
                                    }
                                    // console.log(productsIDarr);
                                });
                            }
                            else
                            {
                                res.render('product',{
                                    status : 'success',
                                    userName : userName,
                                    userEmail : userEmail,
                                    profileCode : profileCode,
                                    data : response,
                                    IDarr : ''
                                });
                            }
                        });

                        
                    }).catch((error) => {

                        console.log(error);
                        res.render('product',{
                            status : 'error',
                            userName : userName,
                            userEmail : userEmail
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
                // console.log(result.length);
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

    // console.log(req.body.action);
    let wishlist;
    let wishlistArr = [];

    //get stored data
    conn.query(`SELECT * FROM user_wishlist WHERE Email='${req.body.email}'`,(err,result)=>{
        if(!err)
        {
            if(result.length > 0)
            {
                result.forEach(row => {
                    wishlist = row.ProductID;
                });

                if(wishlist !== '')
                {
                    wishlistArr = wishlist.split(',');
                }

                // console.log(wishlistArr);

                if(req.body.action === 'add')
                {
                    wishlistArr.push(req.body.id);
                }
                else
                {
                    if(wishlistArr.includes(req.body.id))
                    {
                        wishlistArr.splice(wishlistArr.indexOf(req.body.id),1);
                    }
                }

                wishlist = wishlistArr.join(',');
                // console.log(wishlist);


                conn.query(`UPDATE user_wishlist SET ProductID='${wishlist}' WHERE Email='${req.body.email}'`,(error,result)=>{
                    if(!error)
                    {
                        res.json({
                            'status' : 'success'
                        });
                    }
                    else
                    {
                        console.log(error);
                        res.json({
                            'status' : 'error'
                        });
                    }
                })

               
            }
            else
            {
                wishlist = req.body.id;
                // console.log('Add into wishlist');
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
            console.log(err.message);
            res.json({
                'status' : 'error'
            })
        }
        // console.log(wishlist);
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
    // console.log(Email);
    let userName = req.session.userName;
    let profileCode = (userName.charAt(0)).toUpperCase();

    conn.query(`SELECT * FROM user_wishlist WHERE Email='${Email}'`,(err,result)=>{
        if(result.length > 0)
        {
            result.forEach(row => {
                    let idString = row.ProductID;

                    if(idString === '')
                    {
                        res.render('wishlist',{
                            status : 'success',
                            isEmpty : true,
                            userEmail : Email,
                            userName : userName,
                            profileCode : profileCode
                        })
                    }
                    else
                    {
                        productsIDarr = idString.split(',');
                        // console.log(productsIDarr);
                        getWishlist(productsIDarr)
                        .then((response)=>{
                            // console.log(response);
                            // console.log(response.length);
                            if(response.length > 0)
                            {
                                res.render('wishlist',{
                                    status : 'success',
                                    isEmpty : false,
                                    userEmail : Email,
                                    userName : userName,
                                    profileCode : profileCode,
                                    products : response
                                })
                            }
                            
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                    }
               
                    

                    
                    
            });
            
        }
        else
        {
            res.render('wishlist',{
                status : 'success',
                isEmpty : true,
                userEmail : userEmail,
                userName : userName,
                profileCode : profileCode
            })
        }
    });
    
});

//product search
router.post('/search',urlencodedParser,(req,res)=>{

    let Email = req.session.email;
    let product = req.body.search;
    let userName = req.session.userName;
    let profileCode = (userName.charAt(0)).toUpperCase();
    getSearchedProduct(product).then(response => {
        // console.log(response);

        let productsIDarr;

        let isEmpty = response.length > 0 ? false : true;



        conn.query(`SELECT * FROM user_wishlist WHERE Email='${Email}'`,(err,result)=>{
            if(result.length > 0)
            {
                result.forEach(row => {
                    let idString = row.ProductID;

                    console.log(idString);
                    if(idString) 
                    {
                        productsIDarr = idString.split(',');
                        res.render('search',{
                            status : 'success',
                            userEmail : Email,
                            userName : userName,
                            profileCode : profileCode,
                            data : response,
                            product : product,
                            isEmpty : isEmpty,
                            IDarr : productsIDarr
                        });
                    }
                    else
                    {
                        res.render('search',{
                            status : 'success',
                            userEmail : Email,
                            userName : userName,
                            profileCode : profileCode,
                            data : response,
                            product : product,
                            isEmpty : isEmpty,
                            IDarr : ''
                        });
                    }
                    // console.log(productsIDarr);
                });
            }
            else
            {
                res.render('search',{
                    status : 'success',
                    userEmail : Email,
                    userName : userName,
                    profileCode : profileCode,
                    data : response,
                    product : product,
                    isEmpty : isEmpty,
                    IDarr : ''
                });
            }
        });
        
    })
    
});

router.post('/browse',urlencodedParser,(req,res)=>{

    let Email = req.session.email;
    let userName = req.session.userName;
    let profileCode = (userName.charAt(0)).toUpperCase();
    let productsIDarr;
    
    getProductDetails()
        .then(response => {
            
            conn.query(`SELECT * FROM user_wishlist WHERE Email='${Email}'`,(err,result)=>{
                if(result.length > 0)
                {
                    result.forEach(row => {
                        let idString = row.ProductID;
                        if(idString) 
                        {
                            productsIDarr = idString.split(',');
                            res.render('product',{
                                status : 'success',
                                userName : userName,
                                userEmail : Email,
                                profileCode : profileCode,
                                data : response,
                                IDarr : productsIDarr
                            });
                        }
                        else
                        {
                            res.render('product',{
                                status : 'success',
                                userName : userName,
                                userEmail : Email,
                                profileCode : profileCode,
                                data : response,
                                IDarr : ''
                            });
                        }
                        // console.log(productsIDarr);
                    });
                }
                else
                {
                    res.render('product',{
                        status : 'success',
                        userName : userName,
                        userEmail : Email,
                        profileCode : profileCode,
                        data : response,
                        IDarr : ''
                    });
                }
            });

                        
                    }).catch((error) => {

                        console.log(error);
                        res.render('product',{
                            status : 'error',
                            userName : userName,
                            userEmail : userEmail
                        });
                    })
})


module.exports = router;