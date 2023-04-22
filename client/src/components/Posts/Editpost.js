import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const Editpost = (props) => {
    let navigate = useNavigate();
    const [postDetails, setPostDetails] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');

    useEffect(()=>{
        axios.get(`http://localhost:3001/posts/${props.postId.postId}/edit`)
        .then( res => setPostDetails(res.data))
        .catch( error => console.log(error));
        setTitle(postDetails.title)
        setDescription(postDetails.description)
        setPicture(postDetails.picture)
    },[])
    const onSubmit = (event) => {
        event.preventDefault();
        const updatedPost = {
            title: title,
            picture: picture,
            description: description,
            author: postDetails.author,
            comments: postDetails.comments,
            likes: postDetails.likes,
            totalReports: postDetails.totalReports,
        }
        axios.patch(`http://localhost:3001/posts/${props.postId.postId}/update`, updatedPost)
        .then(async res => console.log(res.data))
        setTitle('')
        setDescription('')
        setPicture('')
        navigate(`/posts/${props.postId.postId}`)
    }
    const cancel = () => {
        navigate(-1)
    }
    return(
        <div>
            Edit Post
            <form className="ui form" onSubmit={onSubmit}>
                <div>
                    <div className="field"  style={{marginLeft: '15%', marginRight: '15%'}}>
                        <div className="ui two column doubling grid" style={{margin: "10%", marginTop: "0%"}}>
                            <div className="field column" >
                                <label>Title *</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    defaultValue={postDetails.title}
                                    required
                                    onChange={e=>setTitle(e.target.value)}
                                />
                            </div>
                            <div className="field column" >
                                <label>Picture</label>
                                <input 
                                    type="text" 
                                    name="picture"
                                    defaultValue={postDetails.picture}
                                    onChange={e=>setPicture(e.target.value)}
                                />
                            </div>
                            <div>
                                <label><b>Description *</b></label>
                                <textarea rows="25" cols="1000"
                                    type="text" 
                                    name="description"
                                    defaultValue={postDetails.description}
                                    required  
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                            
                            <div style={{alignItems: "center"}}>
                                <input 
                                    type="submit" 
                                    className="ui blue button"
                                />
                                <button className='ui red button' onClick={() => cancel()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}