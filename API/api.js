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
  //console.log("products/search triggered... 🕵️‍♀️")


  let filter = {};

  if(request.body.filter){
    filter = request.body.filter;
  }

    result = await db.getProductsFilter(filter)

  if (result) {
    if (result.length >= 1) {
      response.send({ 'status': 200, 'result': result });
    } else {
      response.send({ 'status': 204, 'message': 'No item found for given parameters', 'parameters' : filter});
    }
  } else {
    response.send({ 'status': 500, 'message': 'Could not access database' });
  }
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);