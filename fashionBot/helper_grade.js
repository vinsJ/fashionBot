const getGrade = function (content) {
    try {
        const grade = " with ";

        let rating = content.substring(content.indexOf(grade) + grade.length);

        if (rating.includes(' ')) {
            rating = rating.replace(' ', '');
        }

        rating = parseFloat(rating);

        if(rating < 0){
            rating = 0;
        } 

        if(rating > 5){
            rating = 5;
        }

        return rating
    } catch {
        return null
    }
}


const getProduct = function (content) {
    try {
        const like = "i like ";
        const grade = " with ";

        let product = content.substring(content.indexOf(like) + like.length, content.indexOf(grade));
        return product;

    } catch {
        return null
    }
}


const retrieveLikes = function (content) {
    product = getProduct(content);
    rating = getGrade(content);

    return { 'product': product, 'rating': rating };

}

module.exports.retrieveLikes = retrieveLikes;