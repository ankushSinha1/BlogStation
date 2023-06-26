import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notify } from '../CustomStyling/notify';
import rootRoute from '../API/axiosRoot';
// import { Navbar } from '../Navbar/Navbar.js';

export const Deletepost = (props) => {
    const {postId} = useParams();
    const [postDetails, setPostDetails] = useState({});
    const user = localStorage.getItem('user')
    const navigate = useNavigate();
    useEffect(()=> {
        rootRoute.get(`/posts/${postId}`)
        .then(res => {setPostDetails(res.data)})
        .catch(err => console.log(err))
        rootRoute.delete(`/posts/${postId}/delete`)
        .then(res => {
            notify(res.data.msg)
        })
        .catch(err => {
            console.log(err)
        })
        
        // if(postDetails.author){
        //     if(postDetails.author.username === JSON.parse(user).user.username){      
        //         console.log(postDetails)
        //         axios.delete(`/posts/${postId}/delete`)
        //         .then(res => {
        //             notify(res.data.msg)
        //         })
        //         .catch(err => {
        //             console.log(err)
        //         })
        //     }else{
        //         notify('You are not authorized to access this route!')
        //     }
        //     notify('Post deleted')
            
        // }
    }, [])
    const deletePost = async () => {
        await rootRoute.delete(`/posts/${postId}/delete`)
        .then(res => {
            notify(res.data.msg)
        })
        .catch(err => {
            console.log(err)
        })
        
        if(postDetails.author){
            if(postDetails.author.username === JSON.parse(user).user.username){      
                console.log(postDetails)
                rootRoute.delete(`/posts/${postId}/delete`)
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
    }
    return(
        <div>
        {/* <Navbar/> */}
            {deletePost()}
        </div>
    )
}