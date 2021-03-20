const db = require('./index')

const getProductID = async function(id){
    let res = await db.getQuery({uuid: id}, null, 'find');
    return res;
}

const getProducts = async function(filter) {
    let query = "";
    if(!filter.color) {
        if(!filter.material){
            if(filter.price < 0){
                query = {price : {$lt: (filter.price*-1)}};
            } else if (filter.price > 0){
                query = {price : {$gt: filter.price}};
            } else {
                query = {}
            }   
        } else {
            if(filter.price < 0){
                query = {material : filter.material, price : {$lt: (filter.price*-1)}};
            } else if (filter.price > 0){
                query = {material : filter.material,price : {$gt: filter.price}};
            } else {
                query = {material : filter.material}
            }   
        }
    } else {
        if(filter.material){
            if(filter.price < 0){
                query = {color : filter.color, material : filter.material, price : {$lt: (filter.price*-1)}};
            } else if (filter.price > 0){
                query = {color : filter.color, material : filter.material, price : {$gt: filter.price}};
            } else {
                query = {color : filter.color, material : filter.material};
            }
        } else {
            if(filter.price < 0){
                query = {color : filter.color, price : {$lt: (filter.price*-1)}};
            } else if (filter.price > 0){
                query = {color : filter.color, price : {$gt: filter.price}};
            } else {
                query = {color : filter.color};
            }
        }

    }

    console.log("Looking for products matching: " + JSON.stringify(query) + " ... 🕵️‍♀️");
    let res = await db.getQuery(query, true, '', filter.limit, filter.page);
    return res;
}

module.exports.getProductID = getProductID;
module.exports.getProducts = getProducts;