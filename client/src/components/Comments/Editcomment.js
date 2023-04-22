import React, {useState, useEffect} from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
export const Editcomment = () => {
    let navigate = useNavigate()
    const {state} = useLocation();
    const [text, setText] = useState('');
    const [commentDetails, setCommentDetails] = useState({});
    const {postId} = state;
    const {commentId} = state;
    useEffect(() => {
        axios.get(`http://localhost:3001/posts/${postId}/comment/${commentId}`)
        .then((res) => setCommentDetails(res.data))
        .catch(err => console.log(err))
    }, [])
    const onSubmit = () => {
        const updatedComment = {
            text: text,
            author: '',
            likes: 0,
            totalReports: 0,
            postId: postId, 
        }
        axios.patch(`http://localhost:3001/posts/${postId}/comment/${commentId}/update`, updatedComment)
        .then((res) => {
            console.log("Comment updated");
            navigate(-1)    
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
                <form className="ui form" onSubmit={onSubmit}>
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
