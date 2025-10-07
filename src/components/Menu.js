import React, { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { useContext } from 'react';
import { booleanContext, incrementContext, messageContext } from '../Context';
import { useSubscription } from 'react-stomp-hooks';
import { Button } from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse'
  import 'bootstrap/dist/css/bootstrap.min.css';
   const Menu = () => {
   const [showLogOut, setShowLogout]=useState(false);

    const {newMessage, setNewMessage} = useContext(messageContext)
    const [showLogIn, setShowLogIn]=useState(true);
const currentUser = localStorage.getItem("email")
 const isLoggedIn = localStorage.getItem("Logged In");
 const [friendRequests, setFriendRequests] = useState(false)
    useSubscription( `/user/${currentUser}/queue/request` , 
     () =>  {
      setFriendRequests(true)
      localStorage.setItem("friendRequests", true)
      console.log("Yooooo");
      
     }
      )
 
console.log(localStorage.getItem("friendRequests"));


useEffect(()=>{
if(localStorage.getItem("Logged In", true)){
setShowLogIn(false)
setShowLogout(true)
}
else if(localStorage.length === 0){
  setShowLogIn(true)
setShowLogout(false)
}
},[isLoggedIn])
const onMessageRecieved = (message)=>{
  if(message){
    setNewMessage(true)
  }
}


useSubscription(`/user/${currentUser}/queue/messages` , (m)=> onMessageRecieved(m))

// console.log(localStorage.getItem("newMessage"));

  return (
   <>
   <nav className="navbar navbar-expand-lg navbar-text-light bg-dark">

  <a className="navbar-brand" href="/">JT's Messenger</a>
  <button
    className="navbar-toggler"
    data-bs-toggle="collapse"
    data-bs-target="#navbarSupportedContent"
    aria-controls="navbarSupportedContent"
    aria-expanded="false"
    aria-label="Toggle navigation"

  >
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="user-item">

         {newMessage  ?
                                        <span className='nbr-msg'></span> 
                                            : null
                                    }

        <a className="nav-link" href='/'
  
        >Home</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href='/products'>Products</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href='/about'>About</a>
      </li>
    </ul>
    <div className="form-inline my-2 my-lg-0">
      <ul className="navbar-nav mr-auto2">
        {/* <li className="nav-item"> */}
          {/* <Link className="nav-link" to={{
    pathname: "/cart",
    search: "?sort=name",
    hash: "#the-hash",
    state: { fromDashboard: true }
  }}>
         Cart({cart})
          </Link> */}
          {/* </li> */}
      
   <li className='nav-item' >
       
            <a className="nav-link" 
    href= "/frequests"  onClick={()=>{
      setFriendRequests(false)
      localStorage.setItem("friendRequests", false)
    }} >
        
         <span className={[ "nbr-msg", friendRequests || localStorage.getItem("friendRequests") === true 
        ? 'active' : 'hidden'].join(" ")}
                                        ></span>                              
                                   
        Friend Requests
          </a>
       
      </li>
        <li className="nav-item">
          
           {/* { showRegister ? <a className="nav-link" href='/register'>Register</a> : null } */}
        </li>
        <li className="nav-item">
          
        
            { showLogIn ?   <a className="nav-link" href='/'>Login</a> : null }
        </li>
        <li className="nav-item">
          
           {/* { showProfile ?   */}
           <a className="nav-link " href='/userList'>People</a> 

        {/* //    : null } */}
        </li>
        <li className="nav-item">
          
           { showLogOut ? 
            <a className="nav-link text-danger" href='/logout'>Logout</a> 
             : null }


        </li>
      </ul>
      
    </div>
  </div>
</nav>
{/* // <app-shopping-cart *ngIf=""></app-shopping-cart>
// <router-outlet></router-outlet> */}


   
   </>
  )
}

export default Menu;