function handle(input) {
	if (input.files && input.files[0]) {
		const file = input.files[0]
		console.log("worked "+file.name)
		document.getElementsByClassName('progress')[0].replaceChildren()
	} else {
		console.log("remove upload")
	}
}

$(function() {
	const { fromEvent } = Rx.Observable;
	let dir = getDir()
	var socket = io();
	var uploader = new UpIoFileUpload(socket)
	uploader.chunkSize = 1024 * 200;
	uploader.listenInput(document.getElementById("inp"))
	uploader.listenInput(document.getElementById("inpwholepage"))
	var progressText = document.getElementsByClassName('progress')[0]
	const clicks = fromEvent(document, 'click');

	document.getElementById("inpwholepage").style.display = "none";

	$(document).bind({
		dragenter: function(e) {
			e.preventDefault();
			addEventListener('dragenter', () => document.getElementById("inpwholepage").style.display = "block")
		},
		dragleave: function(e) {
			document.getElementById('inpwholepage').addEventListener('dragleave', unchangeDragDisplay)
		},
		drop: function() {
			addEventListener('drop', unchangeDragDisplay)
		}
	})
	
	function unchangeDragDisplay(e) {
		document.getElementById("inpwholepage").style.display = "none";
	}

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
		if(x.target.localName == "a"){
			x.preventDefault()
			const file = x.target.getAttribute('href')
			if(x.target.className == "dir") socket.emit('path', file)
			else donwload(file, file.split('\\').last())
		}
	});

	socket.on('files', data => {		
		let parent = $('<a>').attr('href', data.parent).addClass('dir').append('../')
		$('.files').empty()
		data.files.forEach(f => {
			let link = $('<a>').attr('href', f.path).append(f.name)
			if(f.isFile) $('.files').append(link.addClass('file')) 
			else $('.files').prepend(link.addClass('dir')) 
		})
		$('.files').prepend(parent)
		dir = data.location
		$('.root').empty()
		$('.root').append($('<a>').attr('href', dir).addClass('dir').append(dir))
	})
	socket.on("up_completed", function(data){
		var progressTextUpdate = document.getElementsByClassName(`UploadId`+data.file_id)[0]
		progressTextUpdate.innerText = `${data.file_name}:100% - Completed`
		socket.emit('path', dir)
	});
	socket.on('up_started', function(data){
		console.log("File id which started: "+data.id);
		var newProgressText = document.createElement('div')
		newProgressText.className = `UploadId${data.id}`
		progressText.appendChild(newProgressText)
	})
	socket.on('up_progress', function(data){
		var progressTextUpdate = document.getElementsByClassName(`UploadId`+data.file_id)[0]
		progressTextUpdate.innerText = `${data.file_name}:${(data.percent * 100)}%`
	})
	socket.emit('path', dir)
})