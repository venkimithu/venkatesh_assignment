const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 8000;

app.use(cookieParser());
app.use(session({
    secret: 'sdfsdlfifposdf8098098sf9d0f09f809f8sdfsdf9',
    cookie: {
        maxAge: 720
    },
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

mongoose.connect('mongodb://localhost/companyDb', {
    useNewUrlParser: true,
    useCreateIndex: true
});

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/company',require('./routes/route'));

app.use(function(err, req, res, next){
    /* We can catch errros here or log it error log files*/
    console.log(err);
    res.status(422).send({error:err});
});

app.listen(process.env.port || port, function(){
    console.log("Listening on port " + port);
});