const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const apiRouter = require('./routes/apiRoutes');
const viewsRouter = require('./routes/viewsRoutes');
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

app.use(expressLayouts);
app.set('layout','./layouts/main')
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/api', apiRouter);
app.use('/', viewsRouter);

const server = app.listen(port, () => {
    console.log('Server listening at port: ' + port);
})

server.on('error', err => {
    console.log(err)
});


module.exports = app;