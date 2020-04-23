// Kanske kan flyttas någonstans bättre
// const roomName = document.querySelector('#rooms')
const userList = document.querySelector('#users')



//
const socket = io()

window.addEventListener('load', () => {
	setupEventListeners()
})

function setupEventListeners() {
	// Join submit handler
	const joinForm = document.querySelector('form.join.ui')
	joinForm.addEventListener('submit', onJoinRoom)

	// Send message submit handler
	const messageForm = document.querySelector('.chat form')
	messageForm.addEventListener('submit', onSendMessage)

	// Socket io events
	socket.on('join successful', loadChatUI)
	socket.on('message', onMessageReceived)
	socket.on('roomUsers', ({room, users}) => {
		outputRoomName(room)
		outputUsers(users)

	})
}

function onJoinRoom(event) {
	event.preventDefault()
	const [nameInput, roomInput] = document.querySelectorAll('.join.ui input')

	const name = nameInput.value
	const room = roomInput.value

	socket.emit('join room', { name, room })
}

function loadChatUI(data) {
	document.querySelector('.startPageContainer').classList.add('hidden')
	document.querySelector('.chatContainer').classList.remove('hidden')

	////
	const rooms = document.querySelector('#rooms')
	const room = document.createElement('div')
	room.classList.add('room')
	room.innerHTML = `<h4>${data}</h4>`
	rooms.appendChild(room)

}


function onSendMessage(event) {
	event.preventDefault()

	//Get Message text
	const input = document.querySelector('.chat.ui form input')
	
	// Emit Message to server
	socket.emit('message', input.value)
	input.value = ''
}


function onMessageReceived({ name, message }) {
	const ul = document.querySelector('ul')
	const li = document.createElement('li')
	li.classList.add('message')
	li.innerText = `${name}: ${message}`
	ul.append(li)

	ul.scrollTop = ul.scrollHeight;
}


// Add room name to DOM
function outputRoomName(room) {
	// roomName.innerText = room;
	console.log(room)
}

//Add users to DOM
function outputUsers (users) {
	console.log(users)
	const user = document.createElement('div')

	user.innerHTML = `
	${users.map(user => `<h3>${user.username}</h3>`).join('')}
	`
	userList.append(user)
}