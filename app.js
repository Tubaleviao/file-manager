const app = require('express')()
const upio = require('up.io')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = 3000

app.use(upio.router);
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
	data = {pwd: __dirname}
	res.render('index', data)
})

io.on("connection", function(socket){
    var uploader = new upio()
    uploader.listen(socket)
});

http.listen(port, () => console.log(`Listening on port ${port}!`))