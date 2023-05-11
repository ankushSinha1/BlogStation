import axios from 'axios';
import { Link } from 'react-router-dom';
import {useEffect, useState} from 'react';
export const Homepage = () => {
    const [allPosts, setAllPosts] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:3001/home`)
        .then((res)=>{
            setAllPosts(res.data)
        })
        .catch(err => console.log(err))
    }, [])
    const displayAllPosts = (array) => {
        return (
            array.map(post => {
                return(
                    <div key={post._id} className="ui card">
                        <img src = {post.picture} alt = 'NaN'/>
                        <h5>{post.title}</h5>
                        {post.updatedAt}
                        <Link to={`/posts/${post._id}`}>Show more</Link>
                        <hr></hr>
                    </div>
                )
            })
        )
    }
    return(
        <div>
            {displayAllPosts(allPosts)}
        </div>
    )
}