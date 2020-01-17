$(function() {
	const { fromEvent } = rxjs;
	let {dir, base} = getPwd()
	var socket = io();

	const clicks = fromEvent(document, 'click');
	clicks.subscribe(x => {
		if(x.target.localName == "a"){
			x.preventDefault();
			socket.emit('path', x.target.getAttribute('href'))
			console.log(x.target.getAttribute('href'))
		}
	});

	socket.on('files', data => {
		$('.files').empty()
		data.forEach(f => {
			console.log(f)
			let link = $('<a>').attr('href', f).append(f)
			$('.files').append(link)
		})
	})
})