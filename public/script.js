$(function() {
	const { fromEvent } = rxjs;
	let dir = getDir()
	var socket = io();
	const clicks = fromEvent(document, 'click');

	Array.prototype.last = function(){
        return this[this.length - 1];
    };

	const donwload = (path, file) => {
		const body = JSON.stringify({path})
		const headers = {'Content-Type': 'application/json'}
		const method = 'POST'
		const fileStream = streamSaver.createWriteStream(file)
		fetch('/download', {method, headers, body}).then(res => {
			const readableStream = res.body
			if (window.WritableStream && readableStream.pipeTo) {
				return readableStream.pipeTo(fileStream)
				.then(() => console.log('Downloaded '+file))
			}else console.log("doesn't support that stuff")
		})
	}

	clicks.subscribe(x => {
		x.preventDefault();
		if(x.target.localName == "a"){
			const file = x.target.getAttribute('href')
			if(x.target.className == "dir") socket.emit('path', file)
			else donwload(file, file.split('\\').last())
		}
	});

	$('.root').append($('<a>').attr('href', dir).addClass('dir').append(dir))

	socket.on('files', data => {
		let parent = $('<a>').attr('href', data.parent).addClass('dir').append('../')
		$('.files').empty()
		data.files.forEach(f => {
			let link = $('<a>').attr('href', f.path).append(f.name)
			if(f.isFile) $('.files').append(link.addClass('file')) 
			else $('.files').prepend(link.addClass('dir')) 
		})
		$('.files').prepend(parent)
	})
	socket.emit('path', dir)
})