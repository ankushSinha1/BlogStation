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
                <>
                <Link 
                    to={`/posts/${postId}/comment/${comment._id}/edit`} 
                    className="mini ui primary button"
                >
                    Edit
                </Link>
                <button 
                    onClick={() => {deleteComment(comment);}} 
                    className="mini ui red button"
                >
                    Delete
                </button> 
                </>
            )
        }
    }
    const authForEditAndDeletePost = () => {
        if(user && `${JSON.parse(user).user.username}` === postDetails.author.username){
            return (
                <>
                    <Link to={`/posts/${postId}/edit`} className="ui button primary">Edit</Link>
                    <Link to={`/posts/${postId}/delete`} className="ui button red">Delete</Link>
                </>
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
                        <div className="ui comments" key={comment._id}>
                            <div className="comment">
                                <img 
                                    src={comment.author.dP} 
                                    alt="err" 
                                    className="avatar" 
                                    style={{height: '55px', width: '55px', borderRadius: '8px'}} 
                                    onClick={()=>(navigate(`/user/${comment.author._id}`))}
                                />
                                <div className="content">
                                    <div className="metadata">
                                        <a className="author" href={`/user/${comment.author._id}`}>
                                            {comment.author.firstName} {comment.author.lastName}
                                        </a>
                                        <div className="date">
                                            <div style={{fontSize: "12px"}}>
                                                {commentDate.getFullYear()}, 
                                                {commentDate.month} {commentDate.getDate()} at {commentDate.getHours()}:{commentDate.getMinutes()}
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className="text">{comment.text}</div>
                                        <br></br>
                                        <div className="rating">
                                            <i className = "heart icon" alt="err">{comment.likes}</i>
                                        </div>
                                        <div className="rating">
                                            <i className = "flag icon" alt="err">{comment.totalReports}</i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {authForEditAndDeleteComment(comment)}
                            <hr></hr>
                        </div>
                    )
                })
            )
        }else{
            return (
                <>
                <div>No comments yet!</div>
                <hr></hr>
                </>
            )
        }
    }
    const date = new Date(postDetails.updatedAt);
    //MONTHS
    {monthNumToName(date)};
    if(postDetails.author){
        return(
            <div>
                <div className="container" style={{marginLeft: '10%', marginRight: '10%'}}>
                    <h2>{postDetails.title}</h2>
                    <img src={postDetails.picture} style={{width: "50%"}} alt="NaN"/>
                    <div className="rating">
                        <i className = "heart icon" alt="err" style={{display: 'inline', transform: {scale: '2'}}}/>{postDetails.likes}{' '}
                        <i className = "flag icon" alt="err" style={{display: 'inline'}}/>{postDetails.totalReports}{' '}
                    </div>
                    <div>Posted by- "{postDetails.author.firstName} {postDetails.author.lastName}"</div>
                    <div>Posted at: {date.getFullYear()}, {date.month} {date.getDate()} at {date.getHours()}:{date.getMinutes()} IST</div>
                    <hr></hr>
                    <p>"{postDetails.description}"</p>
                    {authForEditAndDeletePost()}
                    <hr></hr>
                    <div>
                        {allComments()}
                    </div>
                    <div>
                        <div>
                            <Newcomment postId = {postId}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }else{
        <div>ASDJLAKSDLKA</div>
    }
}