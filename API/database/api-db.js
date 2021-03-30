const db = require('./index')

const getProductsFilter = async function(filter) {
    console.log("Looking for products matching: " + JSON.stringify(filter) + " ... 🕵️‍♀️");
    let res = await db.getQuery(filter, true, '', 3);
    return res;
}

const getProducts = async function(nameP){
    let product = await db.getQuery({'nameP': nameP}, false, 'find');
    return product;
}

const saveProductRating = async function(data){
    let result = await db.saveProductRating(data);
    return result;
}

module.exports.getProductsFilter = getProductsFilter;
module.exports.getProducts = getProducts;
module.exports.saveProductRating = saveProductRating;

