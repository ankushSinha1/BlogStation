import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notify } from '../CustomStyling/notify';
// import { Navbar } from '../Navbar/Navbar.js';

export const Deletepost = (props) => {
    const {postId} = useParams();
    const [postDetails, setPostDetails] = useState({});
    const user = localStorage.getItem('user')
    const navigate = useNavigate();
    useEffect(()=> {
        axios.get(`https://blogstation-agfm.onrender.com/posts/${postId}`)
        .then(res => {setPostDetails(res.data)})
        .catch(err => console.log(err))
        axios.delete(`https://blogstation-agfm.onrender.com/posts/${postId}/delete`)
        .then(res => {
            notify(res.data.msg)
        })
        .catch(err => {
            console.log(err)
        })
        
        if(postDetails.author){
            if(postDetails.author.username === JSON.parse(user).user.username){      
                console.log(postDetails)
                axios.delete(`https://blogstation-agfm.onrender.com/posts/${postId}/delete`)
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
            
        }
    }, [])

    return(
        <div>
        {/* <Navbar/> */}
            {navigate('/home')}
        </div>
    )
}