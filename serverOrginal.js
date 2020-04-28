const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIO(server);

//Set static folder
app.use(express.static("public"));

/// Modules
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  addRoom,
} = require("./utils/users");


/// New Stuff /////

/// End of New Stuff ////

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);


// USER JOIN CHATAPP
socket.on('join app', (data) => {
  const user = userJoin(socket.id, data.name, data.room);
   console.log(`Namn: ${data.name}`)

})




  //// CREATE ROOM //////
  socket.on("create room", (data) => {
    // const room = addRoom(data.name, data.password);
    const room = addRoom(data.room, data.password)
   
	console.log(room)
    console.log("hej från create room > join");

    socket.join(room.name, (data) => {
      io.to(socket.id).emit('join successfull', room.name)
      console.log(`Från join: ${room.name}`)
    })

  });

  ///////////////////////

  socket.on("join room", (data) => {
    const user = userJoin(socket.id, data.name, data.room);

    socket.join(user.room, () => {
      // Respond to client that join was successful
      io.to(socket.id).emit("join successful", user.room);

      //Broadcast message to all clients in the room *Viktor has joined the room*
      io.to(user.room).emit("message", {
        name: user.username,
        message: "has joined the room! ",
      });
    });

    //

    //
    socket.on("message", (message) => {
      //Broadcast message to all clients in the room
      io.to(user.room).emit("message", {
        name: user.username,
        message,
      });
    });

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    //Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit("message", {
          name: user.username,
          message: "has left the chat",
        });

        //Send user and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});