const getGrade = function (content) {
    /**
     * Get the grade out of the sentence "I like <product> with <grade>"
     * @param {string} content Content of the message
     * @param {float} rating of the product
     */
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
    /**
    * Get the products out of the sentence "I like <product> with <grade>"
    * @param {string} content Content of the message
    * @return {string} product name
    */
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
    /**
    * Get the products out of the sentence "I like <product> with <grade>"
    * @param {string} content Content of the message
    * @return {Object} product name and rating
    */
    product = getProduct(content);
    rating = getGrade(content);

    return { 'product': product, 'rating': rating };

}

module.exports.retrieveLikes = retrieveLikes;