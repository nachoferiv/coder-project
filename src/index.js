const path = require('path')
const express = require('express');
const handlebars = require('express-handlebars');
const apiRouter = require('./routes/apiRoutes');
const viewsRouter = require('./routes/viewsRoutes');
//const port = process.env.PORT || 8080;
const httpPort = process.env.PORT || 3000;

const allowCrossDomain = function(req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
}

const publicPath = path.join(__dirname, '/public')

const app = express();
app.use(allowCrossDomain)

const http = require('http').createServer(app)
const io = require('socket.io')(http);

app.set('socketio', io);
apiRouter.setProductsListEvent(io);
apiRouter.setChatMessagesListEvent(io);
app.use(express.static(publicPath))
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

const httpServer = http.listen(httpPort, () => {
  console.log('Http server running at port: ' + httpPort);
})

module.exports = app;