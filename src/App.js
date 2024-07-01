import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { booleanContext, usernameContext, oppositeContext, incrementContext, refreshContext, usersContext, proccessContext } from './Context';
import Forgot from './components/Forgot';
import NewPassword from './components/NewPassword'
import Logout from './components/Logout';




function App() {
  const [isLoggedIn, setIsLoggedIn]=useState(false);

  return(
<>
<booleanContext.Provider value={{isLoggedIn, setIsLoggedIn}}>

<Routes>
<Route index element={<MainPage />} />
<Route>
<Route path="/forgot" element={<Forgot />} />
<Route path="/logout" element={<Logout />} />

<Route path="/changePassword"element={<NewPassword />} />
          <Route path="/" element={<MainPage />} />
        </Route>
        
</Routes>
</booleanContext.Provider>

</>
  );
}

export default App;
