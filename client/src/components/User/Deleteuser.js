import React, { useEffect, useState } from "react";
import axios from 'axios';
import {notify} from '../CustomStyling/notify.js';
import { useNavigate, useParams } from "react-router-dom";
import rootRoute from "../API/axiosRoot.js";
// import { Navbar } from '../Navbar/Navbar.js';

export const Deleteuser = () => {
    const {userId} = useParams();
    const [userDetails, setUserDetails] = useState({})
    const user = localStorage.getItem('user')
    const navigate = useNavigate();
    useEffect(() => {
        if(!user){
            notify('You need to be logged in to do that!')
            navigate('/login')
        }else{

            rootRoute.get(`/user/${userId}`)
            .then(res => {
                setUserDetails(res.data)
            })
            .catch(err => console.log(err))   
        }

    }, []) 
    const deleteUser = () => {
        if(userDetails._id){
            if(userDetails.email === JSON.parse(user).user.email){
                rootRoute.delete(`/user/${userId}/delete`)
                .then((res)=>{
                    localStorage.clear();
                    rootRoute.defaults.headers.common['Authorization'] = ``;
                    navigate('/home')
                    notify(res.data.msg);
                })
                .catch(err => console.log(err))
            }else{
                notify('You are not authorized to access this route!')
            }
        }else{
            notify('Fetching')
        }
        {navigate('/home')}
    }
    return(<>
        {/* <Navbar/> */}
        {deleteUser()}
    </>)
}