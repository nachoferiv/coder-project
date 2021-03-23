const express = require('express');
const apiRouter = require('./routes/apiRoutes');
const viewsRouter = require('./routes/viewsRoutes');
//const handlebars = require('express-handlebars');
const port = process.env.PORT || 8080;

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080/productos');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

const app = express();
app.use(allowCrossDomain)
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));
/*app.engine(
  'hbs',
  handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
  })
);*/
app.set('view engine', 'pug')

app.use('/api', apiRouter);
app.use('/', viewsRouter);

const server = app.listen(port, () => {
    console.log('Server listening at port: ' + port);
})

server.on('error', err => {
    console.log(err)
});


module.exports = app;