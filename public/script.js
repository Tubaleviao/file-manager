$(function() {
	const { fromEvent } = rxjs;
	var socket = io();

	const clicks = fromEvent(document, 'click');
	clicks.subscribe(x => {
		x.preventDefault();
		socket.emit('path', x.target.getAttribute('href'))
		console.log(x.target.getAttribute('href'))
	});

	socket.on('files', data => {
		console.log(data)
		data.forEach(f => {
			console.log(getPwd())
			let link = $('<a>').attr('href', getPwd().replace(/\\/g, '\\\\')+'\\'+f).append(f)
			$('body').append(link)
		})
	})
})