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
    return(
        <div>
            <center>
            </center>
            <p></p>
            <div className="ui container">
                <form className="ui form" onSubmit={e=>onSubmit(e)} style={{
                // margin: 'auto',
                // width: '100%',
                minWidth: '500px',
                background: 'white'
                
            }}>
                    <div className="field" style={{
                        // marginLeft: '15%',
                        // marginRight: '15%',
                        width: '80%',
                        border: '15px solid white',
                        borderRadius: '4px',
                        margin: 'auto',
                        background: 'white',
                        opacity: '90%'
                    }}>
                        <h2 className="ui center aligned header">Edit your comment</h2>
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
                                <div className='ui footer' 
                                style={{
                                    width: '96%',
                                    margin: 'auto',
                                    alignItems: "center"
                                }}>
                                <div style={{}} >
                                    <input 
                                        type="submit" 
                                        placeholder="Submit post" 
                                        className="ui positive button fluid "
                                        id='submit'
                                        />
                                </div>
                                <div style={{height: '10px'}}></div>
                                {/* <br></br> */}
                                <button 
                                    className="ui button red fluid"
                                    onClick={() => {navigate(-1)}}
                                    >
                                    Cancel
                                </button>
                                <div style={{margin: '10px 0px 0px 0px'}}>
                                </div>
                            </div> 
                                {/* <input type="submit" className="ui button primary"/>
                                <button type="button" className="ui button red" onClick={cancel}>Cancel</button> */}
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}
