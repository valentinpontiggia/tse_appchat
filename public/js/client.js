const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('.room-name');
const userList = document.getElementById('users');
const input = document.getElementById('msg');
const feedback = document.getElementById('feedback');
const buttonRooms = document.querySelectorAll('.btnRoom');
const {username, room, avatar} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});
var compteur = 0;
var is_typing = "";

console.log(username + avatar);
const socket = io();
socket.emit('joinRoom', {username, room, is_typing, avatar});

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// When the input is triggered, the user status is updated
input.addEventListener('input', () => {
    if (input.value == "" || input.value == null) {
        is_typing = "";
    } else {
        is_typing = " is typing...";
    }
    socket.emit('updateUserStatus', is_typing);
});

// This part helps keeping the informations about the user (username, room and avatar)
buttonRooms.forEach(buttonRoom => {
    buttonRoom.addEventListener("click", function(event) {
        event.preventDefault();
        const room = buttonRoom.dataset.room;
        window.location.href = room + ".html?username=" + username + "&room=" + room + "&avatar=" + avatar;
    });
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const { recipient } = Qs.parse(location.search, { ignoreQueryPrefix: true });
    const msg = e.target.elements.msg.value;
    console.log("recipient : ", recipient);
    if (recipient === undefined) {
        socket.emit('chatMessage', msg);
    }
    else {
        console.log("succes");
        socket.emit("privateMessage", { recipient, msg });
    }

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

userList.addEventListener("click", (e) => {
    if (e.target && e.target.matches("li")) {
        // Get the recipient's username
        const recipient = e.target.innerText;

        // Append the recipient's username to the URL as a query parameter
        const newUrl = `${window.location.origin}${window.location.pathname}?recipient=${recipient}`;
        window.history.pushState({}, "", newUrl);
    }
});

socket.on("privateMessage", (message) => {
    const { recipient } = Qs.parse(location.search, { ignoreQueryPrefix: true });
    console.log("message.recipient : " + message.recipient);
    console.log("recipient : "+recipient);
    console.log("username : "+username);
    if (message.recipient === recipient || message.recipient === username) {
        console.log("goooo");
        // Handle private message
        const div = document.createElement("div");
        div.classList.add("private-message");
        div.innerHTML = `<p class="meta">${message.sender} <span>${message.time}</span></p><p class="text">${message.msg}</p>`;
        console.log(div);
        //document.querySelector('.chat-messages').hidden = true;
        //document.querySelector('.private-chat-messages').hidden = false;
        document.querySelector('.chat-messages').appendChild(div);
    }
});

function outputMessage (message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = '<p class="meta">' + message.username +' <span>' + message.time + '</span></p><p class="text">' + message.text +'</p>';
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName (room){
    roomName.innerText = room;
}
function outputUsers (users){
    userList.innerHTML = users.map(user => 
        `<style>
            li {
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            img {
                margin-right: 10px;
            }
        </style>
        <li>
            <img src="${user.avatar}" width="30" height="30"/> ${user.username} ${user.is_typing}
        </li>`
    ).join('');

}