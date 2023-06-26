import axios from "axios"
import rootRoute from '../API/axiosRoot.js';
import React, {useEffect, useState} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { notify } from "../CustomStyling/notify";
// import { Navbar } from '../Navbar/Navbar.js';
        
export const Newcomment = () => {
    var {postId} = useParams()
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [authorDetails, setAuthorDetails] = useState({});
    const [msg, setMsg] = useState('');
    const user = localStorage.getItem('user')
    useEffect(() => {
        if(user){
            rootRoute.defaults.headers.common['Authorization'] =  `Bearer ${JSON.parse(user).token}`
            rootRoute.get(`/user/${JSON.parse(user).user._id}`)
            .then((res) => {
                setAuthorDetails(res.data)
            })
            .catch(err=>console.log(err))
        }

    }, [])
    const onSubmit = async (e) => {
        e.preventDefault()
        if(!user){
            notify('You need to be logged in to do that!')
            navigate('/login')
        }
        else{

            let newComment = {
                text: text,
                author: authorDetails,
                postId: postId,
                likes: 0,
                totalReports: 0,
            }
            await rootRoute.post(`/posts/${postId}/comment/new`, newComment)
            .then(async res => {
                if(res.data.msg === 'Token expired!'){
                notify('Id expired.')
                await rootRoute.post('/refToken', JSON.parse(user))
                .then(async data => {
                    //if reftoken is also expired
                    if(data.data.msg === 'RefToken expired'){
                        await rootRoute.post('/deleteRefToken', JSON.parse(user))
                        .then(data => console.log(data))
                        .catch(err => console.log(err))
                        notify('Error occurred. Login required')
                        navigate('/login')
                    }else{
                        //if reftoken is intact
                        localStorage.clear()
                        localStorage.setItem('user', JSON.stringify(data.data))
                        rootRoute.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
                        navigate('/home')
                        notify('New Id registered!')
                        notify("Could not add your comment. Try again.")
                    }
                })
                .catch(err => console.log(err))
            }else{
                //if access token is intact
                notify('Comment added!')
                navigate(`/home`)
            }
        })
        .catch(err => console.log(err));
        setText('')
        }
    }
    return(
        <div>
            {/* <Navbar/> */}
            <h3>Add a comment</h3>
            <form className="ui form"  onSubmit={e => onSubmit(e)}>
                <div className="ui segments">
                    <div className="ui segment">
                    <textarea
                        rows="6"
                        type="text" 
                        placeholder="Comment" 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        required
                    />
                    <p></p>
                    <input type="submit" className="ui button primary"/>
                    </div>
                </div>

            </form>
        </div>
    )
}