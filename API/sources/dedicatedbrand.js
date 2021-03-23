const axios = require("axios");

const Product = require('./myProduct');
const brandName = "Dedicated";

const getCleanUri = (rawUri, nbSep) => {
  let numSep = 0;
  let cleanUri = "";

  for (var i = 0; i < rawUri.length; i++) {
    rawUri.charAt(i) == "/" && numSep++;
    if (numSep < nbSep) {
      cleanUri += rawUri.charAt(i);
    } else {
      return cleanUri;
    }
  }
  
};

module.exports.getAPI = async (url) => {
  const response = await axios(url);
  const { data, status } = response;

  categories = data.filterDescriptions.categories;

  products = data.products
    .filter((product) => product.length != 0)
    .map((rawProduct) => {

      // Get the category of a product 
      //TODO: Implement category in other products
      var nbSep = (rawProduct.canonicalUri.match(/\//g) || []).length;
      var cleanUri = getCleanUri(rawProduct.canonicalUri, nbSep);

      // product = {
      //   name: rawProduct.name,
      //   price: {
      //     price: rawProduct.price.priceAsNumber,
      //     priceBeforeDiscount: rawProduct.price.priceBeforeDiscountAsNumber,
      //     discount: rawProduct.price.discountPercent,
      //   },
      //   category: categories[cleanUri].split("::"),
      //   images: rawProduct.image,
      // };

      // product = {
      //   name: rawProduct.name,
      //   price: rawProduct.price.priceAsNumber,
      //   category: categories[cleanUri].split("::"),
      //   images: rawProduct.image,
      // };

      let caterogies = categories[cleanUri].split("::").map(cat => {
        return cat.toLowerCase();
      });

      let material = "";
      if(rawProduct.material_info){
        material = rawProduct.material_info;
      }

      let product = new Product(
        rawProduct.name, 
        rawProduct.price.priceAsNumber, 
        rawProduct.image,
        caterogies,
        brandName,
        "https://www.dedicatedbrand.com/en/" + rawProduct.canonicalUri,
        rawProduct.swatch.desc,
        material,
        rawProduct.price.showAsOnSale,
        rawProduct.price.newProduct
        )

      return product;
    });

    return products;
};
