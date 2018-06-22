


const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
var async = require('async');
const request = require('request');


const AUTH_TOKEN = '46BE733144A8D37F528041B7505CD7D2'
const FACEBOOK_TOKEN = 'EAACOLZBwSZA94BAGcZBWfdVr6B8MsoDZBB03dsmr1ABaGKbSgZCZBU4ZBg14DRzVR0wGUoZBtO34TZAZAuaq3gaIWb66oA40k4yROSduWxi8a5eDZAPUhqxguBWGa3n3bQZAWsWFwuBTbdNdcmTHutJt9ZCY1MtS9QyyVAwmQISlcQfTm5OwS8eJFUuMc';
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
        console.log('Conexão estabelecida com sucesso.');
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
        switch(messageText.toLowerCase()){
            case 'oi' :
            enviarMenssagemDeTexto(senderID, 'Oi, digite a primeira letra do seu nome.');
            break;

            case 'j' :
            enviarMenssagemDeTexto(senderID, 'humm, Babylene :)');
            break;

            case 'm' :
            enviarMenssagemDeTexto(senderID, 'Opa Marcão ;)');
            break;

            case 'ajuda' :
            enviarMenssagemDeTexto(senderID, 'Abaixo algumas opções quem pode te ajudar.');
            break;

            case 'tchau' :
            enviarMenssagemDeTexto(senderID, 'Tchau, volte quando quiser! ;)');
            break;

            default :
            enviarMenssagemDeTexto(senderID, 'Tente ser mais objetivo, se quiser digite ajuda.');
            break;
        }
    }else if(anexo){
        console.log('Legal acabei de receber anexos.');
        enviarMenssagemDeTexto(senderID, '(y)');
    }


}


function chamarEnviarMenssagemApi(messageData){
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

    chamarEnviarMenssagemApi(messageData);
}

