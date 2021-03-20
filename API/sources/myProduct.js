// Here is the structure of our products.

const {'v5': uuidv5} = require('uuid');
var datetime = new Date();

module.exports = class Product {
    constructor(nameP, price, images, brandName, link, color, material, sale, newProduct){
        this.nameP = nameP, // string
        this.price = price, // float 
        this.images = images // [string]
        this.brandName = brandName, // string
        this.link = link,
        this.uuid = uuidv5(link, uuidv5.URL),
        this.color = color,
        this.material = material,
        this.onSale = sale,
        this.new = newProduct
    }

    display() {
        console.log(`Brand: ${this.brandName} | Name: ${this.nameP} | Price: ${this.price} | Nb of images: ${this.images.length} | Link; ${this.link}`);
    }
}