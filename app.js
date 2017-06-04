var express = require('express');
var app = express();

var nunjucks = require('nunjucks');
var path = require('path');
// var bodyParser = require('body-parser');

module.exports = app;

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', { noCache: true });

app.use(express.static(path.join(__dirname, '/public')));

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.render('index');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

const PORT = 3000;
app.listen(PORT, function () {
  console.log('The server is listening closely on', PORT);
});
