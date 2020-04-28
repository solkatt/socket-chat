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
} = require('./utils/users')

/// New Stuff /////

/// End of New Stuff ////

io.on('connection', (socket) => {
	console.log('Client connected: ', socket.id)

	socket.on('reload room list', () => {
		socket.emit('load room list', { rooms: getRooms() })
	})
	// USER JOIN CHATAPP
	socket.on('join app', (data) => {
		const user = userJoin(socket.id, data.name, data.room)
		console.log(`Användarnamn: ${data.name}`)
	})

	// CREATE ROOM
	socket.on('create room', (data) => {
		const user = getCurrentUser(socket.id)
		console.log('TEST:', user)
		
		const allUsers = getAllUsers()
		console.log('Alla Users FÖRE updateRoom', allUsers)

		// const room = addRoom(data.name, data.password);
		const room = addRoom(data.room, data.password)
		updateUserRoom(socket.id, data.room)



		//pusha room till user.room

		// socket.join(user.room, (data) => {
		//   io.to(socket.id).emit('join successful', user.room)
		// })

		io.to(socket.id).emit('room created', user.username, user.room)
	})

	//////////////////////////////////////////////

	// JOIN ROOM
	socket.on('join room', (data) => {
		const users = getAllUsers()
		// const allUsers = getAllUsers()
		// if user.id already exist 
		
		const user = userJoin(socket.id, data.name, data.room)

	
		
		
		

		socket.join(user.room, () => {
			// Respond to client that join was successful
			io.to(socket.id).emit('join successful', user.room)

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
			const user = userLeave(socket.id)
			if (user) {
				io.to(user.room).emit('message', {
					name: user.username,
					message: 'has left the chat',
				})

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
