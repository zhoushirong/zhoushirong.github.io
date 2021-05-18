const gzip = require('zlib').createGzip();
const fs = require('fs');

const inp = fs.createReadStream('./big.txt');
const out = fs.createWriteStream('./big.txt.gz');

inp.pipe(gzip).pipe(out);