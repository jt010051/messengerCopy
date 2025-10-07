import React, { useContext, useEffect } from 'react';
import { booleanContext } from '../Context';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import axios from '../api/axios';
  const email = localStorage.getItem("email");

function Logout() {
      const stompClient = useStompClient();
    const{isLoggedIn, setIsLoggedIn} =useContext(booleanContext )
    useEffect(()=>{
if(localStorage.getItem("email")) setIsLoggedIn(true)
    },[])

const disconnect = async () => {
  if(stompClient){
console.log(localStorage.getItem("email"));





     setIsLoggedIn(false)
            stompClient.publish({
        destination:  `/app/user.disconnectUser`,
      body: JSON.stringify({
            email: email, 
            status: 'OFFLINE'
        }) 
    }
        ) 
    localStorage.clear();
console.log(email);
  }

}
if(isLoggedIn) disconnect();
 
      return (
          <>
        <div>You Have Successfuly been logged out</div>
        <a href='/'>Return Home</a>
        </>
      )
}

export default Logout;