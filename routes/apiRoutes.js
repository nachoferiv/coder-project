const apiRouter = require('express').Router();
const DALProductos = require('../db/DALProductos');
const Producto = require('../entities/Producto');

apiRouter.setProductsListEvent = io =>{
  io.on('connection', async socket => {
    const dalProductos = new DALProductos('items.js');
    socket.emit('productsList', await dalProductos.read());
  });
}

apiRouter.get('/productos/listar', async (req, res) => {
  const dalProductos = new DALProductos('items.js')
  const products = await dalProductos.read();

  if (products.length == 0)
      res.status(404).json({error: 'Products not found'});
  else 
      res.status(200).json(products);
});

apiRouter.get('/productos/listar/:id', async (req, res, next) => {
  const dalProductos = new DALProductos('items.js')
  const products = await dalProductos.read();
  const product = await products.filter(p => p.id == req.params.id);

  if (product.length == 0)
      res.status(404).json({error: "Product not found"});
  else 
      res.status(200).json(product);
});

apiRouter.post('/productos/guardar', async (req, res) => {
  try {
      const dalProductos = new DALProductos('items.js')

      if(!req.body.name) {
        res.status(400).json({error: 'Product must have a title.'});
        return;
      }

      if(!req.body.price) {
        res.status(400).json({error: 'Product must have a price.'});
        return;
      }

      if(!req.body.thumbnail) {
        res.status(400).json({error: 'Product must have a thumbnail.'});
        return;
      }

      const newProduct = new Producto(null, req.body.name, req.body.price, req.body.thumbnail);
      const createdProduct = await dalProductos.save(newProduct);

      if (!createdProduct) {
        res.status(400).json({error: 'The product already exists'});
        return;
      } else {
        const io = req.app.get('socketio');
        io.sockets.emit('newproduct', {name: createdProduct.name, price: createdProduct.price, thumbnail:createdProduct.thumbnail});

        res.status(200).json({message: "Created!"});
      }
          
  } catch (e) {
      res.status(400).json({error: "Whoops! Something went wrong..."});
  }
});

apiRouter.put('/productos/actualizar/:id', async (req, res) => {
try {
    const dalProductos = new DALProductos('items.js')

    if(!req.body.name) {
      res.status(400).json({error: 'Product must have a title.'});
      return;
    }

    if(!req.body.price) {
      res.status(400).json({error: 'Product must have a price.'});
      return;
    }

    if(!req.body.thumbnail) {
      res.status(400).json({error: 'Product must have a thumbnail.'});
      return;
    }

    const productId = Number(req.params.id);
    const product = new Producto(productId, req.body.name, req.body.price, req.body.thumbnail);
    const status = await dalProductos.update(product);

    if (!status) {
      res.status(400).json({error: 'The product does not exist'});
      return;
    }
        
    else
        res.status(200).json({message: 'updated', product: status});
} catch (e) {
  console.log(e)
    res.status(400).json({error: "Whoops! Something went wrong..."});
}
});

apiRouter.delete('/productos/borrar/:id', async (req, res) => {
try {
    const dalProductos = new DALProductos('items.js')
    const productId = Number(req.params.id);
    const status = await dalProductos.delete(productId);

    if (!status) {
      res.status(400).json({error: 'The product does not exist'});
      return;
    }
        
    else
        res.status(200).json({message: 'deleted', product: status});
} catch (e) {
  console.log(e)
    res.status(400).json({error: "Whoops! Something went wrong..."});
}
});

module.exports = apiRouter;