const {existsSync, mkdirSync, readdir} = require('fs')
const upio = require('up.io')
const path = require('path')

module.exports.con = (init) => async socket => {
    var uploader = new upio()
    if (!existsSync(init)) mkdirSync(init, { recursive: true })
    uploader.dir = init;
    uploader.listen(socket)
    console.log("connected")
	
	socket.on('path', async location => {
		const files = []
		uploader.dir = path.join(uploader.dir, path.relative(uploader.dir, location))
		let parent = path.parse(location).dir
		readdir(location, {withFileTypes: true}, (err, dir) => {
			for (const f of dir) files.push({
				name: f.name,
				path: path.join(location, f.name), 
				isFile: f.isFile(),
			})
			socket.emit('files', {files, location, parent})
		})
	})
}
