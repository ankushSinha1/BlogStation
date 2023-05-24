import React from "react";
import { useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import { bindActionCreators } from "redux";
import { actionCreator } from "../../state/index";
import axios from 'axios'
import { notify } from "../CustomStyling/notify.js";
// import { Logout } from "../Auth/Logout.js";
// import { useEffect, useState } from "react";
const user = localStorage.getItem('user')

export const Navbar = () => {
    const navigate = useNavigate()
    const state = useSelector(state.login);
    const dispatch = useDispatch();
    const actions = bindActionCreators(actionCreator, dispatch)
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    // useEffect(()=>{
    //     if(user) {
    //         setIsLoggedIn(true)
    //     }
    // }, [])
    const Logout = async () => {
        await axios.post('https://blogstation-agfm.onrender.com/deleteRefToken', JSON.parse(user))
        .then(data => console.log(data.data.msg))
        .catch(err => console.log(err))
        localStorage.clear()
        axios.defaults.headers.common['Authorization'] = '';
        actions.onLogout(false)
        notify('Logged out successfully!')
    }
    const loggedIn = (state) => {
        if(!state){
            return(
                <div className="right menu" >
                    <div  className="item" style={{padding: '4px'}}> 
                        <div className=" ui button primary" onClick={()=>navigate('/login')}>Login</div>
                    </div>
                    <div className="item" style={{padding: '4px'}}>
                        <div className=" ui button primary" onClick={()=>navigate('/user/new')}>Sign Up</div>
                    </div>
                    
                </div>                
            )
        }
        else{
            return(
                <div className="right menu">
                    <div  className="item">
                        <div onClick={()=>{navigate(`/user/${JSON.parse(user).user._id}`)}} style={{cursor: 'pointer'}}>
                            <b>{JSON.parse(user).user.username}</b>
                        </div>
                    </div>
                    <div className="item" style={{padding: '2px'}}>
                        <div 
                            className="ui button negative" 
                            onClick = {()=>{
                                Logout()
                                navigate('/home')
                            }}
                        >
                            Logout
                        </div>
                    </div>
                </div>
            )
        }
    } 
    return (
        <>
        <div style={{
                width: '100%',
                minWidth: '570px',
                    // marginBottom: '40px',
                    overflow: 'auto',
                    border: '0px',
                    paddingBottom: "1%",
                    // float: 'left',
                    // backgroundColor: 'white'
        }} >
            <div className="ui menu " style={{backgroundColor: 'white'}}>
                <div  className='item' onClick={()=>{navigate('/')}} style={{cursor: 'pointer'}}>
                    <div>BlogStation</div>
                </div>
                <div  className="item" onClick={()=>{navigate('/home')}} style={{cursor: 'pointer'}}>
                    <div >Home</div>
                </div>
                <div  className="item" onClick={()=>{navigate('/posts/new')}} style={{cursor: 'pointer'}}>
                    <div >Add post</div>
                </div>
                {loggedIn(state)}
            </div>
        </div>
        </>
    )
}