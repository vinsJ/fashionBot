const processResponse = function(products){
    if(products){
        let message = "";
        let images = [];
        let prods = [];
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
            prods.push({'name': p.name, 'link': p.link, 'image': p.image, "price": p.price, "material": p.material, "type": p.type, "onSale" : p.onSale, "emoji": emoji});
            counter+=1;
        });
        return {message, prods};
    }
}

const getEmoji = function(genre, type){
    let emoji = "";
    if(genre == 'men') emoji = "🧑";
    else if (genre == 'women') emoji = "👩";
    else if (genre == 'kids') emoji = "👦👧"

    return emoji;
}

module.exports.processResponse = processResponse;