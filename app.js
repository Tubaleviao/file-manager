const express = require('express')
const app = express()
const upio = require('up.io')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const fs = require('fs')
const path = require('path')
const port = 3000

app.use(upio.router);
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/*', (req, res) => {
	data = {dir: JSON.stringify(__dirname), parent: JSON.stringify(path.parse(__dirname).dir)}
	res.render('index', data)
})

io.on("connection", async socket => {
    var uploader = new upio()
    uploader.listen(socket)
    console.log("connected")
	
	socket.on('path', async location => {
		const files = []
		let parent = path.parse(location).dir
		const dir = await fs.promises.opendir(location);
		for await (const f of dir) files.push({
			name: f.name,
			path: path.join(location, f.name), 
			isFile: f.isFile(),
		})
		socket.emit('files', {files, location, parent})
	})
});

http.listen(port, () => console.log(`Listening on port ${port}!`))