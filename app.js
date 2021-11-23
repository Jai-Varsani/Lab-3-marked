const express = require('express');
const { use } = require('./routes/apis');

//creating app
const app = express();




//not needed because the file is being processed by ejs file in views.
//send an HTTP response when receiving HTTP GET /
// app.use(express.static('public'));

//not needed because the file is being processed by ejs file in views.

// app.get('/',(req,res) => {
//     res.sendFile("public/index.html", { root:__dirname });
// });

//make the app listen on port
const port = process.argv[2] || process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Cart app listening at http://localhost:${port}`);
});

//handling static HTML and EJS templates

app.use(express.static('public'));
app.set('view engine','ejs');
app.get('/',(req, res) => {

    res.render('index'); //no need for ejs extension

});

app.get('/contacts', (req, res) => {
    res.render('contacts');
});

app.get('/register', (req, res) => {
    res.render('register'); 
});

app.get('/login', (req, res) => {
    res.render('login'); 
});

// using JSON and URL Encoded middleware 
app.use(express.json()); 
app.use(express.urlencoded({ 
    extended: true 
}));

//pass requests to the router middleware
const router = require('./routes/apis');
const session = require('express-session');
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))
app.use(router);
