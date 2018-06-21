const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');


const AUTH_TOKEN = 'EAAXGyqspLvEBAHpdSstLwGkYFDaBNmsfPzjrnEtEHbYk2hzJZBbECv37FZAPVZBRqYDZC8Iw365vjpl5tTFrwJ9xhMEw6bmtiP6y8iTNvsZBZARPs03JAeCWBtpbRjzpKQNxslBOtQDpzZCobklwTUrxe7ZB5dfqB0el3ZCCJ3FrM0Gc7V2PsCq2L';

var app = express();

app.use(bodyParser.json());
app.listen(3000, (req, resp) =>{
    console.log('Servidor inciado na porta 3000');
});


app.get('/', (req, resp) =>{
    resp.send('Muito bem mogoloide.');
});

app.get('/webhook', (req, resp) =>{
    if(req.query['hub.verify_token'] === '46BE733144A8D37F528041B7505CD7D2'){
        resp.send(req.query['hub.challenge']);
    }else{
        resp.sendStatus(404);
    }
    
});

app.post('/webhook', (req, resp) =>{
    var data = req.body;
    console.log(data);
    
    resp.sendStatus(200);
});