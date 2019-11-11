const GoogleSpreadsheet = require('google-spreadsheet');
const credentials = require('./bugTracker.json');
const { promisify} = require('util');


const addRowToSheet = async(data) => {
    const doc = new GoogleSpreadsheet('189MHR2xTjLFnXIHZ0y-Tp9ooXuUPrye61fu3vr54EQo');
    await promisify(doc.useServiceAccountAuth)(credentials);
    console.log('planilha aberta');
    const info = await promisify(doc.getInfo)();
    const worksheet = info.worksheets[0];
    await promisify(worksheet.addRow)({...data});
}

addRowToSheet({name: 'Fabio', email: 'Teste'});

/*
const doc = new GoogleSpreadsheet('189MHR2xTjLFnXIHZ0y-Tp9ooXuUPrye61fu3vr54EQo');

doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('planilha aberta');
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0];
            worksheet.addRow({name: 'Fabio', email: 'Teste'}, (err) => {
                console.log('linha inserida');
            });
        })
    }
})*/