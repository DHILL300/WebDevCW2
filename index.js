require('dotenv').config();
const express = require('express');
const mustache = require('mustache-express');
const path = require('path');
const app = express();
const public = path.join(__dirname, 'public');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', router);
app.use(express.static(public));
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
//app.use(express.static(__dirname + '/public'))

app.use(function (req,res){
    res.status(404);
    res.send('Oops! we didn\'t find what you were looking for.');
})

app.listen(PORT, () =>{
    console.log('Server started on port ${PORT}. Ctrl^to quit');
})