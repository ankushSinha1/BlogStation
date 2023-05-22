import React from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
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
    const displayAllPosts = (array) => {
        if(array[0]){
            return (
                array.map(post => {
                    const date = new Date(post.updatedAt);
                    //MONTHS
                    {monthNumToName(date)};
                    return(
                        // <div className='container' style={{padding: '10px'}}>
                            <div className="ui card raised link" key={post._id} >
                            <div className="content">
                                <img 
                                    className="ui avatar image middle aligned" 
                                    src={post.author.dP}  
                                    onClick={()=>{navigate(`/user/${post.author._id}`)}}
                                    style={{cursor: 'pointer', }}
                                    />
                                <span 
                                    onClick={()=>{navigate(`/user/${post.author._id}`)}}
                                    style={{cursor: 'pointer', width: 'max-content'}}
                                    >
                                <b>

                                    {post.author.username}
                                </b>
                                </span>
                            </div>
                            <div  onClick={()=>navigate(`/posts/${post._id}`)} style={{cursor: 'pointer', margin: '2%'}}>
                            <h4>{post.title}</h4>
                            </div>

                            <div className="image " onClick={()=>navigate(`/posts/${post._id}`)} style={{cursor: 'pointer', width: '100%'}}>
                                <img src={post.picture} style={{opacity: '85%'}}/>
                            </div>
                            <div className="content">
                                <div class="description">
                                    {post.description.slice(0, 70)}...
                                </div>
                                <div style={{padding: '10px'}}>
                                </div>
                                    <span className='left floated'>
                                        <i className="red heart outline link icon"></i>
                                        {post.likes}    
                                    </span>
                                    <span className="right floated">
                                        <i className="red flag outline link icon"></i>
                                        {post.totalReports}
                                    </span>
                            </div>
                        {/* </div> */}
                    </div>
                )
            })
            )
        }else{
            return(
                <div>
                    <div className="ui active inverted dimmer" >
                        <div className='ui large text loader'>
                        <p>Fetching all posts</p>

                        </div>
                    </div>
                </div>
            ) 
        }
    }
    return(
        <div>
            {displayAllPosts(allPosts)}
        </div>
    )
}