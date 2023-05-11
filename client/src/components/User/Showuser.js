import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
export const Showuser = (props) => {
    const [userData, setUserData] = useState({})
    useEffect(() => {
        axios.get(`http://localhost:3001/user/${props.userId.userId}`)
        .then((res)=>{setUserData(res.data)})
        .catch((error) => {console.log(error)})
    }, [])
    if(userData === null){ return <div> User not found </div> }
    else{
        return(
            <div>
                <img src={userData.dP} className="ui medium circular image" alt="err" style={{width: "200px", height:"200px"}}/>
                <div>{userData.firstName}</div>
                <div>{userData.lastName}</div>
                <div>{userData.username}</div>
                <div>{userData.age}</div>
                <div>{userData.email}</div>
                <div>{userData.bio}</div>
                <div>{userData.posts}</div>
                <div>{userData.following}</div>
                <div>{userData.followers}</div>
                <Link to={`/user/${props.userId.userId}/edit`} className="ui button primary">Edit</Link>
                <Link to={`/user/${props.userId.userId}/delete`} className="ui button red">Delete</Link>
            </div>
        )
    }
}