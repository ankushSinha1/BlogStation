import React from "react";
import axios from 'axios';
export const tokenCheck = async (msg) => {
    // const navigate = useNavigate()
    const user = localStorage.getItem('user');
        if(msg === 'Token expired!' && user ){
            
        }

}