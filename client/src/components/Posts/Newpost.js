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
    const [authorDetails, setAuthorDetails] = useState({});

    useEffect(()=>{
        if(!user){
            notify('You need to be logged in to do that!')
            navigate('/login')
        }else{

            axios.get(`https://blogstation-agfm.onrender.com/user/${JSON.parse(user).user._id}`)
            .then((res) => {
                setAuthorDetails(res.data)
            }).catch(err => console.log(err))
        }
    }, [])
    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }
    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }
    const onChangePicture = async (e) => {
        setPicture({myPict: ''})
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
            author: authorDetails,
            picture: picture.myPict,
            comments: [],
            likes: 0,
            totalReports: 0,
        }
        //For uploading image on cloudinary
        if(!picture.myPict){
            notify('No image was given. Please upload an image')
        }else{

            await axios.post('https://blogstation-agfm.onrender.com/posts/uploadImage', picture)
            .then(res => {
                newPost.picture = res.data.secure_url
            })
            .catch(err => console.log(err))
            
            //For creating a new post
            axios.post('https://blogstation-agfm.onrender.com/posts/new', newPost)
            .then((res) => {
                //if access token is expired
                if(res.data.msg === 'Token expired!'){
                    notify('Id expired.')
                    axios.post('https://blogstation-agfm.onrender.com/refToken', JSON.parse(user))
                    .then(data => {
                        //if reftoken is also expired
                        if(data.data.msg === 'RefToken expired'){
                            axios.post('https://blogstation-agfm.onrender.com/deleteRefToken', JSON.parse(user))
                            .then(data => console.log(data))
                            .catch(err => console.log(err))
                            notify('Error occurred. Login required')
                            navigate('/login')
                        }else{
                            //if reftoken is intact
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
                    //if access token is intact
                    notify('New post added!')
                    navigate('/home')
                }
            })
            .catch(err => console.log(err))
            setTitle('')
            setDescription('')
            setPicture({myPict: ''})
        }
        
    }
    return(
        <div className="ui container" style={{
            marginLeft: '50%',
            marginRight: '50%'
        }}>
            <form className="ui form" onSubmit={onSubmit} style={{
                // margin: 'auto',
                // width: '100%',
                minWidth: '500px',
                background: 'white'
                
            }}>
                <div>
                    <div className="field"  style={{
                        // marginLeft: '15%',
                        // marginRight: '15%',
                        width: '80%',
                        border: '15px solid white',
                        borderRadius: '4px',
                        margin: 'auto',
                        // background: 'white',
                        opacity: '90%'
                    }}>
                        <h3 className="ui center aligned header" style={{margin: '2%'}}>   Something on your mind... ?</h3>
                        <div style={{ }}>
                            <div className="field column required" >
                                <label>Title</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={title}
                                    placeholder="Enter Title" 
                                    required
                                    onChange={onChangeTitle}
                                />
                            </div>
                            <div className="ui segment field column required"
                                    style={{
                                        maxHeight: '100%',
                                        height: '40%',
                                        padding: '10px',
                                        width: '100%',
                                        // marginTop: '30px',
                                        marginBottom: '33px',
                                    }}
                                    >
                                    <center>

                                    <img src={picture.myPict} alt='Selected image will be shown here' className='responsive'
                                        style={{
                                            position: 'float',
                                            maxHeight: '50%',
                                            width: '50%',
                                            overflow: 'auto',
                                            border: '5px solid #f7f7f9',
                                        }}
                                        />
                                        </center>
                                    <center>
                                        {picture.myPict ? (
                                            <button onClick={() => setPicture({myPict: ''})}
                                                className='ui negative button' 
                                                style={{
                                                    marginTop: '55px',
                                                    marginLeft: 'auto',
                                                    marginRight: 'auto',
                                                    marginBottom:'15px',
                                                    padding: '10px',
                                                    width: 'auto',
                                                    cursor: 'pointer',
                                                }}
                                            > 
                                                Remove image
                                            </button>
                                            ) : 
                                            <>
                                                <label for='IMAGE' className='ui button'
                                                    style={{
                                                        marginTop: '55px',
                                                        marginLeft: 'auto',
                                                        marginRight: 'auto',
                                                        marginBottom:'15px',
                                                        padding: '10px',
                                                        width: 'auto',
                                                        cursor: 'pointer',
                                                    }}
                                                    >
                                                    Upload an image*
                                                </label>
                                            </>
                                        }
                                    </center>
                                    <input 
                                        type="file" 
                                        name="picture"
                                        id='IMAGE'
                                        accept='.png, .jpg, .jpeg'
                                        required
                                        hidden={true}
                                        onChange={e => {onChangePicture(e)}}
                                        />
                                </div>
                            <div className="field column required">
                                <label ><b>Description</b></label>
                                <textarea rows="25" 
                                    type="text" 
                                    name="description" 
                                    value={description}
                                    placeholder="Enter Content" 
                                    required  
                                    onChange={onChangeDescription}
                                />
                            </div>
                            <div className='ui footer' 
                                style={{
                                    width: '96%',
                                    margin: 'auto',
                                    alignItems: "center"
                                }}>
                                <div style={{}} >
                                    <input 
                                        type="submit" 
                                        placeholder="Submit post" 
                                        className="ui positive button fluid "
                                        id='submit'
                                        />
                                </div>
                                <div style={{height: '10px'}}></div>
                                {/* <br></br> */}
                                <button 
                                    className="ui button red fluid"
                                    onClick={() => {navigate(-1)}}
                                    >
                                    Cancel
                                </button>
                                <div style={{margin: '10px 0px 0px 0px'}}>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
