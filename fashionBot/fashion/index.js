const config = require("../config");
const axios = require("axios");

const apiURL = "http://localhost:3300/products/search";

const extractEntity = (nlp, entity) => {
  if (entity == "intent") {
    try {
      return nlp.intents[0].confidence > 0.8 ? nlp.intents[0].name : null;
    } catch {
      return null;
    }
  } else {
    try {
      return nlp.entities[entity + ":" + entity][0].value;
    } catch (e) {
      return null;
    }
  }
};

const getProducts = () => {
  return new Promise(async (resolve, reject) => {
    url = apiURL;
    axios.get(url).then(res => {
      products = res.data.result.map(p => {
        return {
          'name': p.nameP,
          'price': p.price,
          'image': p.images[0],
          'color': p.color,
          'material': p.material,
          'onSale': p.onSale,
          'link': p.link,
          'genre': p.categories[0],
          'type': p.categories[1]
        }
      });
      resolve(products);
    }).catch((err) => {
      reject(err.response.data);
    })
  });
}

const getProductsFiler = (filter) => {
  return new Promise(async (resolve, reject) => {
    url = apiURL;
    axios.get(url, {data : {filter: filter}}).then(res => {
      if(res.data.status != 200){
        resolve([])
      }
      products = res.data.result.map(p => {
        return {
          'name': p.nameP,
          'price': p.price,
          'image': p.images[0],
          'color': p.color,
          'material': p.material,
          'onSale': p.onSale,
          'link': p.link,
          'genre': p.categories[0],
          'type': p.categories[1]
        }
      });
      resolve(products); 
    }).catch(err => {
      reject(err);
    })
  })
}

module.exports = (nlpData) => {
  return new Promise(async (resolve, reject) => {
    let intent = extractEntity(nlpData, "intent");
    let entities = nlpData.entities;

    let filter = {};
    
    if (intent == 'getProducts') {

      // If no entities 
      if (Object.keys(nlpData.entities).length == 0) {
        // We get 3 randoms products
        products = await getProducts(null);
        resolve({ 'products': products });
      }

      else {
        // If there is a price we get the price and the type of filter (more or less)
        if (entities.hasOwnProperty('wit$amount_of_money:amount_of_money')) {
          const filterPrice = extractEntity(nlpData, 'filterPrice');
          if (filterPrice) {
            const price = parseInt(extractEntity(nlpData, 'wit$amount_of_money'));
            if (filterPrice == "more") {
              filter['price'] = { "$gte": price }
            } else {
              filter['price'] = { "$lte": price }
            }
          }
        }


        if (entities.hasOwnProperty('price:price')) {
          const filterPrice = extractEntity(nlpData, 'filterPrice');

          if (filterPrice) {
            const price = parseInt(extractEntity(nlpData, 'price'));
            if (filterPrice == "more") {
              filter['price'] = { "$gte": price }
            } else {
              filter['price'] = { "$lte": price }
            }
          }
        }
        
        if(entities.hasOwnProperty('sale:sale')){
          let res = false;
          let value = extractEntity(nlpData, 'sale');
          if(value === 'true') res = true;

          filter['onSale'] = res;
        }

        if(entities.hasOwnProperty('color:color')){

          filter['color'] = extractEntity(nlpData, 'color');
        }
        
        if(entities.hasOwnProperty('material:material')){
          filter['material'] = extractEntity(nlpData, 'material');
        }

        if(entities.hasOwnProperty('genre:genre')){
          let genre = extractEntity(nlpData, 'genre');
          filter['categories'] = { "$all" : [genre]};
        }

        products = await getProductsFiler(filter);
        resolve({ 'products': products });

      }
    }
  });
};
