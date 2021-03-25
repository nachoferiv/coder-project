const express = require('express');
const handlebars = require('express-handlebars');
const apiRouter = require('./routes/apiRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const port = process.env.PORT || 8080;
const httpPort = process.env.HTTP_PORT || 3000;

const allowCrossDomain = function(req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
}

const app = express();
app.use(allowCrossDomain)

const http = require('http').Server(app)
const io = require('socket.io')(http);
const ioInitializer = require('./sockets/ioInitializer');

ioInitializer.initialize(io);


app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));


app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('./public'));
app.engine(
  'hbs',
  handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
  })
);

app.use('/api', apiRouter);
app.use('/', viewsRouter);

const server = app.listen(port, () => {
    console.log('Server listening at port: ' + port);
})

const htppServer = http.listen(httpPort, () => {
  console.log('Http server running at port: ' + httpPort);
})

module.exports = app;