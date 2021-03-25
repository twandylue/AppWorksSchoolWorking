const express = require('express');
const bodyParser =require('body-parser');
const cookieParser =require('cookie-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// serve static assets in public folder for assignment-3 
app.use(express.static('public'));

// set pug for assignment-2
app.set('view engine', 'pug'); 

// Assignment-1
app.get('/', (req, res) => {
    res.send('<h1>Hello, My Server!</h1>');
});

// Assignment-2
app.get('/data', (req, res) => {
    const {number} = req.query;
    if (!isNaN(number) && parseInt(number) > 0) {
        let sum = (1+parseInt(number))*parseInt(number)/2;
        res.send(`<h1>The answer is: ${sum}</h1>`);
    } else if (!number) {
        res.send('<h1>Lack of Parameter</h1>');
    } else {
        res.send('<h1>Wrong Parameter</h1>');
    }
})

// Assignment-4
app.get('/myName', (req, res) => {
    const name = req.cookies.username;
    if (name) {
        res.send(`<h2>username: ${name}</h2>`);
    } else {
        res.render('hello');
    }
});

app.get('/trackName', (req, res) => {
    const {name} = req.query;
    if (name) {
        res.cookie('username', name);
        res.redirect('myName');
    } else {
        res.send('Please enter your name in query.');
    }
});

// set sever to port:3000
app.listen(3000, () => {
    console.log('running...');
}); 