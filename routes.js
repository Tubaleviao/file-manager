const express = require('express')
const path = require('path')
const fs = require('fs')

const route = express.Router()

route.get('/*', (req, res) => {
	data = {dir: JSON.stringify(__dirname), parent: JSON.stringify(path.parse(__dirname).dir)}
	res.render('index', data)
})
route.post('/download', (req,res) => {
    fs.createReadStream(req.body.path).pipe(res)
})

module.exports = route