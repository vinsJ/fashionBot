"user strict";

const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const bodyparser = require("body-parser");
const config = require("./config/index.js");
const FBeamer = require("./fbeamer");

const fashion = require('./fashion');
const responseHandle = require("./response");

const f = new FBeamer(config.FB);

const server = express();
const PORT = process.env.PORT || 3000;

server.post(
  "/",
  bodyparser.json({
    verify: f.verifySignature.call(f),
  })
);


server.post("/", (req, res, next) => {
  return f.incoming(req, res, async (data) => {
    try {
      console.log("🚨 New incoming message: ", data);
      console.log("💽 NLP intents: ", data.nlp.intents);
      console.log("💽 NLP entities: ", data.nlp.entities);
      fashion(data.nlp).then(res => {
        console.log("🚨🚨 : ", res);
        let response = responseHandle.processResponse(res.products);
        if (response.message) f.txt(data.sender, response.message);
        if (response.images.length > 0) {
          console.log(response.images.length)
          response.images.forEach(img => {
            console.log(img)
            f.img(data.sender, img); 
          });
        }

      });
    } catch (e) {
      console.log(e);
    }
  });
});

server.get("/", (req, res) => f.registerHook(req, res));
server.listen(PORT, () =>
  console.log(`The bot server is running on port ${PORT}`)
);
