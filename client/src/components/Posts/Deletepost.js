import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
export const Deletepost = (props) => {
    const navigate = useNavigate();
    useEffect(()=>{
        axios.delete(`http://localhost:3001/posts/${props.postId.postId}/delete`)
        .then((res) => console.log(res.data.msg))
        .catch((err) => console.log(err));
        navigate(`/home`)
    }, [])
    return(null)
}