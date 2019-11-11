const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { promisify} = require('util');
const sgMail = require('@sendgrid/mail');

const GoogleSpreadsheet = require('google-spreadsheet');
const credentials = require('./bugTracker.json');

const app = express();

app.set('view engine', 'ejs' );
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.render('home');
});


//config
const docId = '189MHR2xTjLFnXIHZ0y-Tp9ooXuUPrye61fu3vr54EQo';
const worksheetIndex = 0;
const sendGridKey = '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';

app.post('/', async (req, res) => {
    try{
        const doc = new GoogleSpreadsheet(docId);
        await promisify(doc.useServiceAccountAuth)(credentials);
        console.log('planilha aberta');
        const info = await promisify(doc.getInfo)();    
        const worksheet = info.worksheets[worksheetIndex];
        await promisify(worksheet.addRow)({...req.body, source: req.query.source || 'direct'});

        //se for critico
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        if (req.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey);
            const msg = {
                to: 'fabio@glcconsultoria.com.br',
                from: 'fabio@glcconsultoria.com.br',
                subject: 'BUG Critico Reportado',
                text: `O usuário ${req.body.name} reportou um problema.`,
                html: `O usuário ${req.body.name} reportou um problema.`
            };
            await sgMail.send(msg); 
        }
        
       
       
        res.render('sucesso');
    } catch (err) {
        Response.send('Erro ao enviar formulário');
        console.log(err);
    }   
});

app.listen(3000, (err) => {
    if (err) {
        console.log('Aconteceu um erro',err)
    } else {
        console.log('Bug tracker');
    }
});