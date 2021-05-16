const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
	res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
	const stream = fs.createReadStream('./bigindex.html')
  stream.pipe(res)
})
server.listen(3000, () => {
	console.log(`url is http://localhost:${3000}/`)
})