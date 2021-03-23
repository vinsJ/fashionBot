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

def connection(db=None):
    if(db):
        print("Already connected ! 🔌⚡")
        return db
    try:
        print("Connection ... 🦄")
        url = 'mongodb+srv://' + user + ':' + password + '@' + cluster_url + '?retryWrites=true&w=majority'
        client = MongoClient(url)
        db=client.bot
        users=db.users
        return users
    except Exception as e:
        print("🚨", e)
def query(id):
    db=connection()
    try:
        print("try to find the id 🍳")
        res=db.find({"uuid":id}).limit(1)
        for x in res:
            return {"uuid":x["uuid"],"name":x["name"]}
    except Exception as e:
        print("🚨", e)



    

