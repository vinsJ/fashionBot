const processResponse = function(products){
    if(products){
        let message = "";
        let images = [];
        let counter = 1;
        products.forEach(p => {
            let emoji = "";
            let onSale = "It's not on sale.";

            if(p.onSale){
                onSale = "It's on sale.";
            }

            emoji = getEmoji(p.genre, null);

            message += `${emoji}This is product ${counter}: \nName: ${p.name} | Price: ${p.price} | Material: ${p.material} | ${onSale} | Check it out : ${p.link}\n\n\n`;
            images.push(p.image);
            counter+=1;
        });
        return {message, images};
    }
}

const getEmoji = function(genre, type){
    let emoji = "";
    if(genre == 'Men') emoji = "🧑";
    else if (genre == 'Women') emoji = "👩";

    return emoji;
}

module.exports.processResponse = processResponse;