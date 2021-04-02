'use strict'

const crypto = require('crypto');
const request = require('request');
const apiVersion = 'v9.0';

class FBeamer {
    constructor({ pageAccessToken, VerifyToken, appSecret }) {
        if (pageAccessToken == null | VerifyToken == null | appSecret) {
            throw new Error("Null argument(s) in FBeamer")
        } else {
            this.pageAccessToken = pageAccessToken;
            this.VerifyToken = VerifyToken;
            this.appSecret = appSecret;
        }
    }

    registerHook(req, res) {
        const params = req.query
        const mode = params['hub.mode']
        const token = params['hub.verify_token']
        const challenge = params['hub.challenge']
        try {
            if (mode === 'subscribe' & token === this.VerifyToken) {
                console.log('WebHook registered')
                return res.send(challenge);
            } else {
                console.log("Could not register webhook!");
                return res.sendStatus(200);
            }
        } catch (e) {
            console.log(e)
        }
    }

    verifySignature(req, res, buf) {
        return (req, res, buf) => {
            if (req.method === 'POST') {
                try {
                    let tempo_hash = crypto.createHmac('sha1', this.appSecret).update(buf, 'utf-8')
                    let hash = tempo_hash.digest('hex')
                    if ('sha1=' + hash == req.header('x-hub-signature')) {
                        return true
                    }
                    else {
                        return false
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    messageHandler(obj) {
        let sender = obj.sender.id;
        let message = obj.message;
        if (message.text) {
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

        if (req.body.object == 'page' && req.body.entry) {
            let data = req.body;
            data.entry.forEach(pageObj => {
                pageObj.messaging.forEach(messageObj => {
                    if (messageObj.postback) {
                    } else {
                        return cb(this.messageHandler(messageObj));
                    }
                });
            });
        }
    }

    sleep = delay => {
        return new Promise(function (resolve) {
            setTimeout(resolve, delay);
        });
    };

    sendMessage(payload) {
        return new Promise((resolve, reject) => {
            request({
                uri: `https://graph.facebook.com/${apiVersion}/me/messages`,
                qs: {
                    access_token: this.pageAccessToken
                },
                method: 'POST',
                json: payload
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    this.sleep(300).then(res => {
                        resolve({
                            mid: body.message_id,
                            aid: body.attachment_id
                        });
                    })

                } else {
                    reject(body.error);
                }
            });
        });
    }

    txt(id, text, messaging_type = 'RESPONSE') {
        let obj = {
            messaging_type,
            recipient: { id },
            message: { text }
        }
        return this.sendMessage(obj)
    }

    img(id, image, messaging_type = 'RESPONSE') {
        let obj = {
            messaging_type,
            recipient: { id },
            message: {
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

    template(id, name, link, image, price, emoji, type, material, sale) {
        let obj = {
            recipient: { id },
            "message": {
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

    quick_replies_start_conv(id, text, messaging_type = 'RESPONSE') {
        let obj = {
            messaging_type,
            recipient: { id },
            message: {
                'text': text,
                'quick_replies': [
                    {
                        "content_type": "text",
                        "title": "Products",
                        "payload": "THIS IS A TEST PRODUCTS",
                        "image_url": "https://images.unsplash.com/photo-1562157873-818bc0726f68?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=564&q=80"
                    },

                    {
                        "content_type": "text",
                        "title": "Products for women",
                        "payload": "THIS IS A TEST PRODUCTS",
                        "image_url": "https://images.unsplash.com/photo-1581404917879-53e19259fdda?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80"
                    },

                    {
                        "content_type": "text",
                        "title": "Products for men",
                        "payload": "THIS IS A TEST PRODUCTS",
                        "image_url": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1351&q=80"
                    },

                    {
                        "content_type": "text",
                        "title": "Products for kids",
                        "payload": "THIS IS A TEST PRODUCTS",
                        "image_url": "https://images.unsplash.com/photo-1476234251651-f353703a034d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                    }
                ]
            }
        }
        return this.sendMessage(obj)
    }
}

module.exports = FBeamer;