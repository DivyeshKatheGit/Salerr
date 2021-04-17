//importing
const express = require('express');
const path = require('path');
const router = require('./router');
const http = require('http');
const session = require('express-session');

//port declaration
const PORT = process.env.PORT || 5000;

//server setup
const app = express();
const server = http.createServer(app);

//middlewares
app.use(express.static(path.join(__dirname,'client/public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'client/views'));
app.use(session({
    secret : 'salerr',
    resave: true,
    saveUninitialized : true
}));
app.use(router);


//listen
server.listen(PORT,()=>{
    console.log(`Server is up and running at http://localhost:${PORT}`);
});