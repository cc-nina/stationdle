const fs = require('fs');
require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
const cartoKey = process.env.CARTO_API_KEY;

if (!url || !key || !cartoKey) {
    console.error('Missing SUPABASE_URL, SUPABASE_KEY, or CARTO_API_KEY');
    process.exit(1);
}

fs.writeFileSync('config.js',
    `window.SUPABASE_URL = ${JSON.stringify(url)};\n` +
    `window.SUPABASE_KEY = ${JSON.stringify(key)};\n` +
    `window.CARTO_API_KEY = ${JSON.stringify(cartoKey)};\n`
);
console.log('config.js written');
