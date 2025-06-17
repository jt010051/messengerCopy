import axios from '../api/axios'
import React, {useEffect, useState, useContext, useRef} from 'react'
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { booleanContext, usernameContext } from '../Context';
import Home from './Home';
const CHECK_LOGIN_URL = '/chatUsers/auth/token/refresh';

function MainPage(props) {
    const [email, setEmail] = useState('')
    const{isLoggedIn, setIsLoggedIn} =useContext(booleanContext)
    const[currentUser, setCurrentUser] =useState('')

    const refresh = {headers :{
        'Content-Type' : 'application/json',
        AUTHORIZATION : 'Bearer ' +localStorage.getItem("Refresh Token Copy")
        
            }}




    const checkLoggedIn = async (e) => {
      
        try{
          
            const response = await axios.get(CHECK_LOGIN_URL, refresh);
           setIsLoggedIn(true)
        setEmail(localStorage.getItem("email Copy"))
       
            



        }catch (err) {
            console.log(err);
        }
}

useEffect(() => {

            checkLoggedIn()
          
}, [])


    return (
      <>
              <usernameContext.Provider value={{currentUser, setCurrentUser}}>

      <Routes>
     {isLoggedIn ? <Route path="/" element={<Home />} />:  <Route path="/" element={<Login />} />}
     {/* < Route path="/" element={<Home />} /> */}
     </Routes>
          </usernameContext.Provider>

      </>
    );
}

export default MainPage;