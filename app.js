require('dotenv').config()
const express = require('express')
const http = require('http')
const upio = require('up.io')
const socketIo = require('socket.io')
var ip = require("ip");

const router = require('./routes')
const ioCode = require('./io')

const port = process.env.PORT || 3000
const init = process.env.INITIAL_FOLDER || "initial"
const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(upio.router)
app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(router)
io.on("connection", ioCode.con(init))

server.listen(port, () => console.log(`Listening ${ip.address()}:${port}!`))
