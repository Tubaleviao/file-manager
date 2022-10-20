const express = require('express')
const {join} = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')

const route = express.Router()
const init = join(__dirname, ...(process.env.INITIAL_FOLDER || "initial").split("/"))

route.get('/', checkAuthenticated, (req, res) => {
	data = {dir: JSON.stringify(init), parent: JSON.stringify(join('..',init))}
	res.render('index', data)
})
route.post('/download', checkAuthenticated, (req,res) => {
    fs.createReadStream(req.body.path).pipe(res)
})

const passport = require('passport')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)


route.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('login.ejs')
  })
  
route.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}))
  
route.get('/register', checkNotAuthenticated, (req, res) => {
	res.render('register.ejs')
})
  
const users = []

route.post('/register', checkNotAuthenticated, async (req, res) => {
	try {
	  const hashedPassword = await bcrypt.hash(req.body.password, 10)
	  users.push({
		id: Date.now().toString(),
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword
	  })
	  res.redirect('/login')
	} catch {
	  res.redirect('/register')
	}
})

route.post('/logout', (req, res) => {
	req.logOut()
	res.redirect('/login')
})
  
function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
	  return next()
	}  
	res.redirect('/login')
}
  
function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
	  return res.redirect('/')
	}
	next()
}

module.exports = route
