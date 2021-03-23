const db = require('./index')

const getProductsFilter = async function(filter) {
    console.log("Looking for products matching: " + JSON.stringify(filter) + " ... 🕵️‍♀️");
    let res = await db.getQuery(filter, true, '', 3);
    return res;
}

module.exports.getProductsFilter = getProductsFilter;
