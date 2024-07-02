import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import Logout from './Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { booleanContext } from '../Context';
import axios from '../api/axios';
function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const log = location.state?.from?.pathname || "/logout";
let user =   localStorage.getItem("email");
if (!user) {
    user = localStorage.getItem("phone");
}

const[name, setName] = useState('')
const{isLoggedIn, setIsLoggedIn} =useContext(booleanContext )
const userDetailsApi = `user/userDetails/${user}`



const logout =()=>{
    navigate(log, { replace: true });

}

    const getUserDetails = async(e)=>{
        console.log(user);
try{
    const response = await axios.get(userDetailsApi);
    console.log(response);
    setName(response.data.firstName)
}
catch(e){
console.log(e);
}




    }

    getUserDetails()
//
const usernamePage= document.querySelector('#username-page')
const chatPage = document.querySelector('#chat-page')
const usernameForm = document.querySelector('#usernameForm')
const messageForm = document.querySelector('#messageForm')
const messageInput = document.querySelector('#message')
const connetingElement = document.querySelector('.connecting')
const chatArea = document.querySelector('#chat-messages')
const lO = document.querySelector('#logout')


let stompClient = null;
let nickname = null;
let fullname = null;
let selectedUserId = null;

function connect(event){
	nickname= document.querySelector('#nickname').value.trim();
	fullname= document.querySelector('#fullname').value.trim();
	
if(nickname && fullname){
	usernamePage.classList.add('hidden')
	chatPage.classList.remove('hidden')
	
	
	
    // const socket = new SockJS('/ws')
	// stompClient = Stomp.over(socket)
	

	
	
	stompClient.connect({}, onConnected, onError);
}
	event.preventDefault();
}
function onConnected(){
	stompClient.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived);

	stompClient.subscribe(`/user/public`, onMessageReceived)
	
	stompClient.send("/app/user.addUser",
	{},
	JSON.stringify({nickName: nickname, fullName: fullname, status:'ONLINE'})
	)
	
	document.querySelector('#connected-user-fullname').textContent = fullname
	findAndDisplayConnectedUsers().then();
}

async function findAndDisplayConnectedUsers(){
	const connectedUsersResponse = await fetch('/users');

	let connectedUsers = await connectedUsersResponse.json();
	connectedUsers = connectedUsers.filter(user => user.nickName != nickname);
	const connectedUsersList  = document.getElementById('connectedUsers')
	connectedUsersList.innerHTML = '';
	connectedUsers.forEach(user => {
		appendUserElement(user, connectedUsersList);
		if(connectedUsers.indexOf(user) < connectedUsers.length-1){
			const separator = document.createElement('li')
			separator.classList.add('separator')
			connectedUsersList.appendChild(separator);
		}
	})
	
	
}
function appendUserElement(user, connectedUsersList){
	const listItem = document.createElement('li')
	listItem.classList.add('user-item')
	listItem.id = user.nickName;

	
	const userImage = document.createElement('img')
	userImage.src = '../img/user_icon.png';
	userImage.alt = user.fullName;
	const usernameSpan = document.createElement('span')
	usernameSpan.textContent = user.fullName;

	const recievedMessages= document.createElement('span');
	recievedMessages.textContent = '0'
	recievedMessages.classList.add('nbr-msg', 'hidden');
	
	listItem.appendChild(userImage)
	listItem.appendChild(usernameSpan)
	listItem.appendChild(recievedMessages)
	// listItem.addEventListener('click', userItemClick)
	
	
	connectedUsersList.appendChild(listItem)
}
function userItemClick(event){
	document.querySelectorAll('.user-item').forEach(item => {
		item.classList.remove('active')
	}
	)
	

	
	messageForm.classList.remove('hidden')
	
	const clickedUser = event.currentTarget;

	clickedUser.classList.add('active');
	
	
	
	selectedUserId = clickedUser.getAttribute('id')
	
	fetchAndDisplayUserChat().then();
	const nbrMsg = clickedUser.querySelector('.nbr-msg')
	nbrMsg.classList.add('hidden')
	nbrMsg.textContent = '0';
}


async function fetchAndDisplayUserChat(){
	const userChatResponse = await fetch(`/messages/${nickname}/${selectedUserId}`)
	const userChat = await userChatResponse.json();
	
	chatArea.innerHTML = ''
	userChat.forEach(chat =>{
		displayMessage(chat.senderId, chat.content);
	})
	chatArea.scrollTop = chatArea.scrollHeight
}
function displayMessage(senderId, content){
	const messageContainer = document.createElement('div')
	messageContainer.classList.add('message')
	
	if(senderId === nickname)messageContainer.classList.add('sender')
	else messageContainer.classList.add('receiver')
	const message = document.createElement('p')

	message.textContent = content;
	messageContainer.appendChild(message);
	chatArea.appendChild(messageContainer);
}
function onError(){}
function sendMessage(event){
	const messageContent = messageInput.value.trim();
	
	if(messageContent && stompClient){
		const chatMessage = {
			senderId: nickname,
			recipientId: selectedUserId,
			content: messageContent,
			timeStamp: new Date() 
		}
		stompClient.send("/app/chat", {}, JSON.stringify(chatMessage))
		displayMessage(nickname, messageContent);
		        messageInput.value = '';

	}
		chatArea.scrollTop = chatArea.scrollHeight

	event.preventDefault();
}



async function onMessageReceived(payload){
	await findAndDisplayConnectedUsers();
	console.log(payload)
	const message = JSON.parse(payload.body)
	
	if(selectedUserId && selectedUserId === message.senderId){
		displayMessage(message.senderId, message.content);
		chatArea.scrollTop = chatArea.scrollHeight

	}
	if(selectedUserId) document.querySelector(`#${selectedUserId}`).classList.add('active')
	else messageForm.classList.add('hidden');
	
	const notifiedUser = document.querySelector(`#${message.senderId}`)

	if(notifiedUser && !notifiedUser.classList.contains('active')){
		const nbrMsg = notifiedUser.querySelector('.nbr-msg')
		nbrMsg.classList.remove('hidden');
		nbrMsg.textContent = '';
	}
}

function onLogout(){
	stompClient.send('/app/user.disconnectUser', {},
	 JSON.stringify({nickName: nickname, fullName: fullname, status:'OFFLINE'}))
	 window.location.reload();
     logout()
}



// usernameForm.addEventListener('submit', connect, true);
// messageForm.addEventListener('submit', sendMessage, true);

// lO.addEventListener('click', onLogout, true)
window.onbeforeunload = () => onLogout();
//
    return (
      <>
      <h2>Hello {name}</h2>



<div className="chat-container hidden" id="chat-page">
    <div className="users-list">
        <div className="users-list-container">
            <h2>Online Users</h2>
            <ul id="connectedUsers">
            </ul>
        </div>
        <div>
            <p id="connected-user-fullname"></p>
        </div>
    </div>

    <div className="chat-area">
        <div className="chat-area" id="chat-messages">
        </div>

        <form id="messageForm" name="messageForm" className="hidden">
            <div className="message-input">
                <input autoComplete="off" type="text" id="message" placeholder="Type your message..."/>
                <Button>Send</Button>
            </div>
        </form>
    </div>
</div>
      
<Button  onClick={lO}>Logout</Button>

      
      </>
    );
}

export default Home;