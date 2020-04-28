////////// USER DATA //////////////

const users = []

// Join user to chat
function userJoin(id, username, room) {
	const user = {
		id,
		username,
		room,
	}
	users.push(user)
	return user
}

// Get current user
function updateUserRoom(id, room) {
	// const index = users.findIndex((user) => user.id === id);
	// console.log(index)
	//  users[index].room = room

	// test
	for (let i in users) {
		if (users[i].id == id) {
			users[i].room = room
		}
	}
	// users.push(user)
	console.log(users)
}

// Get current user
function getCurrentUser(id) {
	console.log(users)

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

////////// ROOM DATA //////////////

const rooms = [
	{
		name: 'TestRumNamn',
		password: 'TestPassword',
	},
]

// Join user to chat
function addRoom(name, password) {
	const room = {
		name,
		password,
	}
	// room.clients.push(user)
	rooms.push(room)
	return room
}

function getRooms() {
	return rooms
}

// function getRoomUsers(room) {

//   return rooms.filter((user) => user.room === room);
// }

module.exports = {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
	addRoom,
	updateUserRoom,
	getRooms,
}
