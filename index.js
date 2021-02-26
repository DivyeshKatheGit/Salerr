//importing
const express = require('express');
const path = require('path');
const router = require('./router');
const http = require('http');

//port declaration
const PORT = process.env.PORT || 5000;

//server setup
const app = express();
const server = http.createServer(app);

//middlewares
app.use(express.static(path.join(__dirname,'client/public')));
app.use(router);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'client/views'));

//listen
server.listen(PORT,()=>{
    console.log(`Server is up and running at ${PORT}`);
});