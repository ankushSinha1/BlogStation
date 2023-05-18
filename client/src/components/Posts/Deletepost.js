import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { notify } from '../CustomStyling/notify';
export const Deletepost = async (props) => {
    // const navigate = useNavigate();
    useEffect( ()=>{
        axios.delete(`http://localhost:3001/posts/${props.postId.postId}/delete`)
        .then(res => {
            notify(res.data.msg)
        })
        .catch(err => {
            console.log(err)
        })
        // navigate('/home')
    }, [])
    return(<></>)
}