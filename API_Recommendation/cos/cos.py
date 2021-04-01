import pandas as pd
import numpy as np
import json
import math

#TODO : modify id from favorite_products

def cos(All_produdcts, favorite_products, id):
    favorite_products = pd.DataFrame(favorite_products)

    # Getting categories
    categories = [product["categories"] for product in All_produdcts]
    categories = [categorie for list_categorie in categories for categorie in list_categorie]
    all_categories = list(set(categorie for categorie in categories))
    All_produdcts = pd.DataFrame(All_produdcts)
    All_produdcts[all_categories] = 0

    # One hot encoding and drop the categories column
    for index, row in All_produdcts.iterrows():
        list_categorie = [categorie for categorie in row['categories']]
        for categorie in list_categorie:
            row[categorie] = 1/math.sqrt(len(list_categorie))
        All_produdcts.loc[index] = row
    All_produdcts.drop('categories', 1, inplace=True)

    # Ratings
    favorite_products = favorite_products.rename(columns={"product": "nameP"})
    result = pd.merge(favorite_products, All_produdcts, on='nameP')

    max_user = max(result['sender'])
    # We create a matrix of 0 with rows = number of users and columns = number of categories
    # int(len(uid)) insteand of int(max_user)
    result_matrix = np.zeros(shape=(int(max_user)+1, len(all_categories)))
    all_ids = np.unique(result['sender'])

    # for x in range()
    for userId in all_ids:
        dfId = result[result['sender'] == userId]
        nbRating = len(dfId.index)
        for index in dfId.index:
            dfInfo = dfId.loc[index]
            for genreNum in range(len(all_categories)):
                result_matrix[int(userId), int(genreNum)] += float(dfInfo['rating']) * float(dfInfo[int(genreNum)+12])
        result_matrix[int(userId)] = result_matrix[int(userId)]/nbRating


    genre_ratings_users_df(id, all_categories, result_matrix)

    top_movies1 = topMovieUser(id, All_produdcts, 3, result, result_matrix)
    return top_movies1



def genre_ratings_users_df(userId, all_categories, users):
    data = {'categories': all_categories, 'Scores': users[int(userId)]}
    df = pd.DataFrame(data=data)
    return df.sort_values(by='Scores', ascending=False)

# Give the cosine score based on user_vector and product_vector
def cosine(user_vector, product_vector):
    res = np.dot(user_vector, product_vector) / \
        (rootSquare(user_vector)*rootSquare(product_vector))
    return res

# Calculate numerator value
def innerProduction(user_vector, product_vector):
    res = 0.0
    for i in range(len(user_vector)):
        res += user_vector[i] * product_vector[i]
    return res

# Calculate denominator value
def rootSquare(vector):
    res = 0.0
    for i in range(len(vector)):
        res += vector[i] ** 2
    return math.sqrt(res)


def topMovieUser(user_id, products, n, result, users):
    # Get user information
    user = users[int(user_id)]
    # Remove seen movie (they are rated)
    products_seen = result[result['sender'] == user_id]['nameP']
    products_unseen = products[~products['nameP'].isin(products_seen)]
    # We store movies id paired with their score
    productsId = list(products_unseen['nameP'])
    scores = products.apply(lambda x: cosine(user, x[10:]), axis=1)
    productsScores = dict(zip(productsId, scores))
    # Sort dictionnary
    productsScores = {k: v for k, v in sorted(
        productsScores.items(), key=lambda item: item[1], reverse=True)}
    # Return n first
    return {k: productsScores[k] for k in list(productsScores)[:n]}
