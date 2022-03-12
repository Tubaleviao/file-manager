require('dotenv').config()
const express = require('express')
const http = require('http')
const upio = require('up.io')
const socketIo = require('socket.io')
var ip = require("ip");

const router = require('./routes')
const ioCode = require('./io')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(upio.router)
app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(router)
io.on("connection", ioCode.con)

server.listen(port, () => console.log(`Listening ${ip.address()}:${port}!`))
