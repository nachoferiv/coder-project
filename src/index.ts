import path from 'path';
import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
const handlebars = require('express-handlebars');
const apiRouter = require('./routes/apiRoutes');
const viewsRouter = require('./routes/viewsRoutes');

const httpPort: number = Number(process.env.PORT) || 3000;

const allowCrossDomain = function(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
}

const publicPath: string = path.join(__dirname, '../public')

const app: Application = express();
app.use(allowCrossDomain)

const httpServer = http.createServer(app)

const io = require('socket.io')(httpServer);

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
app.use(express.static(__dirname + '/public'));
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

const httpServerInit = httpServer.listen(httpPort, () => {
  console.log('Http server running at port: ' + httpPort);
})

module.exports = app;