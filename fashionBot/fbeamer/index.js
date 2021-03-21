'use strict'

const crypto = require('crypto');
const request = require('request');
const apiVersion = 'v9.0';

class FBeamer{
    constructor({pageAccessToken, VerifyToken, appSecret}){
        if(pageAccessToken == null | VerifyToken == null | appSecret){
            throw new Error("Null argument(s) in FBeamer")
        } else{
            this.pageAccessToken = pageAccessToken;
            this.VerifyToken = VerifyToken;
            this.appSecret = appSecret;
        }
    }

    registerHook(req, res){
        const params = req.query
        const mode = params['hub.mode']
        const token = params['hub.verify_token']
        const challenge = params['hub.challenge']
        try{
            if(mode === 'subscribe' & token === this.VerifyToken){
                console.log('WebHook registered')
                return res.send(challenge);
            } else {
                console.log("Could not register webhook!");
                return res.sendStatus(200);
            }
        } catch (e){
            console.log(e)
        }
    }

    verifySignature(req, res, buf){
        return (req, res, buf) => {
            if(req.method === 'POST'){
                try{
                    let tempo_hash = crypto.createHmac('sha1', this.appSecret).update(buf, 'utf-8')
                    let hash = tempo_hash.digest('hex')
                    if('sha1='+hash == req.header('x-hub-signature')){
                        return true
                    }
                    else{
                        return false
                    }
                } catch(e) {
                    console.log(e)
                }
            }
        }
    }

    messageHandler(obj){
        let sender = obj.sender.id;
        let message = obj.message;
        if(message.text) {
            return obj = {
                sender,
                type: 'text',
                content: message.text,
                nlp: message.nlp
            };
        }
    }

    incoming(req, res, cb) {
        res.sendStatus(200);

        if(req.body.object == 'page' && req.body.entry) {
            let data = req.body;
            data.entry.forEach(pageObj => {
                pageObj.messaging.forEach(messageObj =>{
                    if(messageObj.postback){
                        console.log("here is a postback")
                    } else {
                        return cb(this.messageHandler(messageObj));
                    }
                });
            });
        }
    }

    sendMessage(payload){
        return new Promise((resolve, reject) => {
            request({
                uri: `https://graph.facebook.com/${apiVersion}/me/messages`,
                qs: {
                    access_token: this.pageAccessToken
                },
                method: 'POST',
                json: payload
            }, (error, response, body) => {
                if(!error && response.statusCode === 200){
                    resolve({
                        mid: body.message_id,
                        aid: body.attachment_id
                    });
                } else {
                    reject(body.error);
                }
            });
        });
    }

    txt(id, text, messaging_type = 'RESPONSE'){
        let obj = {
            messaging_type,
            recipient: {id},
            message: {text}
        }
        return this.sendMessage(obj)
    }

    img (id, image, messaging_type = 'RESPONSE') {
        let obj={
            messaging_type,
            recipient:{id},
            message:{
                attachment: {
                    type: "image",
                    payload: {
                        url: image,
                        is_reusable: true
                    }
                }
            }
        }
        return this.sendMessage(obj);
    }



    template (id, name, link, image, price, emoji, type, material, sale){
        let obj={
            recipient:{id},
            "message":{
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": name,
                            "image_url": image,
                            "subtitle": `${emoji} | ${type} | ${price}€ ${material} ${sale}`,
                            "default_action": {
                                "type": "web_url",
                                "url": link
                            }
                        }]
                    }
                }
            }
        }
        return this.sendMessage(obj);

    }
}

module.exports = FBeamer;