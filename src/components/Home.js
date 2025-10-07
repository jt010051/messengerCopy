import React, {  useEffect, useRef, useState,useCallback, act, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import user_icon from '../img/user_icon.png'
import { usernameContext, messageContext, StompContext } from '../Context';
import useWebSocket, { ReadyState } from "react-use-websocket"



const  Home = () => {


const stompClient = useContext(StompContext)  
const messagesEndRef = useRef(null)
const [thisMessage, setThisMessage] = useState('')
const [activeUser, setActiveUser] = useState(false);
const [listOfUsers, setListOfUsers] = useState({})
const [selectedUser, setSelectedUser] = useState('')
const [otherUser, setOtherUser] = useState('')
const [userChatResponse, setUserChatResponse] = useState([]);
const currentUser =   localStorage.getItem("email");
const userDetailsApi = `user/userDetails/${currentUser}`
const {newMessage, setNewMessage} = useContext(messageContext)
const [hasNewMessage, setHasNewMessage] = useState(new Map()); 
const [userDetails, setUserDetails] = useState() 
const [firstRun, setFirstRun] = useState(true)
// const [message, setMessage] = useState({})


// if(stompClient && firstRun){
//         stompClient.subscribe(`/user/public`, (m)=> onMessageRecieved(m.body))	
// setFirstRun(false);
// }

const details  = async () => {
    const response = await axios.get(`chatUsers/currentUser/${currentUser}`, localStorage.getItem("Authorities Copy"))
if(response.data){
    setUserDetails(response.data)
    localStorage.setItem("userDetails", JSON.stringify(response.data))
}
}


const onMessageRecieved = (message)=>{
    if(!message) return
             console.log(message.body);

 findAndDisplayConnectedUsers()

        const json = JSON.parse(message.body)
console.log(json);
    if(!json.senderId) return;

        
                    setSelectedUser(json.senderId)
            if(message.email) return;
                    let newObj ={
                        id : (Object.keys(userChatResponse).length !== 0 ? userChatResponse.length : 0),
                        chatId : `${currentUser}_${json.senderId}`,
                        content : json.content,
                        senderId : json.senderId,
                        recipientId : json.recipientId,
                        timeStamp : new Date,
                        read : json.read,
                    }
                    localStorage.setItem("newMessage", true)
                    setNewMessage(true)
                    addEntry(newObj.senderId)
                            console.log(newObj);
                            console.log(userChatResponse);

                    let data = {}
                    if (Object.keys(userChatResponse).length !== 0) {
                        data = userChatResponse
                        console.log(data);
                        
                        data.push(newObj)
                    }
                    else data [0] = newObj
                    
                    setUserChatResponse(data)
                    if(activeUser)fetchAndDisplayUserChat()
}

   if(stompClient && userDetails){

        userDetails.status = 'ONLINE'
        stompClient.publish({
        destination:  `/app/user.addUser`,
      body: JSON.stringify({
            email: userDetails.email, 
            status: userDetails.status
        }) 
    }
        ) 
        
   }
   useSubscription( `/user/${currentUser}/queue/messages` , (m)=> onMessageRecieved(m))
 useSubscription(`/user/`, (m)=> onMessageRecieved(m.body))	




       const findAndDisplayConnectedUsers = async(e) =>{
            const response = await axios.get(`chatUsers/currentUser/${currentUser}`, localStorage.getItem("Authorities Copy"))
            let email = (response.data.email != null ? response.data.email : null)
            let phone = (response.data.phone != null ? response.data.phone : null)
            const thisUser = (email != null ? email : phone)

            try{
                const connectedUsersList  = await axios.get(`chatUsers/usersOnline/${thisUser}`, localStorage.getItem("Authorities Copy"));
                setListOfUsers(connectedUsersList.data)  
                for(let i = 0; i < connectedUsersList.data.length; i++){
                    const response = await axios.get(`/messages/${currentUser}/${connectedUsersList.data[i].email}`)
                    if(response.data && !response.data[response.data.length-1].read){
                        addEntry(connectedUsersList.data[i].email)
                        setNewMessage(true)
                    }
                }   
            }
            catch (err) {
                console.log(err);
                
            }
        }







    const addEntry = (key) => {
        
        setHasNewMessage(prevMap => {
        const newMap = new Map(prevMap); 
        newMap.set(key, true);
        
        return newMap;
        });
    }; 

    const setFalse = (key) => {
        setHasNewMessage(prevMap => {
        const newMap = new Map(prevMap); 
        newMap.set(key, false);
        
        return newMap;
        });
    }; 

 


        
   
        

    

        const fetchAndDisplayUserChat = async()=>{    
    try{
                const response = 
                await axios.get(`/messages/${currentUser}/${selectedUser}`)
        
            if(response.data){
                setUserChatResponse(response.data)
                
            }
            
            
    }
        catch (err) {
                console.log(err);
                
            }
        } 
    
  
    useEffect(()=>{
                     findAndDisplayConnectedUsers();

        details()
        },[])

       

        const publishMessage = () => {   
            
            if(stompClient) {
                const chatMessage = {
                    senderId: currentUser,
                    recipientId: selectedUser,
                    content: thisMessage,
                    timeStamp: new Date(),
                    read: false,
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

    const setRead = async (senderId, recipientId) =>{
    try{
            const response = axios.put(`/read/${senderId}/${recipientId}`)

    }
    catch(err){
        console.log(err);
        
    }
    }
    
    
            
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
                    {
                        Array.isArray(listOfUsers) ? 

                    listOfUsers
                            .map(user => {

                            return(
                                <ul>
                                    <li className={['user-item', user.email === selectedUser ? 'active':null].join(" ")} 
                                        onClick={()=>{ 
                                        
                                            setActiveUser(!activeUser)

                        
                                        setFalse(user.email)
                                                localStorage.setItem("newMessage", false)
                                                setRead(currentUser, user.email)
                                                setNewMessage(false)
                                            if(!selectedUser)   setSelectedUser(user.email)
                                                else setSelectedUser('')
                                    
                                                    }}>
                                    <img src={user_icon} 
                                        alt = {user.firstName} style={{width:20, height: 20}} />
                                        <span>
                                            {user.firstName} 
                                        </span>
                                        {hasNewMessage.get(user.email) && (user.email === otherUser
                                            || !otherUser
                                        )
                                        
                                        ?
                                            <span className='nbr-msg'></span> 
                                                : null
                                        }
                            
                                    </li>
                                </ul>
                                )
                                        }
                            ) : null
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
            

            </>
        );
}

export default Home;