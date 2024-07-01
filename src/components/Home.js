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
const user =   localStorage.getItem("user");
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
      
<Button  onClick={logout}>Logout</Button>

      
      </>
    );
}

export default Home;