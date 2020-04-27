// Kanske kan flyttas någonstans bättre
// const roomName = document.querySelector('#rooms')
const userList = document.querySelector("#userList");

//
const socket = io();

window.addEventListener("load", () => {
  setupEventListeners();
});

function setupEventListeners() {
  // Join submit handler
  // const joinForm = document.querySelector('form.join.ui')
  // joinForm.addEventListener('submit', onJoinRoom)

  //GO to create Rooom
  const goToCreateRoomPageButton = document.querySelector(
    ".goToCreateRoomPageButton"
  );
  goToCreateRoomPageButton.addEventListener("click", loadCreateRoomUI);

  //Create Room Handler
  const createRoomBtn = document.querySelector(".createRoomButton");
  createRoomBtn.addEventListener("click", onCreateRoom);

  // Send message submit handler
  const messageForm = document.querySelector(".messageBox form");
  messageForm.addEventListener("submit", onSendMessage);

  // Socket io events
  socket.on("join successful", loadChatUI);
  socket.on("message", onMessageReceived);
  socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });
}

//// ON JOIN ROOM


function onJoinRoom(event) {
  event.preventDefault();
  const [nameInput, roomInput] = document.querySelectorAll(".join.ui input");

  const name = nameInput.value;
  // const room = roomInput.value
  // socket.emit('join room', { name, room })
  socket.emit("join room", name);

}


//////// 

function loadChatUI(data) {
console.log(`Från script > loadChatUI: ${data}`)

  const rooms = document.querySelector("#rooms");
  const room = document.createElement("div");
  room.classList.add("roomObject");
  room.innerHTML = `
	<h4 class="roomTitle">${data}</h4>
	<i class="fas fa-lock lockIcon"></i>
	`;
  rooms.appendChild(room);
}

////// 

function loadCreateRoomUI(event) {
  event.preventDefault();

  const userNameInput = document.querySelector(".chooseUsername")

  const name = userNameInput.value
  const room = ''
  // Save User to Users Array

   socket.emit('join app', {name, room})

  if (userNameInput.value == "") {
	alert("Enter username!")
  } else {
	document.querySelector(".startPageContainer").classList.add("hidden");
	document.querySelector(".createRoomContainer").classList.remove("hidden");
  }
}

/// ON CREATE ROOM ////////

function onCreateRoom(event) {
  event.preventDefault();
  
  console.log("TJEENA från onCreateRoom");

  const roomInput = document.querySelector(".chooseRoomName");
  const room = roomInput.value;

  /// Validate
  if (room == "") {
    alert("Enter roomname!")
    } else {
      document.querySelector(".createRoomContainer").classList.add("hidden");
      document.querySelector(".chatContainer").classList.remove("hidden");
    }

  const passwordInput = document.querySelector(".inputPassword");
  const password = passwordInput.value;

  console.log(`Rum: ${room}  Password: ${password}`);


  socket.emit("create room", {room, password});
}



///////


function onSendMessage(event) {
  event.preventDefault();

  //Get Message text
  const input = document.querySelector(".messageBox form input");

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
function outputRoomName(room) {
  // roomName.innerText = room;
  console.log(room);
}

//Add users to DOM
function outputUsers(users) {
  console.log(users);
  const user = document.createElement("div");

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