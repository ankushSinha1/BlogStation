import React,{useState} from "react"
import axios from 'axios'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {notify} from '../CustomStyling/index.js'
export const Newpost = () => {
    const token = useSelector(state=>state.token);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState(``);
    const [picture, setPicture] = useState({myPict: ''});
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [totalReports, setTotalReports] = useState(0);

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }
    const onChangePicture = async (e) => {
        const file = e.target.files[0]
        const base64 = await convToBase64(file)
        setPicture({myPict: base64})
    }    
    const convToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
            fileReader.onerror = (error) =>{
                reject(error)
            }
        })
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            title: title,
            description: description,
            author: author,
            picture: picture.myPict,
            comments: comments,
            likes: likes,
            totalReports: totalReports,
        }
        axios.post('http://localhost:3001/posts/new', newPost)
        .then((res) => {
            notify(res.data.msg)
            navigate('/home')
        })
        .catch(err => console.log(err))
        setTitle('')
        setDescription('')
        setAuthor('')
        setPicture({myPict: ''})
        setComments([])
        setLikes(0)
        setTotalReports(0)
    }
    if(token){
        return(
            <div className="container">
            <h3 className="ui center aligned header">Something on your mind... ?</h3>
                <form className="ui form" onSubmit={onSubmit}>
                    <div>
                        <div className="field"  style={{marginLeft: '15%', marginRight: '15%'}}>
                            <div style={{margin: "10%", marginTop: "0%"}}>
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
                                {/* <div className="field column" >
                                    <label for="picture">Picture</label>
                                    <input 
                                        type="text" 
                                        name="picture" 
                                        value={picture}
                                        placeholder="Enter url of a picture"  
                                        onChange={onChangePicture}
                                    />
                                </div> */}
                                <div className="field column">
                                    <label htmlFor="pict">Upload a picture</label>
                                    <input
                                        type="file"
                                        id="pict"
                                        accept='.png, .jpg, .jpeg'
                                        onChange={e=>onChangePicture(e)}
                                    />
                                    <button onClick={()=>setPicture({myFile: ''})}>Cancel</button>
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
    else{
        navigate('/login')
        notify("You need to be logged in first!")
    }
}
