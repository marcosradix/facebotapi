


const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
var async = require('async');
const request = require('request');


const AUTH_TOKEN = '46BE733144A8D37F528041B7505CD7D2'
const FACEBOOK_TOKEN = 'EAAZA8zFKWjScBAIi0GZBjf0b6ZASo7DMJHKZACGh46XFou7J08ahYHzmQAibffIf7IMfJ9jm7ZAIclYTdN6CXv4qCLw7reQFbA7MAJSvmPCT36uaE4DYbml3OXpEZAYEAT7uASEr6sZCkUraLZB9J2VKnhhw2kUbC0ztEZAdYG6VX6yX0Vkcy3y8f';
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.listen(3000, (req, resp) =>{
    console.log('Servidor inciado na porta 3000');
});


app.get('/', (req, resp) =>{
    resp.send('Muito bem mogoloide.');
});

app.get('/webhook', (req, resp) =>{
    if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === AUTH_TOKEN){
        resp.status(200).send(req.query['hub.challenge']);
    }else{
        console.log('Erro de validação');
        resp.sendStatus(403);
    }
    
});

app.post('/webhook', (req, resp) =>{
    var data = req.body;
    if(data && data.object === 'page'){
        data.entry.forEach((entry) => {
            var pageID = entry.id;
            var timeOf = entry.time;

            entry.messaging.forEach((event)=>{
                if(event.message){
                    trataMensagem(event);
                }
            });
        });

        resp.sendStatus(200);
    }

    
});

function trataMensagem(event){
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    var messageID = message.mid;
    var messageText = message.text;
    var anexo = message.attachments;

    console.log('Mensagem recebida do usuário %d pela página %d',senderID, recipientID );
    
    console.log('Wormade company %s',messageID );
    console.log('Wormade company %s',messageText );

    if(messageText){
        switch(messageText){
            case 'oi' :
            enviarMenssagemDeTexto(senderID, 'Opa, tudo em ordem por aqui!');
            break;

            case 'tchau' :
            
            break;

            default :
            break;
        }
    }else if(anexo){
        console.log('Legal acabei de receber anexos.');
    }


}


function chamarEnviarApi(messageData){
    request({
        uri:'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: FACEBOOK_TOKEN},
        method: 'POST',
        json: messageData
    }, (erro, response, body)=>{
        if(!erro && response.statusCode == 200){
            console.log("mensagem enviada com sucesso! ");
            var recipientID = body.recipient_id;
            var messageID  = body.message_id;

        }else{
            console.log("não foi possível enviar a menssagem. ", erro);
        }
    });
}

function enviarMenssagemDeTexto(recipientID, messageText){
    var messageData = {
        recipient:{
            id: recipientID
        },
        message: {
            text : messageText
        }
    };

    chamarEnviarApi(messageData);
}

