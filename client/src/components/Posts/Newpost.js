import React,{useEffect, useState} from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import {notify} from '../CustomStyling/notify.js'
export const Newpost = () => {
    const user = localStorage.getItem('user');
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState({myPict: ''});

    useEffect(()=>{
        if(!user){
            notify('You need to be logged in to do that!')
            navigate('/login')
        }
    })
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
    const onSubmit = async (e) => {
        e.preventDefault();
        const newPost = {
            title: title,
            description: description,
            author: '',
            picture: picture.myPict,
            comments: [],
            likes: 0,
            totalReports: 0,
        }
        //For uploading image on cloudinary
        await axios.post('http://localhost:3001/posts/uploadImage', picture)
        .then(res => {
            newPost.picture = res.data.secure_url
        })
        .catch(err => console.log(err))

        //For creating a new post
        axios.post('http://localhost:3001/posts/new', newPost)
        .then((res) => {
            if(res.data.msg === 'Token expired!'){
                notify('Id expired.')
                axios.post('http://localhost:3001/refToken', JSON.parse(user))
                .then(data => {
                    if(data.data.msg === 'RefToken expired'){
                        axios.post('http://localhost:3001/deleteRefToken', JSON.parse(user))
                        .then(data => console.log(data))
                        .catch(err => console.log(err))

                        notify('Error occurred. Login required')
                        navigate('/login')
                    }else{
                        localStorage.clear()
                        localStorage.setItem('user', JSON.stringify(data.data))
                        axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
                        navigate('/home')
                        notify('New Id registered!')
                        notify("Could not submit your post. Try again.")
                    }
                })
                .catch(err => console.log(err))
            }
            else{
                notify('New post added!')
                navigate('/home')
            }
        })
        .catch(err => console.log(err))
        setTitle('')
        setDescription('')
        setPicture({myPict: ''})
 
    }
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
                            <div className="field column">
                                <label htmlFor="pict">Upload a picture *</label>
                                <input
                                    type="file"
                                    id="pict"
                                    required
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
