const fs = require('fs');

const chemin = 'public/logo.png';       // le logo copié dans public
const image = fs.readFileSync(chemin);
const base64 = image.toString('base64');

const contenu = `export const logoBase64 = 'data:image/png;base64,${base64}';\n`;
fs.writeFileSync('src/app/core/logo-base64.ts', contenu);

console.log('Logo converti ! ' + base64.length + ' caractères');