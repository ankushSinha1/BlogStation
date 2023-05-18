import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {useEffect, useState} from 'react';
export const Homepage = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [user, setUser] = useState(localStorage.getItem('user'));
    useEffect( () => {
         // var isExpiredToken = false;
            // var dateNow = new Date();
            // if(decoded.exp < dateNow.getTime()/1000){
            //     isExpiredToken = true;
            // }
            //Get user from the token
            // if(isExpiredToken){
            //     axios.post('http://localhost:3001/token')
            // }
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
                {monthNumberToName(date)};
                return(
                    <div key={post._id} className="ui card">
                        <img src = {post.picture} alt = 'No picture provided'/>
                        <h3>{post.title}</h3>
                        <p>{post.author}</p>
                        <Link to={`/posts/${post._id}`}>Show more</Link>
                        <br></br>
                    </div>
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