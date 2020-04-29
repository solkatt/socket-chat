// USER DATA //

const users = []

// Join user to chat
function userJoin(id, username, room) {
	const user = {
		id,
		username,
		room,
	}
	if (checkAlreadyJoined(id)) {
		return user
	} else {
		console.log(false)
		users.push(user)
		return user
	}
}

function getAllUsers() {
	return users
}

function displayUsername(user) {
	const username = document.querySelector('.username')
}

function checkAlreadyJoined(id) {
	{
		return users.some(function (user) {
			return user.id === id
		})
	}
}

//Update Rooms Array on Disconnect
function updateRooms(room) {
	let count = 0

	for (var i = 0; i < users.length; i++) {
		if (users[i].room === room) {
			count++
		}
	}
	console.log(count)

	console.log('updateRooms:', count)
}

function updateUserRoom(id, room) {
	for (let i in users) {
		if (users[i].id == id) {
			users[i].room = room
		}
	}
	console.log(users)
}

//Update Rooms Array on Disconnect
function updateRooms(room) {
	let count = 0

	for (var i = 0; i < users.length; i++) {
		if (users[i].room === room) {
			count++
		}
	}

	console.log(count)

	console.log('updateRooms:', count)

	if (count < 1) {
		for (let i = 0; i < rooms.length; i++) {
			if (rooms[i].name == room) {
				rooms.splice(i, 1)
				break
			}
		}
		console.log(rooms)
	}
}

// Get current user
function getCurrentUser(id) {
	return users.find((user) => user.id === id)
}

function userLeave(id) {
	const index = users.findIndex((user) => user.id === id)

	if (index !== -1) {
		return users.splice(index, 1)[0]
	}
}

// Funkar
function getRoomUsers(room) {
	return users.filter((user) => user.room === room)
}

// ROOM DATA //

const rooms = []

// Join user to chat
function addRoom(name, password) {
	const room = {
		name,
		password,
	}
	rooms.push(room)
	return room
}

function getRooms() {
	return rooms
}

function getRoomPassword(room) {
	for (let i = 0; i < rooms.length; i++) {
		if (rooms[i].name === room) {
			return rooms[i].password
		}
	}
}

module.exports = {
	userJoin,
	userLeave,
	getCurrentUser,
	getRoomUsers,
	addRoom,
	updateUserRoom,
	getRooms,
	displayUsername,
	getAllUsers,
	getRoomPassword,
	updateRooms,
	checkAlreadyJoined,
}
