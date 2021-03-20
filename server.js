"user strict";

const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const bodyparser = require("body-parser");
const config = require("./config/index.js");
const FBeamer = require("./fbeamer");

const fashion = require('./fashion');

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
      fashion(data.nlp).then(res =>{
        let response = "";
        f.txt(data.sender, response);
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
