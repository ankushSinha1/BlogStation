import React from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import {useEffect, useState} from 'react';
import {monthNumToName} from '../Controllers/monthNumToName'
export const Homepage = () => {
    const navigate = useNavigate()
    const [allPosts, setAllPosts] = useState([]);
    const user = localStorage.getItem('user')
    useEffect(() => {
        if(user){
            axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(user).token}`;
        }
        axios.get(`https://blogstation-agfm.onrender.com/home`)
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
                        <div className='column' style={{padding: '4%'}}>
                            <div className="ui segment card raised" key={post._id} style={{width: '100%'}}>
                                <div className="content" style={{width: '100%', height: '100%'}}>
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

                            <div className="image " onClick={()=>navigate(`/posts/${post._id}`)} style={{cursor: 'poi   nter'}}>
                                <img src={post.picture} style={{opacity: '85%', cursor: 'pointer'}} className='responsive  '/>
                            </div>
                            <div className="content">
                                <div class="description" style={{cursor: 'pointer'}} onClick={()=>navigate(`/posts/${post._id}`)}>
                                    {post.description.slice(0, 50)}...
                                </div>
                                <div style={{padding: '6%'}}>
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
                        </div>
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
        <>
        <div className='ui three column doubling grid' >
            {displayAllPosts(allPosts)}
        </div>
        </>
    )
}