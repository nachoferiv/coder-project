const fetch = require("node-fetch");
const express = require('express');
const viewsRouter = express.Router();
const apiRouter = require('./apiRoutes');
import path from 'path';

const getProducts = async() => {
  const response =  await fetch("http://localhost:8080/api/productos/listar",{
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });

  return response.json();
}

viewsRouter.get('/products', async(req, res) => {
  res.render(path.join(__dirname,'../views/partials/productsView.hbs'));
});

module.exports = viewsRouter;