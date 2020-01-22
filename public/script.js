$(function() {
	const { fromEvent } = rxjs;
	let dir = getDir()
	var socket = io();

	const clicks = fromEvent(document, 'click');
	clicks.subscribe(x => {
		x.preventDefault();
		if(x.target.localName == "a"){
			if(x.target.className == "dir") socket.emit('path', x.target.getAttribute('href'))
			else {
				const body = JSON.stringify({path: x.target.getAttribute('href')})
				const headers = {'Content-Type': 'application/json'}
				const method = 'POST'
				fetch('/download', {method, headers, body}).then(res => {
					function unencrypt(){
						return new Uint8Array()
					}
					const fileStream = streamSaver.createWriteStream('filename.txt')
					const writer = fileStream.getWriter()

					const reader = res.body.getReader()
					const pump = () => reader.read()
						.then(({ value, done }) => {
							let chunk = unencrypt(value)
							writer.write(chunk) // returns a promi
							return writer.ready.then(pump)
						})
					pump().then(() =>
						console.log('Closed the stream, Done writing')
					)
				})
			}
		}
	});

	$('.root').append($('<a>').attr('href', dir).addClass('dir').append(dir))

	socket.on('files', data => {
		$('.files').empty()
		console.log(data.location)
		let parent = $('<a>').attr('href', data.parent).addClass('dir').append('../')
		$('.files').append(parent)
		data.files.forEach(f => {
			let link = $('<a>').attr('href', f.path).addClass(f.isFile ? 'file' : 'dir').append(f.name)
			$('.files').append(link)
		})
	})
	socket.emit('path', dir)
})