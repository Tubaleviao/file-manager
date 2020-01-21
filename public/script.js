$(function() {
	const { fromEvent } = rxjs;
	let dir = getDir()
	var socket = io();

	const clicks = fromEvent(document, 'click');
	clicks.subscribe(x => {
		x.preventDefault();
		if(x.target.localName == "a"){
			if(x.target.className == "dir") socket.emit('path', x.target.getAttribute('href'))
			// else fetch()
		}
	});

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