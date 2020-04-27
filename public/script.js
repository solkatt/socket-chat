// Kanske kan flyttas någonstans bättre
// const roomName = document.querySelector('#rooms')
const userList = document.querySelector('#userList')

const roomList = document.querySelector('.roomsContainerStartPage')

const socket = io()

window.addEventListener('load', () => {
	setupEventListeners()
	reloadRoomList()
})

function setupEventListeners() {
	//GO to create Rooom
	const goToCreateRoomPageButton = document.querySelector(
		'.goToCreateRoomPageButton'
	)
	goToCreateRoomPageButton.addEventListener('click', loadCreateRoomUI)

	//Create Room Handler
	const createRoomBtn = document.querySelector('.createRoomButton')
	createRoomBtn.addEventListener('click', onCreateRoom)

	// Send message submit handler
	const messageForm = document.querySelector('.messageBox form')
	messageForm.addEventListener('submit', onSendMessage)

	/// Join Room Button
	const joinRoomButtons = document.querySelectorAll('.joinRoomButton')
	joinRoomButtons.forEach((joinRoomButton) => {
		joinRoomButton.addEventListener('click', () => {
			joinActiveRoom(joinRoomButton)
		})
	})

	// Output Room List

	// Socket io events
	socket.on('load room list', loadRoomList)
	socket.on('room created', loadJoin)
	///
	socket.on('join successful', loadChatUI)
	socket.on('message', onMessageReceived)
	socket.on('roomUsers', ({ room, users }) => {
		outputRooms(room)
		outputUsers(users)
	})
}

function loadRoomList({ rooms }) {
	console.log('LOAD ROOMS')
	console.log(rooms)

	const roomObject = document.createElement('div')

	roomObject.innerHTML = `
	${rooms
		.map(
			(room) => `
			<div class="roomDiv">
      <p>	${room.name}</p>
      <button class="joinRoomButton">Join</button>
       </div>`
		)
		.join('')}`

	roomList.append(roomObject)
}

function reloadRoomList() {
	socket.emit('reload room list')
}

function joinActiveRoom(event, joinRoomButton) {
	event.preventDefault()

	console.log('hej från join active room')

	const userNameInput = document.querySelector('.chooseUsername')

	// Save User to Users Array
	const name = userNameInput.value
	const room = joinRoomButton.innerHTML

	// socket.emit('join app', {
	// 	name,
	// 	room,
	// })

	if (userNameInput.value == '') {
		alert('Enter username!')
	} else {
		document.querySelector('.startPageContainer').classList.add('hidden')
		document
			.querySelector('.createRoomContainer')
			.classList.remove('hidden')
	}

	socket.emit('join room', { name, room })
}

function loadCreateRoomUI(event) {
	event.preventDefault()

	const userNameInput = document.querySelector('.chooseUsername')

	// Save User to Users Array
	const name = userNameInput.value
	const room = ''

	socket.emit('join app', {
		name,
		room,
	})

	if (userNameInput.value == '') {
		alert('Enter username!')
	} else {
		document.querySelector('.startPageContainer').classList.add('hidden')
		document
			.querySelector('.createRoomContainer')
			.classList.remove('hidden')
	}
}

/// ON CREATE ROOM ////////

function onCreateRoom(event) {
	event.preventDefault()

	console.log('Hej från onCreateRoom')

	const roomInput = document.querySelector('.chooseRoomName')
	const room = roomInput.value

	const passwordInput = document.querySelector('.inputPassword')
	const password = passwordInput.value

	/// Validate
	if (room == '') {
		alert('Enter roomname!')
	} else {
		document.querySelector('.createRoomContainer').classList.add('hidden')
		document.querySelector('.chatContainer').classList.remove('hidden')

		socket.emit('create room', {
			room,
			password,
		})
	}

	console.log(`Rumnamn: ${room}  Lösenord: ${password}`)
}

///

function loadJoin(name, room) {
	onJoinRoom(name, room)
}

//// ON JOIN ROOM

function onJoinRoom(name, room) {
	event.preventDefault()
	// const [nameInput, roomInput] = document.querySelectorAll(".join.ui input");

	// const name = nameInput.value;
	// const room = roomInput.value
	socket.emit('join room', { name, room })
	// socket.emit("join room", name);
}

function loadChatUI(data) {
	console.log(`Från script > loadChatUI: ${data}`)
	// socket.emit("join room", name);

	const rooms = document.querySelector('#rooms')
	const room = document.createElement('div')
	room.classList.add('roomObject')
	room.innerHTML = `
	<h4 class="roomTitle">${data}</h4>
	<i class="fas fa-lock lockIcon"></i>
	`
	rooms.appendChild(room)
}

function onSendMessage(event) {
	event.preventDefault()

	//Get Message text
	const input = document.querySelector('.messageBox form input')

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

	ul.scrollTop = ul.scrollHeight
}

// Add room name to DOM
function outputRooms(room) {
	// roomName.innerText = room;
	console.log(room)
}

//Add users to DOM
function outputUsers(users) {
	console.log(users)
	const user = document.createElement('div')

	user.innerHTML = `
	${users
		.map(
			(user) => `
			<div class="userObject">
			<i class="fas fa-user userIcon"></i>
			<h4 class="userTitle">	${user.username}
			</h4> </div>`
		)
		.join('')}`

	userList.append(user)
}
