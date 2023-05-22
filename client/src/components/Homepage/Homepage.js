import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {useEffect, useState} from 'react';
import {monthNumToName} from '../Controllers/monthNumToName'
export const Homepage = () => {
    const navigate = useNavigate()
    const [allPosts, setAllPosts] = useState([]);
    const user = localStorage.getItem('user')
    useEffect( () => {
        if(user){
            axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(user).token}`;
        }
        axios.get(`http://localhost:3001/home`)
        .then(res => {setAllPosts(res.data)})
        .catch(err =>console.log(err) )
    }, [])
    const monthNumberToName = (date) => {
        //MONTHS
        if(date.getMonth() === 1-1){
            date.month = 'January'
        }else if(date.getMonth() === 2-1){
            date.month = 'February'
        }else if(date.getMonth() === 3-1){
            date.month = 'March'
        }else if(date.getMonth() === 4-1){
            date.month = 'April'
        }else if(date.getMonth() === 5-1){
            date.month = 'May'
        }else if(date.getMonth() === 6-1){
            date.month = 'June'
        }else if(date.getMonth() === 7-1){
            date.month = 'July'
        }else if(date.getMonth() === 8-1){
            date.month = 'August'
        }else if(date.getMonth() === 9-1){
            date.month = 'September'
        }else if(date.getMonth() === 10-1){
            date.month = 'October'
        }else if(date.getMonth() === 10){
            date.month = 'November'
        }else if(date.getMonth() === 11){
            date.month = 'December'
        }
    }

    const displayAllPosts = (array) => {
        return (
            array.map(post => {
                const date = new Date(post.updatedAt);
                //MONTHS
                {monthNumToName(date)};
                return(
                    <div className="ui card" key={post._id} style={{margin: '2%', height: '30%', width: '30%'}}>
                        <div className="content">
                            <img 
                                className="ui avatar image" 
                                src={post.author.dP}  
                                onClick={()=>{navigate(`/user/${post.author._id}`)}}
                                style={{cursor: 'pointer'}}
                            />
                            <span 
                                onClick={()=>{navigate(`/user/${post.author._id}`)}}
                                style={{cursor: 'pointer'}}
                            >
                                {post.author.username}
                            </span>
                        </div>
                        <div  onClick={()=>navigate(`/posts/${post._id}`)} style={{cursor: 'pointer', margin: '2%'}}>
                        <h4>{post.title}</h4>
                        </div>

                        <div className="image" onClick={()=>navigate(`/posts/${post._id}`)} style={{cursor: 'pointer'}}>
                            <img src={post.picture}/>
                        </div>
                        <div className="content">
                            <span className='left floated'>
                                <i className="red heart outline link icon"></i>
                                {post.likes}    
                            </span>
                            <span className="right floated">
                                <i className="red flag outline link icon"></i>
                                {post.totalReports}
                            </span>
                        </div>
                    </div>
                    // <div key={post._id} className="ui card">
                    //     <img src = {post.picture} alt = 'No picture provided'/>
                    //     <h3>{post.title}</h3>
                    //     <p>{post.author.firstName} {post.author.lastName}</p>
                    //     <Link to={`/posts/${post._id}`}>Show more</Link>
                    //     <br></br>
                    // </div>
                )
            })
        )
    }
    if(allPosts){
        return(
            <div>
                {displayAllPosts(allPosts)}
            </div>
        )
    }else{
        return(
            <div>Loading..</div>
        )
    }
}