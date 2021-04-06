const Item = require('../entities/Producto');
const DALItems = require('../db/DALProductos');
const validator = new (require('../utils/Validator'))();


class ProductController {
    constructor() {
        this.db = new DALItems('items.js');
    }

    getAll() {
        const rawData = this.db.read();
        const items = rawData.map( p => new Item(p.id, p.name, p.price, p.thumbnail));

        return items;
    } 

    getById(id) {
        return this.getProducts().filter(p => p.id === id);
    }

    getByName(name) {
        return this.getProduct().filter(p => p.name === name);
    }

    create(item) {
        if (!Number(product.price))
            return { error: "Invalid price." }
    }

    update(item) {

    }

    delete(item) {

    }


}

module.exports = ProductController;