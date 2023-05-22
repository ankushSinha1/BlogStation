import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notify } from '../CustomStyling/notify';
export const Deletepost = (props) => {
    const {postId} = useParams();
    const [postDetails, setPostDetails] = useState({});
    const user = localStorage.getItem('user')
    const navigate = useNavigate();
    useEffect(()=> {
        axios.get(`http://localhost:3001/posts/${postId}`)
        .then(res => {setPostDetails(res.data)})
        .catch(err => console.log(err))
        axios.delete(`http://localhost:3001/posts/${postId}/delete`)
        .then(res => {
            notify(res.data.msg)
        })
        .catch(err => {
            console.log(err)
        })
        
        if(postDetails.author){
            if(postDetails.author.username === JSON.parse(user).user.username){      
                console.log(postDetails)
                axios.delete(`http://localhost:3001/posts/${postId}/delete`)
                .then(res => {
                    notify(res.data.msg)
                })
                .catch(err => {
                    console.log(err)
                })
            }else{
                notify('You are not authorized to access this route!')
            }
            notify('Post deleted')
            navigate('/home')
        }
    }, [])

    return(<div></div>)
}