import React, { useContext, useEffect, useState } from 'react'
import axios from '../api/axios'
import { Button } from 'react-bootstrap'
import { StompContext, usernameContext } from '../Context'
import { useStompClient } from 'react-stomp-hooks'
export const UserList = () => {
  const stompClient = useStompClient() 

    const[users, setUsers] = useState({})
    const currentUser =   localStorage.getItem("email");
    const buttonState = ['Add Friend', 'Pending', 'Confirm', 'View Profile']
    const [selectedUser, setSelectedUser] = useState('')
const displayAllUsers = async () => {
    try{
    const userList = await axios.get('/chatUsers/allUsers/')
    console.log(userList.data);
    
    setUsers(userList.data)
    
    }
      catch (err) {
            console.log(err);
            
        }
}

const handleButtonClick = async (state, user) =>{
try{


if(state === buttonState[0]){
  const checkConfirm = await axios.get(`/chatUsers/${user}`)
  // console.log(typeof checkConfirm.data.values(currentUser));
   for (const key in checkConfirm.data) {
    // Check if the property is an own property of the object (not inherited)
    if (Object.prototype.hasOwnProperty.call(checkConfirm.data, key)) {
      if (checkConfirm.data[key] === user) {
        
      }
    }
  }
  if(checkConfirm.data.requests[currentUser]){
    alert("Friend Request already sent to you")
      window.location.reload();
  }
  // const addUser = await axios.put(`/chatUsers/friendRequests/${currentUser}/${user}`)
  // console.log(addUser);

  if(stompClient && checkConfirm){


    
  const thisUser = JSON.parse(localStorage.getItem("userDetails"));
    // console.log(typeof thisUser.email);
    // const thisUser = {
    //      id : checkConfirm.data.id,
    //   email : checkConfirm.data.email,
    //   password : checkConfirm.data.password,
    //   firstName : checkConfirm.data.firstName,
    //   lastName : checkConfirm.data.lastName,
    //   birthDate : checkConfirm.data.birthDate,
    //   gender : checkConfirm.data.gender,
    //   role : checkConfirm.data.role,
    //   phone : checkConfirm.data.phone,
    //   isPending : checkConfirm.data.isPending,
    //   status : checkConfirm.data.status,
    //   friends : checkConfirm.data.friends,
    //   requests : checkConfirm.data.requests
    // }
console.log(thisUser.requests);
thisUser.requests[user] = "Sent";
console.log(thisUser);

    stompClient.publish({destination: `/app/request/`,
      body: JSON.stringify(thisUser)
  })
  }else{
    console.log("No Stomp Client");
    
  }
  
}else if(state === buttonState[2]){
  const confirmUser = await axios.put(`/chatUsers/addFriend/${currentUser}/${user}`)
  console.log(confirmUser);
  
}


window.location.reload();
}
  catch (err) {
            console.log(err);
            
        }

}





  useEffect(()=>{
    displayAllUsers()
    
  },[])


  return (
<>
    {                    Array.isArray(users) ? 

users.map((u)=>{
  if(u.email === currentUser) return;
   
const myMap = new Map(Object.entries(u.requests));
const valuesArray = Object.values(u.friends); 



  
  
const button = valuesArray.includes(currentUser)
? buttonState[3] : (myMap.has(currentUser)
? (myMap.get(currentUser) === 'Sent'
? buttonState[2] : buttonState[1]

) 
: buttonState[0]) 

return(
    <div>
<ul>
    <li className={['user-item', u.email === selectedUser ? 'active':null].join(" ")}> 
  {u.email} <Button disabled = {button === buttonState[1]
    ? true  : false
  } onClick={()=>{
    
    handleButtonClick(button, u.email)
  }}>{
button
}</Button> 
 </li>  
</ul>
</div>
)

})
 : null
 }
 
  </>
  )
}
