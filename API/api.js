const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const db = require('./database/api-db');

const PORT = 3300;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({ 'ack': true });
});

app.get('/products/search', async function (request, response) {
  let filter = {};

  if (request.body.filter) {
    filter = request.body.filter;
  }

  result = await db.getProductsFilter(filter)

  if (result) {
    if (result.length >= 1) {
      response.send({ 'status': 200, 'result': result });
    } else {
      response.send({ 'status': 204, 'message': 'No item found for given parameters', 'parameters': filter });
    }
  } else {
    response.send({ 'status': 500, 'message': 'Could not access database' });
  }
});

app.put('/user/products', async function (request, response) {
  data = request.body.data;
  if (data.product !== null && data.rating !== null && data.sender !== null) {
    product = await db.getProducts(data.product);
    if(product) {
      if (product.length > 0) {
        let result = await db.saveProductRating(data);
        if (result.n == result.ok) {
          console.log('💽 Product saved')
          response.send({ 'status': 200, 'response': 'Created or updated' });
        } else {
          response.send({ 'status': 500, 'response': 'Something went wrong with our databse' });
        }
      } else {
        response.send({ 'status': 404, 'reponse': 'Product not found' });
      }
    } else {
      response.send({ 'status': 500, 'response': 'Something went wrong with our databse' });
    }
  }

});
app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);