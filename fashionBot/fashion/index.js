const config = require("../config");
const axios = require("axios");

const apiURL = "https://api.themoviedb.org/3/";

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



module.exports = (nlpData) => {
  return new Promise(async (resolve, reject) => {
    let intent = extractEntity(nlpData, "intent");
    resolve({"intent": intent});
  });
};
