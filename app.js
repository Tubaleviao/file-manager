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

const pwd = 

app.get('/*', (req, res) => {
	data = {pwd: JSON.stringify(path.parse(__dirname))}
	res.render('index', data)
})

io.on("connection", function(socket){
    var uploader = new upio()
    uploader.listen(socket)
    console.log("connected")
    fs.readdir(__dirname, function (err, files) {
	    if (err) console.log('Error: ' + err);
	    const files2 = files.map(f => path.join(__dirname, f))
	    socket.emit('files', files2)
	});
	socket.on('path', p => {
		fs.lstat(p, (err, stats) => {
			if(stats.isDirectory()){
				async function check(p2) {
					files = []
					const dir = await fs.promises.opendir(p2);
					for await (const dirent of dir) {
						files.push(path.join(p2, dirent.name));
					}
					return files
				}
				check(p).then(f => socket.emit('files', f)).catch(console.error)
			}else if(stats.isFile()){
				// download file using fs.createWriteStream somehow
			}
		})
		
	})
});

http.listen(port, () => console.log(`Listening on port ${port}!`))