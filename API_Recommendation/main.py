# une branche qui prend un user id
# une branche qui insert des données
# PORT 3600
import os
import flask
import json
from flask import request, jsonify
from database.index import query, get_unique_id
from cos.cos import cos


app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/user', methods=['GET'])
def api_id():
    if 'id' in request.args:
        id = str(request.args['id'])
        favorite_products = query(id, "users")
        All_produdcts = query(None, "products")
        favorite_products, id = modifID(favorite_products, id)
        # with open("favorite_products.json", "w") as jsonfile:
        #     json.dump(favorite_products, jsonfile)
        # jsonfile.close()
        print(id)
        top_movies1 = cos(All_produdcts, favorite_products, id)
        return json.dumps(top_movies1)

# modifID:
    # uid = get_unique_id()
    # modif_id = [x for x in range(len(uid))]
    # dict_uid = dict(zip(uid, modif_id))
    # return dict_uid


def modifID(favorite_products, id):
    try:
        print("read the file📖")

        f = open('./modifieID.json', "r")
        modifieID = json.load(f)

        f.close()

        allID = []
        if(modifieID):
            for cle, valeur in modifieID.items():
                print(cle)
                allID.append(cle)
            allID = list(set(allID))
        print("add new values ✔")

        for product in favorite_products:
            if(product["sender"] not in allID):
                modifieID[product["sender"]] = str(len(modifieID)+1)
                product["sender"] = modifieID[product["sender"]]
                allID.append(product["sender"])
            else:
                product["sender"] = modifieID[product["sender"]]
        print("write in the file ✏")
        with open("./modifieID.json", "w") as jsonfile:
            json.dump(modifieID, jsonfile)
        jsonfile.close()
        id = modifieID[id]
        return favorite_products, id
    except Exception as e:
        print("🚨", e)




# app.run()
if __name__ == '__main__':
    app.run(host="localhost", port=3600, debug=True)
# http://localhost:3600/user?id=5174020182668244
