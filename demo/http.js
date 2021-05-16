const http = require('http')
const fs = require('fs')
const server = http.createServer((req, res) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/html')
	fs.readFile('./bigindex.html', 'utf8', (err, data) => {
		if (err) {
			console.log(err)
		}
		res.end(data)
	})
})
server.listen(3000, () => {
	console.log(`url is http://localhost:${3000}/`)
})