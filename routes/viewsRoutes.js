const fetch = require("node-fetch");
const express = require('express');
const viewsRouter = express.Router();
const apiRouter = require('./apiRoutes');

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

const postProduct = async(data) => {
  const response =  await fetch("http://localhost:8080/api/productos/guardar",{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });

  return response.json();
}

viewsRouter.get('/products', async(req, res) => {
  await getProducts().then( products => {
    const title = 'Products';
    const exists = products.length > 0 ? true : false;
    //res.render('./partials/products.hbs', { title, products, exists })
    res.render('./partials/productsView.hbs', { title, products, exists });
  });
});

viewsRouter.post('/createProduct', async(req, res) => {
  await postProduct(req.body).then( status => {
    const title = 'Create Product';
    res.render('./partials/createProduct.hbs', { title, status});
  }).catch(e => console.log(e))
});

module.exports = viewsRouter;