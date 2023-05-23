import React, {useState, useEffect} from "react";
import axios from "axios";
import { notify } from "../CustomStyling/notify.js";
import {Link, useNavigate, useParams} from 'react-router-dom'
import {Newcomment} from '../Comments/Newcomment.js'
import {monthNumToName} from '../Controllers/monthNumToName.js';


export const Showpost = () => {
    const {postId} = useParams()
    let navigate = useNavigate();
    const [postDetails, setPostDetails] = useState({});
    const [postComments, setPostComments] = useState([]);
    const user = localStorage.getItem('user')
    useEffect(()=>{
        if(user){
            axios.defaults.headers.common['Authorization'] =  `Bearer ${JSON.parse(user).token}`
        }
        axios.get(`http://localhost:3001/posts/${postId}`)
        .then((res) => {
            setPostDetails(res.data)
        })
        .catch((err)=>console.log(err));
        axios.get(`http://localhost:3001/posts/${postId}/comment`)
        .then((res) => {
            setPostComments(res.data)
        })
        .catch((err) => console.log(err))
    }, [])

    const authForEditAndDeleteComment = (comment) => {
        if(user && JSON.parse(user).user._id === comment.author._id){
            return (
                <div style={{margin: '10px 0px 10px 0px'}}>
                <Link to={`/posts/${postId}/comment/${comment._id}/edit`} 
                    style={{
                        marginRight: '20%',
                    }} 
                    className="tiny ui primary button"
                    >
                    Edit this comment
                </Link>
                <button onClick={() => {deleteComment(comment);}} 
                    className="tiny ui red button" 
                    style={{
                        float: 'right'
                    }}
                >
                    Remove this comment
                </button> 
                </div>
            )
        }
    }
    const authForEditAndDeletePost = () => {
        if(user && `${JSON.parse(user).user.username}` === postDetails.author.username){
            return (
                <div style={{margin: '10px'}}>
                    <Link to={`/posts/${postId}/edit`} className="ui button primary">Edit post</Link>
                    <Link to={`/posts/${postId}/delete`} className="ui button negative"
                        style={{
                            float: 'right'
                        }}>Delete post</Link>
                </div>
            )
        }
    }
    const deleteComment = (COMMENT) => {
        console.log(COMMENT)
        if(COMMENT.author.email === JSON.parse(user).user.email){
            axios.delete(`http://localhost:3001/posts/${postId}/comment/${COMMENT._id}/delete`)
            .then((res) => notify(res.data.msg))
            .catch(err => console.log(err))
        }else{
            notify('You are not authorized to access this route')
        }
        navigate(0)
    }
    const allComments = () => {
        if(postComments.length>0){
            return (
                postComments.map((comment) => {
                    let commentDate = new Date(comment.updatedAt);
                    commentDate = monthNumToName(commentDate)
                    return (
                        <div className="ui comments" key={comment._id} style={{ maxWidth: '100%', padding: '25px'}}>
                            <div className="comment">
                                <img 
                                    src={comment.author.dP} 
                                    alt="err" 
                                    className="avatar" 
                                    style={{height: '50px', width: '50px', borderRadius: '15px', cursor: 'pointer'}} 
                                    onClick={()=>(navigate(`/user/${comment.author._id}`))}
                                />
                                <div className="content" style={{}}>
                                    <div className="metadata" style={{width: '98%'}}>
                                        <Link className="author" to={`/user/${comment.author._id}`} style={{}}>
                                            {comment.author.firstName} {comment.author.lastName}
                                        </Link>
                                        <div className="date">
                                            <div style={{fontSize: "12px",}}>
                                                {commentDate.month} {commentDate.getDate()},  {commentDate.getFullYear()} 

                                            </div>
                                        </div>
                                        <br></br>
                                        <div 
                                            className="text" 
                                            style={{
                                                width: '100%'
                                            }}
                                        >
                                            {comment.text}
                                        </div>
                                        <br></br>
                                        <div style={{margin: '2px'}}>
                                            <div className=''  style={{ display: 'inline'}}>
                                                <i className="red heart outline link icon"></i>
                                                    {postDetails.likes} Likes
                                            </div>
                                            <div className="" style={{ display: 'inline',  position: 'absolute', right: '0px'}}>
                                                <i className="red flag outline link icon" ></i>
                                                    {postDetails.totalReports} Reports
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {authForEditAndDeleteComment(comment)}
                            <div style={{backgroundColor: '#e5e5e5', height: '1px', margin: '25px'}}></div>

                        </div>
                    )
                })
            )
        }else{
            return (
                <>
                <div>No comments yet!</div>
                <div style={{backgroundColor: '#e5e5e5', height: '1px', margin: '25px'}}></div>
                </>
            )
        }
    }
    const date = new Date(postDetails.updatedAt);
    //MONTHS
    {monthNumToName(date)};
    if(postDetails.author){
        return(
                <div className="ui container" 
                style={{
                    marginLeft: '50%', 
                    marginRight: '50%', 
                    padding: '1%', 
                    background: 'white',
                    minWidth: '500px'
                }} >
                    <h2>{postDetails.title}</h2>
                    <div style={{height:'100%', width: '100%'}}>
                        <img src={postDetails.picture} style={{ maxWidth: "100%", height: '100%', width: '100%'}} alt="NaN"/>
                    </div>
                    <br></br>
                    <div style={{margin: '10px 0px 10px 0px'}}>

                        <div className=''  style={{ display: 'inline'}}>
                            <i className="red heart outline link icon"></i>
                                {postDetails.likes} Likes
                        </div>
                        <div className="" style={{ display: 'inline', float: 'right'}}>
                            <i className="red flag outline link icon" ></i>
                                {postDetails.totalReports} Reports
                        </div>
                    </div>
                    <div style={{margin: '10px 0px 10px 0px'}}>
                        <div style={{display: 'inline'}}>
                            <Link to={`/user/${postDetails.author._id}`} 
                                    style={{
                                        color: 'black',
                                        fontWeight: '700',
                                        // fontSize: '5px'
                                    }}
                                >
                                    {postDetails.author.firstName} {postDetails.author.lastName}
                                </Link>
                        </div>
                        <div style={{float: 'right', display: 'inline', right: '0px'}}>
                            {date.month} {date.getDate()}, {date.getFullYear()}
                        </div>
                    </div>
                    <div style={{height: '20px'}}></div>

                    <p style={{
                        margin: '0px 0px 35px 0px'
                    }}>
                        "{postDetails.description}"
                    </p>
                    {authForEditAndDeletePost()}
                    <div style={{backgroundColor: '#e5e5e5', height: '1px', margin: '30px'}}></div>

                    <div>
                        {allComments()}
                    </div>
                    <div>
                        <div>
                            <Newcomment postId = {postId}/>
                        </div>
                    </div>
                </div>
        )
    }else{
        <div>Loading...</div>
    }
}