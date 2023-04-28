import React,{useState} from "react"
import axios from 'axios'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export const Newpost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState(``);
    const [picture, setPicture] = useState('');
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [totalReports, setTotalReports] = useState(0);

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }
    const onChangePicture =(e) => {
        setPicture(e.target.value);
    }
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }
    const onSubmit = () => {
        const newPost = {
            title: title,
            description: description,
            author: author,
            picture: picture,
            comments: comments,
            likes: likes,
            totalReports: totalReports,
        }
        axios.post('http://localhost:3001/posts/new', newPost)
        .then((res) => {navigate(-1)})
        .catch(err => console.log(err))
        setTitle('')
        setDescription('')
        setAuthor('')
        setPicture('')
        setComments([])
        setLikes(0)
        setTotalReports(0)
    }
    return(
        <div className="container">
        <h3 className="ui center aligned header">Something on your mind... ?</h3>
            <form className="ui form" onSubmit={onSubmit}>
                <div>
                    <div className="field"  style={{marginLeft: '15%', marginRight: '15%'}}>
                        <div className="ui two column doubling grid" style={{margin: "10%", marginTop: "0%"}}>
                            <div className="field column" >
                                <label>Title *</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={title}
                                    placeholder="Enter Title" 
                                    required
                                    onChange={onChangeTitle}
                                />
                            </div>
                            <div className="field column" >
                                <label>Picture</label>
                                <input 
                                    type="text" 
                                    name="picture" 
                                    value={picture}
                                    placeholder="Enter url of a picture"  
                                    onChange={onChangePicture}
                                />
                            </div>
                            <div>
                                <label><b>Description *</b></label>
                                <textarea rows="25" cols="1000"
                                    type="text" 
                                    name="description" 
                                    value={description}
                                    placeholder="Enter Content" 
                                    required  
                                    onChange={onChangeDescription}
                                />
                            </div>
                            
                            <div style={{alignItems: "center"}}>
                                <input 
                                    type="submit" 
                                    placeholder="Submit" 
                                    className="ui blue button"
                                />
                                <button 
                                    className="ui button red"
                                    onClick={() => {navigate('/home')}}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}