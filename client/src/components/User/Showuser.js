import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
export const Showuser = () => {
    var {userId} = useParams()
    const [userData, setUserData] = useState({})
    let user = localStorage.getItem('user')
    useEffect(() => {
        if(user){
            axios.defaults.headers.common['Authorization'] =  `Bearer ${JSON.parse(user).token}`
        }
        axios.get(`http://localhost:3001/user/${userId}`)
        .then((res)=>{setUserData(res.data)})
        .catch((error) => {console.log(error)})
    }, [])
    if(userData === null){ return <div> User not found </div> }
    else{
        const authForEditAndDeleteUser = () => {
            if(JSON.parse(user).user._id === userId){
                return (
                    <>
                        <Link to={`/user/${userId}/edit`} className="ui button primary">Edit</Link>
                        <Link to={`/user/${userId}/delete`} className="ui button red">Delete</Link>
                    </>
                )
            }else{
                return(<></>)
            }
        }
        return(
            <div>
                <img src={userData.dP} className="ui medium circular image" alt="err" style={{width: "200px", height:"200px"}}/>
                <div><b>Firstname:</b> {userData.firstName}</div>
                <div><b>Lastname:</b> {userData.lastName}</div>
                <div><b>Username:</b> {userData.username}</div>
                <div><b>Age:</b> {userData.age}</div>
                <div><b>Email:</b> {userData.email}</div>
                <div><b>About:</b> {userData.bio}</div>
                <div><b>{userData.following} Following</b></div>
                <div><b>{userData.followers} Followers</b></div>
                {authForEditAndDeleteUser()}
            </div>
        )
    }
}