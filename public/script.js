// Kanske kan flyttas någonstans bättre
// const roomName = document.querySelector('#rooms')
const userList = document.querySelector("#userList");

const roomList = document.querySelector(".roomsContainerStartPage");

const socket = io();

window.addEventListener("load", () => {
  reloadRoomList();
  setupEventListeners();
});

function setupEventListeners() {
  //GO to create Rooom
  const goToCreateRoomPageButton = document.querySelector(
    ".goToCreateRoomPageButton"
  );
  goToCreateRoomPageButton.addEventListener("click", loadCreateRoomUI);

  //Create Room Handler
  const createRoomBtn = document.querySelector(".createRoomButton");
  createRoomBtn.addEventListener("click", onCreateRoom);

  // Send message submit handler
  const messageForm = document.querySelector(".messageBox");
  messageForm.addEventListener("submit", onSendMessage);

  // Output Room List
  /// Join Room Button


  roomList.addEventListener("click", function (e) {
    e.preventDefault();
    // check whether class "submit-button" is present in the CSS classes of target
    if (e.target.classList.contains("joinRoomButton")) {
	  const room = e.target.previousElementSibling.innerHTML.trim();

      joinActiveRoom(room);
    }
  });

  // Socket io events
  socket.on("load room list", loadRoomList);
  socket.on("room created", loadJoin);
  socket.on("prompt password", promptPassword);
  socket.on("join w/o pw", loadChatandJoin);
  ///
  socket.on("join successful", loadChatUI);
  socket.on("message", onMessageReceived);
  socket.on("roomUsers", ({ room, users }) => {
    outputRooms(room);
    outputUsers(users);
  });
}

function loadRoomList({ rooms }) {
  console.log("LOAD ROOMS");
  console.log(rooms);

  let template = document.createElement("template");
  // const roomDiv = document.createElement('')
  //  roomDiv.classList.add('roomDiv')

  let render = rooms
    .map((room) => {
      if (room.password) {
        console.log("Room Password:", room.password);
        return  `
		  <div class="roomDiv">
		  			<i class="fas fa-lock lockIcon"></i>
				  	<p>${room.name}</p>
		  <button class="joinRoomButton" >Join</button>
		  </div>
		   `;
      } else {
        console.log("Room Password NOT:", room.name);

        return `
			 <div class="roomDiv" >
			 			<i class="fas fa-lock-open lockIcon"></i>
						<p>${room.name}</p>
			 <button class="joinRoomButton" >Join</button>
			 </div>
			  `;
      }
    })
	.join("");
	
	template.innerHTML = render
  	roomList.append(template.content);
}

function reloadRoomList() {
  socket.emit("reload room list");
}

function joinActiveRoom(roomName) {
  console.log(roomName);

  const userNameInput = document.querySelector(".chooseUsername");

  // Save User to Users Array
  const name = userNameInput.value;
  const room = roomName;

  if (userNameInput.value == "") {
    alert("Enter username!");
  } else {
    // socket.emit('join app', {
    // 	name,
    // 	room,
    // })

    //CLASSLIST REMOVE HIDDEN PÅ MODAL
    // PLOCKA IN LÖSEN OCH SKICKA MED

    socket.emit("check password", { name, room });

    // socket.emit('join room', { name, room })
  }
}

function promptPassword({ name, room, roomPW }) {
  console.log("PROMPT PASSWORD MODAL HERE", roomPW);
  const enteredPW = prompt("Ange lösen");

  if (enteredPW == roomPW) {
    alert("Rätt Lösen");
    socket.emit("join room", { name, room });
    document.querySelector(".startPageContainer").classList.add("hidden");
    document.querySelector(".chatContainer").classList.remove("hidden");
  } else {
    alert("Fel lösen");
  }

  //add classlist hidden / remove
}

function loadChatandJoin({ name, room }) {
  console.log("LOADCHATANDJOIN", name);
  socket.emit("join room", { name, room });

  document.querySelector(".startPageContainer").classList.add("hidden");
  document.querySelector(".chatContainer").classList.remove("hidden");
}

function loadCreateRoomUI(event) {
  event.preventDefault();

  const userNameInput = document.querySelector(".chooseUsername");

  // Save User to Users Array
  const name = userNameInput.value;
  const room = "";

  socket.emit("join app", {
    name,
    room,
  });

  if (userNameInput.value == "") {
    alert("Enter username!");
  } else {
    document.querySelector(".startPageContainer").classList.add("hidden");
    document.querySelector(".createRoomContainer").classList.remove("hidden");
  }
}

/// ON CREATE ROOM ////////

function onCreateRoom(event) {
  event.preventDefault();

  const roomInput = document.querySelector(".chooseRoomName");
  const room = roomInput.value;

  const passwordInput = document.querySelector(".inputPassword");
  const password = passwordInput.value;

  /// Validate
  if (room == "") {
    alert("Enter roomname!");
  } else {
    document.querySelector(".createRoomContainer").classList.add("hidden");
    document.querySelector(".chatContainer").classList.remove("hidden");

    socket.emit("create room", {
      room,
      password,
    });
  }

  console.log(`Rumnamn: ${room}  Lösenord: ${password}`);
}

///

function loadJoin(name, room) {
  onJoinRoom(name, room);
}

//// ON JOIN ROOM

function onJoinRoom(name, room) {
  event.preventDefault();
  // const [nameInput, roomInput] = document.querySelectorAll(".join.ui input");

  // const name = nameInput.value;
  // const room = roomInput.value
  socket.emit("join room", { name, room });
  // socket.emit("join room", name);
}

function loadChatUI(data) {
  console.log(`Från script > loadChatUI: ${data}`);
  // socket.emit("join room", name);

  const rooms = document.querySelector("#rooms");
  const room = document.createElement("div");
  room.classList.add("roomObject");
  room.innerHTML = `
	<h4 class="roomTitle">${data}</h4>
	`;
  rooms.appendChild(room);
}

function onSendMessage(event) {
  event.preventDefault();

  //Get Message text
  const input = document.querySelector(".messageBox input");

  // Emit Message to server
  socket.emit("message", input.value);
  input.value = "";
}

function onMessageReceived({ name, message }) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  li.classList.add("message");
  li.innerText = `${name}: ${message}`;
  ul.append(li);

  ul.scrollTop = ul.scrollHeight;
}

// Add room name to DOM
function outputRooms(room) {
  // roomName.innerText = room;
  console.log(room);
}

//Add users to DOM
function outputUsers(users) {
  console.log(users);
  const user = document.createElement("div");

  userList.innerHTML = "";

  user.innerHTML = `
	${users
    .map(
      (user) => `
			<div class="userObject">
			<i class="fas fa-user userIcon"></i>
			<h4 class="userTitle">	${user.username}
			</h4> </div>`
    )
    .join("")}`;

  userList.append(user);
}
