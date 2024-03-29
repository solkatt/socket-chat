const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const port = 3000

const server = http.createServer(app)
const io = socketIO(server)

//Set static folder
app.use(express.static('public'))

/// Modules
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
	addRoom,
	updateUserRoom,
	getRooms,
	getAllUsers,
	getRoomPassword,
	updateRooms,
	checkAlreadyJoined,
} = require('./utils/data')



io.on('connection', (socket) => {
	console.log('Client connected: ', socket.id)

	socket.on('reload room list', () => {
		socket.emit('load room list', { rooms: getRooms() })
	})
	// USER JOIN CHATAPP
	socket.on('join app', (data) => {
		const user = userJoin(socket.id, data.name, data.room)
		console.log(`Username: ${data.name}`)
	})

	// CREATE ROOM
	socket.on('create room', (data) => {
		const user = getCurrentUser(socket.id)
		const allUsers = getAllUsers()
		const room = addRoom(data.room, data.password)
		
		updateUserRoom(socket.id, data.room)

		io.to(socket.id).emit('room created', user.username, user.room)
	})

	socket.on('check password', (data) => {
		const roomPW = getRoomPassword(data.room)
		const name = data.name
		const room = data.room

		if (roomPW) {
			io.to(socket.id).emit('prompt password', { name, room, roomPW })
		} else {
			io.to(socket.id).emit('join w/o pw', { name, room })
		}
	})
	// JOIN ROOM
	socket.on('join room', (data) => {
		const users = getAllUsers()

		let user = userJoin(socket.id, data.name, data.room)
		console.log('Current User: ', user)
		console.log('All users: ', users)

		const roomPW = getRoomPassword(data.room)

		socket.join(user.room, () => {
			// Respond to client that join was successful
			io.to(socket.id).emit('join successful', user)

			//Broadcast message to all clients in the room *Viktor has joined the room*
			io.to(user.room).emit('message', {
				// boradcast style
				name: user.username,
				message: 'has joined the room! ',
			})
		})

		// MESSAGE
		socket.on('message', (message) => {
			//Broadcast message to all clients in the room
			io.to(user.room).emit('message', {
				name: user.username,
				message,
			})
		})

		//SEND USERS AND ROOM INFO
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room),
		})

		// DISCONNECT
		socket.on('disconnect', () => {
			const userRoom = getCurrentUser(socket.id).room
			const user = userLeave(socket.id)
			const allUsers = getAllUsers()

			//Skicka in userRoom till updateRooms()
			const countInRoom = updateRooms(userRoom)

			if (user) {
				io.to(user.room).emit('message', {
					name: user.username,
					message: 'has left the chat',
				})

				//Checkif Rooms Array isEmpty & Update List

				//Send user and room info
				io.to(user.room).emit('roomUsers', {
					room: user.room,
					users: getRoomUsers(user.room),
				})
				console.log('Disconnected')
			}
		})
	})
})

server.listen(port, () => {
	console.log(`Server is running on port: http://localhost:${port}`)
})
