const fs = require("fs");
const start = Date.now()
console.log('start:', start)
let num = 0

const readable = fs.createReadStream("./big.txt");
readable.on('readable', () => {
  let d = null
  while(d = readable.read(1024)) { // 会将当前缓冲区数据合并读取
    console.log('read data:', d.length, num++)
  }
  console.log('------------------:readable event !!!')
})

// readable.on('data', (data) => {
//   console.log('on data: ', data.length, num++)
// });

readable.on('end', () => {
  const end = Date.now()
  console.log('end:', end)
  console.log('time:', end - start)
})

