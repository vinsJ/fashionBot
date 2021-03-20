/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');

const fs = require('fs')

const db = require('./database');
const db2 = require('./database/api-db');

async function sandbox (brand = None) {
  try {
    console.log(`🕵️‍♀️  browsing ${brand} source`);
    let url = "";
    let products = [];
    if(brand == 'Dedicated'){
      url = 'https://www.dedicatedbrand.com/en/men/news'
      //products = await dedicatedbrand.scrape(url);
      products = await dedicatedbrand.getAPI('https://www.dedicatedbrand.com/en/loadfilter?category=men');
    } else if(brand == 'Mud-Jeans') {
      url = 'https://mudjeans.eu/collections/men'
      products = await mudjeansbrands.scrape(url);
    } else if(brand == 'Adresse-Paris'){
      url = 'https://adresse.paris/630-toute-la-collection?id_category=630&n=110';
      products = await adresseparisbrands.scrape(url);
    } else if(brand == 'Loom') {
      url = 'https://www.loom.fr/collections/tous-les-vetements';
      products = await loom.scrape(url);
    } else {
      console.log("sorry, the brand you're looking for doesn't exists here");
      process.exit(0);
    }

    console.log('🏋️‍♂️ Products scrapp: ', products.length);
    console.log('Done scraping 🤩');

    updateFile('products.json', products);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
// Update the products of a brand (delete and replace)
function updateFile(fileName, brandUpdated){
  fs.readFile('./' + fileName, 'utf-8', (err, data) => {
    if(err) {
      throw err;
    }

    let fileF = JSON.parse(data.toString());
    let brandProducts = fileF.filter(prod => prod.brandName != brandUpdated[0].brandName);
    brandProducts = brandProducts.concat(brandUpdated)

    fs.writeFile('./' + fileName, JSON.stringify(brandProducts), 'utf-8', function (err) {
      if(err) {
        return console.log(err);
      }

      console.log("The file was saved!");
      process.exit(0);
    });

  });

}

function uploadData(){

  fs.readFile('./products.json', 'utf-8', (err, data) => {
    if(err){
      throw err;
    }

    fileF = JSON.parse(data.toString());
    if(fileF){
      console.log("Uploading... 🛸")
      db.insertData(fileF).then(res => {
        if(res.insertedCount = fileF.length){
          console.log("Upload succesfull 👽👾");
        } else {
          console.log(res);
        }
      });
    }
  });
}

async function getProducts(brandNameF = null, priceF = null, sort = null){
  let res = []
  if(brandNameF){
    res = await db.getQuery({brandName: brandNameF}, null,'find');
    console.log(testBrandName(brandNameF, res));
  }

  if(priceF){
    res = await db.getQuery({price: {$lt: priceF}}, null, 'find');
    console.log(res);
    console.log(testPrice(priceF, res));
  }

  if(sort){
    res = await db.getQuery(null, {price : -1}, 'find');
    console.log(testSortPrice(res));
  }
  return res;

}

//! Check is product exists before saving => Not useful since I have to go through all the JSON check if there is any modification, delete objects that are not in the
//* Do not erase all JSON, save product in the array of the brand => Done
//* scrap additional information for Adresse-Paris (and check if we scrap all the products) => DONE 

const [,, eshop] = process.argv;

//* Scrapping 

//sandbox(eshop);

//* Uploading data test

//uploadData();

//* Database link test

//getProducts('Mud-Jeans', null, null);
//getProducts(null, 30, null);

// getProducts(null, null, true).then(res =>{
//   console.log(res);
// })

db.sandbox().then(res => {
  console.log(res.length);
})

// db2.getProducts({limit:  3, price : 0, color : 'Blue', material : null}, null, '', 3).then(res =>{
//   console.log(res);
// })

//uploadOnFindData();