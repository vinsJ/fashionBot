"user strict";

const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const bodyparser = require("body-parser");
const config = require("./config/index.js");
const FBeamer = require("./fbeamer");

const fashion = require('./fashion');
const responseHandle = require("./helper_response");
const gradeHelper = require("./helper_grade");

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

      if(data.content.includes('I like')){
        productLikes = gradeHelper(data.content);
        // Need to call API and store product 
      }

      if (data.nlp.hasOwnProperty('traits')) {
        if (data.nlp.traits.hasOwnProperty('wit$greetings')) {
          if (data.nlp.traits['wit$greetings'][0].value == 'true' && data.nlp.traits['wit$greetings'][0].confidence >= 0.80) {
            listHello = ['Hi there 👋', 'Hello ! ✋👕', 'Howdy! 🤠', "G'day 🖖"];
            var greeting = listHello[Math.floor(Math.random() * listHello.length)];
            f.txt(data.sender, greeting);
          }
        }
      }
      fashion.products(data.nlp).then(res => {
        if (res.type == "FetchProducts") {
          if (res.status == 200 || res.status == 204) {
            f.txt(data.sender, `This is ${res.products.length} randoms products 🕵️‍♀️`);
            let response = responseHandle.processResponse(res.products);
            if (response.prods.length > 0) {
              response.prods.forEach(p => {
                let sale = "";
                if (p.material == "undefined") p.material = "";
                else p.material = "| " + p.material;
                if (p.onSale == true) sale = "| 💸";
                f.template(data.sender, p.name, p.link, p.image, p.price, p.emoji, p.type, p.material, sale).catch((err) => {
                  console.log(err);
                });
              });
            } else {
              f.txt(data.sender, "I'm sorry, the product you're looking for doesn't exists 😥");
            }
          } else {
            f.txt(data.sender, "Oups, something went wrong with our Database 🤦‍♂️🔨\n\nPlease try again later");
          }

        } else if (res.type == "LikeProducts") {

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
