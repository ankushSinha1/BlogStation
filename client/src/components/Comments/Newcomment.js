import axios from "axios"
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../CustomStyling";
export const Newcomment = (props) => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const onSubmit = (e) => {
        let newComment = {
            text: text,
            author: '',
            postId: props.postId,
            likes: 0,
            totalReports: 0,
        }
        axios.post(`http://localhost:3001/posts/${props.postId}/comment/new`, newComment)
        .then(res => {
            notify(res.data.msg)
        })
        .catch(err => console.log(err));
        setText('')
    }
    return(
        <div>
            <h3>Add a comment</h3>
            <form className="ui form"  onSubmit={e => onSubmit(e)}>
                <div className="ui segments">
                    <div className="ui segment">
                    <textarea
                        rows="5"
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