import axios from '../api/axios'
import React, {useEffect, useState, useContext, useRef} from 'react'
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { booleanContext, StompContext, usernameContext } from '../Context';
import Home from './Home';
import Menu from './Menu';
import { useStompClient } from 'react-stomp-hooks';

const CHECK_LOGIN_URL = '/chatUsers/auth/token/refresh';

function MainPage(props) {
    const [email, setEmail] = useState('')
    const{isLoggedIn, setIsLoggedIn} =useContext(booleanContext)
    const currentUser =   localStorage.getItem("email");
    const stompClient = useStompClient();
    const refresh = {headers :{
        'Content-Type' : 'application/json',
        AUTHORIZATION : 'Bearer ' +localStorage.getItem("Refresh Token")
        
            }}




    const checkLoggedIn = async (e) => {
      
        try{
          
            const response = await axios.get(CHECK_LOGIN_URL, refresh);
            
           setIsLoggedIn(true)
        setEmail(localStorage.getItem("email"))
       
            



        }catch (err) {
            console.log(err);
            localStorage.clear();
        }
}

useEffect(() => {

            checkLoggedIn()
          
}, [])


    return (
      <>
        <StompContext.Provider value={stompClient}>

      <Routes>
     {isLoggedIn ? <Route path="/" element={<Home />} />:  <Route path="/" element={<Login />} />}
     {/* < Route path="/" element={<Home />} /> */}
     </Routes>
          </StompContext.Provider>


      </>
    );
}

export default MainPage;