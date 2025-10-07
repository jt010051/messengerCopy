import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { booleanContext, usernameContext, oppositeContext, messageContext, refreshContext, usersContext, proccessContext } from './Context';
import Forgot from './components/Forgot';
import NewPassword from './components/NewPassword'
import Logout from './components/Logout';
import { StompSessionProvider } from 'react-stomp-hooks';
import { UserList } from './components/UserList';
  import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import FriendRequests from './components/FriendRequests';



function App() {
  
  const [isLoggedIn, setIsLoggedIn]=useState(false);

  const [currentUser, setCurrentUser]=useState(false);
  const [newMessage, setNewMessage]=useState(false);
  return(
<>



<StompSessionProvider
url = 'ws://localhost:8080/ws'
>

<booleanContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
<usernameContext.Provider value={{currentUser, setCurrentUser}}>
<messageContext.Provider value ={{newMessage, setNewMessage}}>
     <Menu />
<Routes>
<Route index element={<MainPage />} />
<Route>
  
<Route path="/forgot" element={<Forgot />} />
<Route path="/logout" element={<Logout />} />
<Route path='/userList' element = {<UserList />} />
<Route path="/changePassword"element={<NewPassword />} />
<Route path="/frequests"element={<FriendRequests />} />

          <Route path="/" element={<MainPage />} />
        </Route>
        
</Routes>

</messageContext.Provider>
</usernameContext.Provider>
</booleanContext.Provider>
</StompSessionProvider>
</>
  );
}

export default App;
