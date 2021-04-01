from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
user = os.getenv('USER')
password  = os.getenv('PASSWORD')
cluster_url = os.getenv('CLUSTER_URL')

url = 'mongodb+srv://' + user + ':' + password + '@' + cluster_url + '?retryWrites=true&w=majority'
client = MongoClient(url)
db=client.users

def connection(db=None,colection="users"):
    if(db):
        print("Already connected ! 🔌⚡")
        return db
    try:
        print("Connection ... 🦄")
        url = 'mongodb+srv://' + user + ':' + password + '@' + cluster_url + '?retryWrites=true&w=majority'
        client = MongoClient(url)
        db=client.fashionBot
        if(colection=="users"):
            return db.users
        else:
            return db.products

    except Exception as e:
        print("🚨", e)
def query(id,colection):
    db=connection(None,colection)
    try:
        print("try to find the id 🍳")
        if(id):
            res=db.find({"sender":id})
        else:
            res=db.find({})
        res_prod=[]
        for x in res:
            if(id):
                res_prod.append({"sender":x["sender"],"product":x["product"],"rating":x["rating"]})
            else:
                res_prod.append({"nameP":x["nameP"],"price":x["price"],"images":x["images"],"categories":x["categories"],"brandName":x["brandName"],"link":x["link"],"uuid":x["uuid"],"color":x["color"],"material":x["material"],"onSale":x["onSale"],"new":x["new"]})
        return res_prod
    except Exception as e:
        print("🚨", e)



    

