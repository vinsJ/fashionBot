const getGrade = function(content) {
    const grade = " with ";
 
    let rating = content.substring(content.indexOf(grade) + grade.length);

    if (rating.includes(' ')) {
        rating = rating.replace(' ', '');
    }

    rating = parseFloat(rating);

    return rating
}


const getProduct = function(content){
    const like = "I like ";
    const grade = " with ";

    let product = content.substring(content.indexOf(like) + like.length, content.indexOf(grade));
    return product;
}


const retrieveLikes = function(content){
    product = getProduct(content);
    rating = getGrade(content);

    return {'product': product, 'rating': rating};

}

module.exports.retrieveLikes = retrieveLikes;