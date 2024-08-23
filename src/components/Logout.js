import React, { useContext } from 'react';
import { booleanContext } from '../Context';

function Logout() {
    const{isLoggedIn, setIsLoggedIn} =useContext(booleanContext )

    setIsLoggedIn(false)
    localStorage.removeItem("Authorities Copy");
    localStorage.removeItem("Refresh Token Copy");
    localStorage.removeItem("Access Token Copy");
  
    localStorage.removeItem("email Copy");
    localStorage.removeItem("phone Copy");
  
    localStorage.removeItem("password Copy");
    localStorage.removeItem("role Copy");
      return (
          <>
        <div>You Have Successfuly been logged out</div>
        <a href='/'>Return Home</a>
        </>
      )
}

export default Logout;