const fs = require("fs");
const { createGzip, gzip } = require("zlib");
const pipGzip = createGzip()

const readable = fs.createReadStream("./big.txt");
const writable = fs.createWriteStream("./big.txt.bat");
const start = Date.now()
console.log('start:', start)

readable.pipe(pipGzip).pipe(writable);
// readable.on('data', (data) => {
//   gzip(data, (_, result) => {
//     writable.write(result)
//   });
// });

readable.on('end', () => {
  const end = Date.now()
  console.log('end:', end)
  console.log('time:', end - start)
})

