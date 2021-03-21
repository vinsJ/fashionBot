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

// const getProducts = async function(filter) {
//   url = apiURL;
//   axios.get(url).then(res => {
//     products = res.data.result.map(p => {
//       return {
//         'name': p.nameP,
//         'price': p.price,
//         'image': p.images[0],
//         'color': p.color,
//         'material': p.material,
//         'onSale': p.onSale,
//         'link': p.link
//       }
//     });

//     console.log("getProducts: ", products.length);
//     return products;
//   })
// }

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

      console.log("getProducts: ", products.length);
      resolve(products);
    }).catch((err) => {
      reject(err.response.data);
    })
  });
}



module.exports = (nlpData) => {
  return new Promise(async (resolve, reject) => {
    let intent = extractEntity(nlpData, "intent");
    if (intent == 'getProducts') {
      if (Object.keys(nlpData.entities).length == 0) {
        // We get 3 randoms products
        products = await getProducts(null);
        resolve({ 'products': products });
      }
    }
    //resolve({"intent": intent});
  });
};
