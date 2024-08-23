import React, {  useEffect, useRef, useState,useCallback, act } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import user_icon from '../img/user_icon.png'


const  Home = () => {
    let currentUser = 'Jon-Thomas2';
    let email = 'jt010051@gmail.com';
    let phone = ''

    const navigate = useNavigate();
    const location = useLocation();
    const userDetailsApi = `user/userDetails/${currentUser}`
    const log = location.state?.from?.pathname || "/logout";
    const stompClient = useStompClient();
    const messagesEndRef = useRef(null)

    const [thisMessage, setThisMessage] = useState('')
    const [activeUser, setActiveUser] = useState(false);
    const [listOfUsers, setListOfUsers] = useState([])
	const [selectedUser, setSelectedUser] = useState('')
    const [recievedMessages, setRecievedMessages] = useState(false)
    const [otherUser, setOtherUser] = useState('')
    const [userChatResponse, setUserChatResponse] = useState([]);

	useSubscription(`/user/public`)

	useSubscription(`/user/${currentUser}/queue/messages`, (message2) => {
        const json = JSON.parse(message2.body)
        setOtherUser(json.senderId)

        let newObj ={
            id : (Object.keys(userChatResponse).length !== 0 ? userChatResponse.length : 0),
            chatId : 'Jon-Thomas_Jon-Thomas2',
            content : json.content,
            senderId : json.senderId,
            recipientId : json.recipientId,
            timeStamp : new Date,
        }

        setRecievedMessages(true)
        let data = {}

        if (Object.keys(userChatResponse).length !== 0) {
            data = userChatResponse
            data.push(newObj)
        }
        else data [0] = newObj

        setUserChatResponse(data)
        fetchAndDisplayUserChat()  
        }
    )

    if (!currentUser) {
        currentUser = localStorage.getItem("phone");
    }



     const findAndDisplayConnectedUsers = async(e) =>{
        try{
            const connectedUsersList  
                = await axios.get('chatUsers/allUsers');
            
            setListOfUsers(connectedUsersList.data
                .filter( user => user.email !== email)
                .filter( user => user.phone !== phone)
                .map(user => user.firstName))
        }
        catch (err) {
            console.log(err);
            
        }
    }

    const fetchAndDisplayUserChat = async()=>{    
        const response = 
            await axios.get(`/messages/${currentUser}/${selectedUser}`)
    
        if(response.data){
            setUserChatResponse(response.data)
        }
    } 
 
    if(stompClient){
        stompClient.publish("/app/user.addUser",
        {},
        JSON.stringify({firstName: currentUser, status:'ONLINE'})
        )     
    }
 
    const publishMessage = () => {      
        if(stompClient) {
            const chatMessage = {
                senderId: currentUser,
                recipientId: selectedUser,
                content: thisMessage,
                timeStamp: new Date() 
            }

        stompClient.publish({destination: '/app/chat', body: JSON.stringify(chatMessage)})
        let data = []

        if(userChatResponse)  data = userChatResponse

        data.push(chatMessage)
        setUserChatResponse(data)
        document.getElementById("message").value = '';
        setThisMessage('')

        }
    }

    const logout =()=>{
        navigate(log, { replace: true });
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    const recievedMessgs = () =>{
        return(
            userChatResponse?.map?.((data)=>{      
                return(
                    <div className={['message', 
                        data.senderId === currentUser 
                        ? 'sender' : 'receiver'].join(" ")}>
                            <p> { data.content }</p>
                            <div ref={messagesEndRef} />
                    </div>
                )          
            })
        )
    }


    useEffect(()=>{
        findAndDisplayConnectedUsers()
    },[])
        
    useEffect(()=>{
        if(activeUser){
            fetchAndDisplayUserChat()
        }
    },[selectedUser])

    useEffect(() => {
        scrollToBottom()
    }, [publishMessage]);


    return (
            <>
                    <div onClick={() =>{
                        if(selectedUser) setSelectedUser('')
                        if(activeUser) setActiveUser(false)
                                        }}>
                        <h2>Hello {currentUser}</h2>
                </div>
            <div className="chat-container" id="chat-page">
                <div className="users-list">
                    <div className="users-list-container">
                        <h2>Online Users</h2>
                        <ul id="connectedUsers" > 
                        </ul>
                </div>
            <div> 
            <p id="connected-user-fullname"></p>
                {listOfUsers
                        .map(user => {
                        return(
                            <ul>
                                <li className={['user-item', user === selectedUser ? 'active':null].join(" ")} 
                                    onClick={()=>{
                                        if(!activeUser) setActiveUser(true)
                                        setRecievedMessages(false)  
                                        if(user !== selectedUser) 
                                            setSelectedUser(user)
                                        else {
                                        setSelectedUser('')
                                        setActiveUser(false)
                                        }
                                                }}>
                                <img src={user_icon} 
                                    alt = {user} style={{width:20, height: 20}} />
                                    <span>
                                        {user}
                                    </span>
                                    {recievedMessages && user === otherUser ?
                                        <span className='nbr-msg'></span> 
                                            : null
                                    }
                        
                                </li>
                            </ul>
                            )
                                    }
                        )
                    }
                
                    
                </div>
            </div>

                <div className="chat-area">
                    <div className="chat-area" id="chat-messages">         
                        {activeUser  ?
                        recievedMessgs()
                        : null
                        }    
                    </div>
                        {activeUser ? 
                            <>
                                <form id="messageForm" name="messageForm" >
                                    <div className="message-input">
                                        <input autoComplete="off" type="text" id="message" placeholder="Type your message..."
                                            onChange={(e) => setThisMessage(e.target.value)}  
                                            onKeyDown={(e)=>{
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    publishMessage()
                                                }
                                                            }
                                                    }
                                        />
                                        <Button onClick={(e)=>{
                                            publishMessage()
                                        }}>Send</Button>
                                    </div>
                                </form>
                
                            </>
                                    : null}
            </div>
            </div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.4/sockjs.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>   
            <Button  onClick={logout}>Logout</Button>
        
        </>
    );
}

export default Home;