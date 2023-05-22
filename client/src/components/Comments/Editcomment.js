import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {notify} from '../CustomStyling/notify'
export const Editcomment = () => {
    const {postId} = useParams()
    const {commentId} = useParams()
    let navigate = useNavigate()
    const [text, setText] = useState('');
    const [commentDetails, setCommentDetails] = useState({});
    
    useEffect(() => {
        axios.get(`http://localhost:3001/posts/${postId}/comment/${commentId}`)
        .then((res) => setCommentDetails(res.data))
        .catch(err => console.log(err))
    }, [])
    const onSubmit = (e) => {
        e.preventDefault()
        const updatedComment = {
            text: text,
            author: commentDetails.author,
            likes: 0,
            totalReports: 0,
            postId: postId, 
        }
        axios.patch(`http://localhost:3001/posts/${postId}/comment/${commentId}/update`, updatedComment)
        .then((res) => {
            notify(res.data.msg)
            navigate(`/posts/${postId}`)  
        })
        .catch((err) => console.log(err))
    }
    const cancel = () => {
        navigate(-1)
    }
    return(
        <div>
            <center>
                <h2>Edit your comment</h2>
            </center>
            <p></p>
            <div className="ui container">
                <form className="ui form" onSubmit={e=>onSubmit(e)}>
                    <div className="field" style={{marginLeft: '5%', marginRight: '5%'}}>
                        <div className="ui segments">
                            <div className="ui segment">
                                <textarea
                                    rows="5" 
                                    type="text" 
                                    defaultValue={commentDetails.text} 
                                    onChange={e => setText(e.target.value)} 
                                    required
                                    />
                                <p></p>
                                <input type="submit" className="ui button primary"/>
                                <button type="button" className="ui button red" onClick={cancel}>Cancel</button>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}
