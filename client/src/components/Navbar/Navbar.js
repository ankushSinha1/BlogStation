import React from "react";
import { useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import { bindActionCreators } from "redux";
import { actionCreator } from "../../state/index";
import { notify } from "../CustomStyling/notify.js";
import rootRoute from "../API/axiosRoot";
// import { Logout } from "../Auth/Logout.js";
// import { useEffect, useState } from "react";

export const Navbar = () => {
    const navigate = useNavigate()
    const user = localStorage.getItem('user')
    const login = useSelector(state => state.login);
    const dispatch = useDispatch();
    const actions = bindActionCreators(actionCreator, dispatch)
    const Logout = async () => {
        await rootRoute.post('/deleteRefToken', JSON.parse(user).refToken)
        .then(data => console.log(data.data.msg))
        .catch(err => console.log(err))
        actions.onLogout({isLoggedIn: false})
        localStorage.clear()
        rootRoute.defaults.headers.common['Authorization'] = '';
        notify('Logged out successfully!')
    }
    const loggedIn = (login) => {
        if(login.isLoggedIn === false && !user){
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
                    <div><b>BlogStation</b></div>
                </div>
                <div  className="item" onClick={()=>{navigate('/home')}} style={{cursor: 'pointer'}}>
                    <div ><b>Home</b></div>
                </div>
                <div  className="item" onClick={()=>{navigate('/posts/new')}} style={{cursor: 'pointer'}}>
                    <div ><b>Add post</b></div>
                </div>
                {loggedIn(login)}
            </div>
        </div>
        </>
    )
}