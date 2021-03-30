import pandas as pd
import numpy as np
import json 
import math
def cos(All_produdcts=None,favorite_products=None):
    f = open('All_products.json',)
    All_produdcts=json.load(f)
    f.close()

    f = open('favorite_products.json',)
    favorite_products=pd.DataFrame(json.load(f))
    f.close()
    #hot encoding
    categories=[product["categories"] for product in All_produdcts]
    categories=[categorie  for list_categorie in categories for categorie in list_categorie]
    all_categories=list(set(categorie for categorie in categories))
    All_produdcts=pd.DataFrame(All_produdcts)
    All_produdcts[all_categories]=0
    # One hot encoding
    for index,row in All_produdcts.iterrows():
        list_categorie=[categorie for categorie in row['categories']]
        for categorie in list_categorie:
            row[categorie]=1/math.sqrt(len(list_categorie))
        All_produdcts.loc[index]=row
    All_produdcts.drop('categories',1,inplace=True)
    #Ratings
    favorite_products=favorite_products.rename(columns={"product":"nameP"})
    result=pd.merge(favorite_products,All_produdcts, on='nameP')
    #question 7
    #probleme: l'id user est trop grande
    max_user = max(result['sender'])
    # We create a matrix of 0 with rows = number of users and columns = number of genres
    result_matrix = np.zeros(shape=(int(max_user)+1, len(all_categories)))
    all_ids = np.unique(result['sender'])
    for userId in all_ids:
        dfId = result[result['sender'] == userId]
        nbRating = len(dfId.index)
        for index in dfId.index:
            dfInfo = dfId.loc[index]
            for genreNum in range(len(all_categories)):
                result_matrix[int(userId), int(genreNum)] += int(dfInfo['rating'])* int(dfInfo[int(genreNum)+12])
        result_matrix[int(userId)] = result_matrix[int(userId)]/nbRating
    print(result_matrix)

cos()
