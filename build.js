const fs = require('fs');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY');
    process.exit(1);
}

fs.writeFileSync('config.js', `window.SUPABASE_URL = "${url}";\nwindow.SUPABASE_KEY = "${key}";\n`);
console.log('config.js written');
