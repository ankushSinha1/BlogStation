import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { notify } from '../CustomStyling/notify';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar.js';


export const Editpost = (props) => {
    let navigate = useNavigate();
    const {postId} = useParams();
    const user = localStorage.getItem('user')
    const [postDetails, setPostDetails] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState({myPict: ''});

    useEffect( ()=>{
        if(!user){
            notify('You need to be logged in to do that!')
            navigate('/login')
        }
        axios.get(`https://blogstation-agfm.onrender.com/posts/${postId}/edit`)
        .then( res => {
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
                        notify("Could not edit your details. Try again.")
                    }
                })
                .catch(err => console.log(err))
            }else{
                setPostDetails(res.data)
            }
        })
        .catch( error => console.log(error));
        setTitle(postDetails.title)
        setDescription(postDetails.description)
        setPicture({myPict: postDetails.picture})
    }, [])

    const onChangePicture = async(e) => {
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
    const onSubmit = async (event) => {
        event.preventDefault();
        const updatedPost = {
            title: title,
            picture: picture.myPict,
            description: description,
            author: postDetails.author,
            comments: postDetails.comments,
            likes: postDetails.likes,
            totalReports: postDetails.totalReports,
        }
        if(!picture.myPict){
            notify('No image was given. Please upload an image')
        }else{
            
            await axios.post('https://blogstation-agfm.onrender.com/posts/uploadImage', picture)
            .then((res) => {updatedPost.picture = res.data.secure_url})
            .catch(err => console.log(err))
            await axios.patch(`https://blogstation-agfm.onrender.com/posts/${postId}/update`, updatedPost)
            .then( res => notify(res.data.msg))
            setTitle('')
            setDescription('')
            setPicture({myPict:''})
            navigate(-1)
        }
    }
    return(
        <>
        <Navbar/>
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
                    <div className="field"  style={{// marginLeft: '15%',
                        // marginRight: '15%',
                        width: '80%',
                        border: '15px solid white',
                        borderRadius: '4px',
                        margin: 'auto',
                        // background: 'white',
                        opacity: '90%'}}>
                        <h3 className="ui center aligned header" style={{margin: '2%'}}>Edit this post</h3>
                            <div>
                            <div className="field column required" >
                                <label>Title</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    defaultValue={postDetails.title}
                                    required
                                    onChange={e=>setTitle(e.target.value)}
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

                                    <img src={picture.myPict} 
                                        alt='Selected image will be shown here' 
                                        className='responsive'
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
                                <label><b>Description</b></label>
                                <textarea rows="25" 
                                    type="text" 
                                    name="description"
                                    defaultValue={postDetails.description}
                                    required  
                                    onChange={e => setDescription(e.target.value)}
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
        </>
    )
}