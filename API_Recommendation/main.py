# PORT 3600
import os
import flask
import json
from flask import request, jsonify
from database.index import query
from cos.cos import cos

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/')
def home():
    return json.dumps({'working': True})


@app.route('/user', methods=['GET'])
def api_id():
    if 'id' in request.args:
        id = str(request.args['id'])
        favorite_products = query(id, "users")

        if(len(favorite_products) == 0):
            return json.dumps({"status": 404, "message": "no favs products"})

        all_products = query(None, "products")

        if(len(all_products) == 0):
            return json.dumps({"status": 404, "message": "no products in db"})

        top_movies1 = cos(all_products, favorite_products)
        if(top_movies1):
            return json.dumps({"status": 200, "data": top_movies1})
        else:
            return json.dumps({"status": 500, "data": {}})

# app.run()
if __name__ == '__main__':
    app.run(host="localhost", port=3600, debug=True)
# http://localhost:3600/user?id=5174020182668244


