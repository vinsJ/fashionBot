from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
user = os.getenv('USER')
password = os.getenv('PASSWORD')
cluster_url = os.getenv('CLUSTER_URL')

url = 'mongodb+srv://' + user + ':' + password + '@' + cluster_url + '?retryWrites=true&w=majority'
client = MongoClient(url)
DB = client.fashionBot

def connection(db=DB, collection="users"):
    if(db):
        print("Already connected ! 🔌⚡")
        return db
    try:
        print("Connection ... 🦄")
        url = 'mongodb+srv://' + user + ':' + password + \
            '@' + cluster_url + '?retryWrites=true&w=majority'
        client = MongoClient(url)
        db = client.fashionBot
        if(collection == "users"):
            return db.users
        else:
            return db.products

    except Exception as e:
        print("🚨", e)


def query(id, collection):
    db = connection(DB, collection)
    try:
        if(id):
            print("Finding favorite products of user 🍳")
            res = db.users.find({"sender": id})
        else:
            print("Retrieving all prodcuts from db 💾")
            res = db.products.find({}).limit(700)
        res_prod = []
        for x in res:
            if(id):
                res_prod.append(
                    {"sender": x["sender"], "product": x["product"], "rating": x["rating"]})
            else:
                res_prod.append({"nameP": x["nameP"], "price": x["price"], "images": x["images"], "categories": x["categories"], "brandName": x["brandName"],
                                "link": x["link"], "uuid": x["uuid"], "color": x["color"], "material": x["material"], "onSale": x["onSale"], "new": x["new"]})
        return res_prod
    except Exception as e:
        print("🚨", e)