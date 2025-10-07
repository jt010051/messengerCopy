import React, { useEffect, useState } from 'react'
import axios from '../api/axios'
import { Button } from 'react-bootstrap';

const FriendRequests = () => {
const [requests, setRequests] = useState([])
const currentUser =   localStorage.getItem("email");

const getRequests = async () =>{
const response = await axios.get(`chatUsers/${currentUser}/myRequests`)
console.log(response.data);
let arr = []
for(let key in response.data){
   if(response.data[key] === 'Request'){
    arr.push(key)
   }
    
}
setRequests(arr)

}


const handleButtonClick = async(user) =>{
      const confirmUser = await axios.put(`/chatUsers/addFriend/${currentUser}/${user}`)
  console.log(confirmUser);
  window.location.reload();

}




useEffect(()=>{
getRequests();
},[])
  return (
    <div>
{
requests.map(users =>{
    return(
        <ul>
<li>
    <Button onClick={ () => handleButtonClick(users)}>
        {
            users
        }
    </Button>
</li>

        </ul>
    )
})
}


    </div>
  )
}

export default FriendRequests