import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios'
import { notify } from "../CustomStyling/notify.js";
// import { Logout } from "../Auth/Logout.js";
import { useEffect, useState } from "react";
const user = localStorage.getItem('user')

export const Navbar = () => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    useEffect(()=>{
        if(user) {
            setIsLoggedIn(true)
        }
    }, [])
    const Logout = async () => {        
        axios.post('http://localhost:3001/deleteRefToken', JSON.parse(user))
        .then(data => console.log(data.msg))
        .catch(err => console.log(err))
        localStorage.clear()
        axios.defaults.headers.common['Authorization'] = '';
        setIsLoggedIn(false)
        notify('Logged out successfully!')
    }
    const loggedIn = (isLoggedIn) => {
        if(!isLoggedIn){
            return(
                <div className="right menu">
                    <div>
                        <Link to='/login' className="item">Login</Link>
                    </div>
                    <div>
                        <Link to='/user/new' className="item">Sign Up</Link>
                    </div>
                    
                </div>                
            )
        }
        else{
            return(
                <div className="right menu">
                    <div className="item">
                            <Link to={`/user/${JSON.parse(user).user._id}`}>
                                {JSON.parse(user).user.firstName} {JSON.parse(user).user.lastName}
                            </Link>
                    </div>
                    <div className="item">
                        <button 
                            className="ui button primary" 
                            onClick = {()=>{
                                Logout()
                                navigate('/home')
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )
        }
    } 
    return (
        <>
        <div style={{height: '40px', width: '100%', marginBottom: '10px'}} >
            <div className="ui secondary pointing menu" style={{height: '50px', backgroundColor: 'white'}}>
                <div>
                    <Link to='/' className="item">BlogStation</Link>
                </div>
                <div>
                    <Link to="/home" className="item">Home</Link>
                </div>
                <div>
                    <Link to="/posts/new" className="item">Add post</Link>
                </div>
                {loggedIn(isLoggedIn)}
            </div>
        </div>
        </>
    )
}