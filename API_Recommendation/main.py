# une branche qui prend un user id
# une branche qui insert des données
# PORT 3600
import os
import flask
import json
from flask import request, jsonify
from database.index import query
from cos.cos import cos


app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/user', methods=['GET'])
def api_id():
    if 'id' in request.args:
        id = str(request.args['id'])
        favorite_products = query(id, "users")
        All_produdcts = query(None, "products")
        top_movies1 = cos(All_produdcts, favorite_products)
        return json.dumps(top_movies1)

# app.run()
if __name__ == '__main__':
    app.run(host="localhost", port=3600, debug=True)
# http://localhost:3600/user?id=5174020182668244


