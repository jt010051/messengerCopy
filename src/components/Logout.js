import React, { useContext } from 'react';
import { booleanContext } from '../Context';

function Logout() {
    const{isLoggedIn, setIsLoggedIn} =useContext(booleanContext )

    setIsLoggedIn(false)
    localStorage.clear()
    
      return (
          <>
        <div>You Have Successfuly been logged out</div>
        <a href='/'>Return Home</a>
        </>
      )
}

export default Logout;