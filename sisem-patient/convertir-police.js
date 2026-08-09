const fs = require('fs');
const https = require('https');

const url = 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf';
const sortie = 'src/app/core/roboto-base64.txt';

https.get(url, (res) => {
  const chunks = [];
  res.on('data', (c) => chunks.push(c));
  res.on('end', () => {
    const base64 = Buffer.concat(chunks).toString('base64');
    fs.writeFileSync(sortie, base64);
    console.log('Police convertie :', sortie, '(' + base64.length + ' caractères)');
  });
}).on('error', (e) => console.error('Erreur:', e.message));