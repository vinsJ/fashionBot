#une branche qui prend un user id
#une branche qui insert des données
#PORT 3600
import os
import flask;
from flask import  request, jsonify
from  database.index import query




app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/user', methods=['GET'])
def api_id():
    if 'id' in request.args:
        id = int(request.args['id'])
        response=query(id)
        return response

# app.run()
if __name__ == '__main__':
    app.run(host="localhost", port=3600, debug=True)


