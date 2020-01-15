const express = require('express')
const app = express()
const upio = require('up.io')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const fs = require('fs')
const port = 3000

app.use(upio.router);
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/*', (req, res) => {
	console.log(req.params)
	data = {pwd: __dirname}// .replace(/\\/g,'\\\\')
	res.render('index', data)
})

io.on("connection", function(socket){
    var uploader = new upio()
    uploader.listen(socket)
    console.log("connected")
    fs.readdir(__dirname, function (err, files) {
	    if (err) console.log('Error: ' + err);
	    socket.emit('files', files)
	});
	socket.on('path', p => {
		if(fs.lstatSync(p).isDirectory()){
			fs.readdir(__dirname, function (err, files) {
			    if (err) console.log('Error: ' + err);
			    socket.emit('files', files)
			});
		}
	})
});

http.listen(port, () => console.log(`Listening on port ${port}!`))