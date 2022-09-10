const express = require('express')
const {join} = require('path')
const fs = require('fs')

const route = express.Router()
const init = join(__dirname, ...(process.env.INITIAL_FOLDER || "initial").split("/"))

route.get('/*', (req, res) => {
	data = {dir: JSON.stringify(init), parent: JSON.stringify(join('..',init))}
	res.render('index', data)
})
route.post('/download', (req,res) => {
    fs.createReadStream(req.body.path).pipe(res)
})

module.exports = route
