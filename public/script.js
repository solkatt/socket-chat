const socket = io()

window.addEventListener('load', () => {
	setupEventListeners()
})

function setupEventListeners() {
	// Join submit handler
	const joinForm = document.querySelector('form.join.ui')
	joinForm.addEventListener('submit', onJoinRoom)

	// Send message submit hander
	const messageForm = document.querySelector('.chat.ui form')
	messageForm.addEventListener('submit', onSendMessage)

	// Socket io events
	socket.on('join successful', loadChatUI)
	socket.on('message', onMessageReceived)
}

function onJoinRoom(event) {
	event.preventDefault()
	const [nameInput, roomInput] = document.querySelectorAll('.join.ui input')

	const name = nameInput.value
	const room = roomInput.value

	socket.emit('join room', { name, room })
}

function onSendMessage(event) {
	event.preventDefault()

	//Get Message text
	const input = document.querySelector('.chat.ui form input')
	
	// Emit Message to server
	socket.emit('message', input.value)
	input.value = ''
}

function loadChatUI(data) {
	document.querySelector('.join.ui').classList.add('hidden')
	document.querySelector('.chat.ui').classList.remove('hidden')

	////
	const rooms = document.querySelector('#rooms')
	const room = document.createElement('div')
	room.classList.add('room')
	room.innerHTML = `<h4>${data}</h4>`
	rooms.appendChild(room)

}

function onMessageReceived({ name, message }) {
	const ul = document.querySelector('ul')
	const li = document.createElement('li')
	li.classList.add('message')
	li.innerText = `${name}: ${message}`
	ul.append(li)
}
