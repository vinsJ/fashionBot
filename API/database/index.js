//! .env must be in root folder. (Here, server)
require('dotenv').config();

const user = process.env.USER;
const password  = process.env.PASSWORD;
const cluster_url = process.env.CLUSTER_URL;


const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://' + user + ':' + password + '@' + cluster_url + '?retryWrites=true&w=majority'
const MONGODB_DB_NAME = 'fashion-bot';

let client = new MongoClient(MONGODB_URI,  {'useUnifiedTopology': true});
let db = null;

async function connect(){
    if(db){
        console.log("Already connected ! 🔌⚡");
        return db;
    }
    try{
        await client.connect();
        db =  client.db(MONGODB_DB_NAME)
        console.log("Connected ! 🦄")
        return db;
    } catch(e){
        console.log("🚨", e);
    }

}

async function close(client){
    try{
        await client.close();
        console.log("Disconected ! 🔌🪓")
    } catch(e) {
        console.log("🚨", e);
    }

}

async function agg(db, query, limit){
    try {
        const collection = db.collection('products');
        console.log("This is the query: ", query);
        const res = await collection.aggregate([
            { $match : query},
            { $sample: { size: limit}},
            { $sort: {price:  1}}
        ]).toArray();
        //console.log("This is the res: ", res);
        return res;
    } catch(e) {
        console.log("🚨", e);
    }
}

async function query(db, query, sort = null, limit = null) {
    try{
        const collection = db.collection('products');
        let res;
        if(!sort){
            res = await collection.find(query).toArray();
            return res;     
        } else if(sort && limit){
            res = await collection.find(query).sort({price : 1}).limit(limit).toArray();
            return res;
        }   else {
            res = await collection.find(query).sort(sort).toArray();
            return res;   
        }
  

    } catch(e) {
        console.log("🚨", e);
    }
}

async function count(db) {
    try{
        const collection = db.collection('products');
        nb_elements = await collection.countDocuments();
        return nb_elements;

    } catch(e) {
        console.log("🚨", e);
    }
}

async function run(querry, sort = null, type, limit = null){
    try{
        console.log("Connection ... 🦄")
        db = await connect();
        let res = "";
        if(type == 'find'){
            res = await query(db, querry, sort);
        } else if(type == 'API'){
            res = await query(db, querry, sort, limit);
            return res
        } else {
            res = await agg(db, querry, limit = 3);
        }
        return res;
    } catch(e) {
        console.log("🚨", e);
    } 

} 

async function insertData(data){
    try{
        db = await connect();
        const collection = db.collection('products');
        const result = await collection.insertMany(data);
        return result;

    } catch(e) {
        console.log("🚨", e);
    }
}

async function sandbox(){
    try{
        console.log("Connection ... 🦄")
        db = await connect();
        const collection = db.collection('products');
        //res = await collection.find({'onSale' : true}).toArray();
        res = await collection.deleteMany({});
        return res;

     } catch(e) {
        console.log("🚨", e);
    }
}

module.exports.getQuery = run;
module.exports.insertData = insertData;
module.exports.sandbox = sandbox;