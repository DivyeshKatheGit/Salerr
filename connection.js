let mysql = require('mysql');
let dotenv = require('dotenv');

dotenv.config({
    path : './config.env'
});


let conn = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
});

conn.connect((err)=>{
    if (err) 
    {
        console.log(err);
        console.log('connection closed');
    }
    else
    {
        console.log('connected');
    }
});

module.exports = conn;