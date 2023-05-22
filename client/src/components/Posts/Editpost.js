import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { notify } from '../CustomStyling/notify';
import { useNavigate, useParams } from 'react-router-dom';
export const Editpost = (props) => {
    let navigate = useNavigate();
    const {postId} = useParams();
    const user = localStorage.getItem('user')
    const [postDetails, setPostDetails] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState({myPict: ''});

    useEffect(()=>{
        if(!user){
            notify('You need to be logged in to do that!')
            navigate('/login')
        }
        axios.get(`http://localhost:3001/posts/${postId}/edit`)
        .then( res => {
            if(res.data.msg === 'Token expired!'){
                notify('Id expired.')
                axios.post('http://localhost:3001/refToken', JSON.parse(user))
                .then(data => {
                    //if reftoken is also expired
                    if(data.data.msg === 'RefToken expired'){
                        axios.post('http://localhost:3001/deleteRefToken', JSON.parse(user))
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
    },[])

    const onChangePict = async(e) => {
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
        if(picture.myPict){
            await axios.post('http://localhost:3001/posts/uploadImage', picture)
            .then((res) => {updatedPost.picture = res.data.secure_url})
            .catch(err => console.log(err))
        }
        await axios.patch(`http://localhost:3001/posts/${postId}/update`, updatedPost)
        .then( res => notify(res.data.msg))
        setTitle('')
        setDescription('')
        setPicture({myPict:''})
        navigate(-1)
    }
    const cancel = () => {
        navigate(`/posts/${postId}`)
    }
    const showImage = () => {
        if(picture.myPict){
            return picture.myPict
        }else{
            return postDetails.picture
        }
    }
    return(
        <div>
            Edit Post
            <form className="ui form" onSubmit={onSubmit}>
                <div>
                    <div className="field"  style={{marginLeft: '15%', marginRight: '15%'}}>
                    <img src={showImage()} alt='NAN' className="ui medium circular image"/>
                        <div>
                            <label>Change picture</label>
                            <input 
                                type="file"
                                name='picture'
                                accept='.png, .jpg, .jpeg'
                                onChange={(e)=>onChangePict(e)}
                            />
                        </div>
                        <div className="ui two column doubling grid" style={{margin: "10%", marginTop: "0%"}}>
                            <div className="field column" >
                                <label>Title *</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    defaultValue={postDetails.title}
                                    required
                                    onChange={e=>setTitle(e.target.value)}
                                />
                            </div>
                            <div className="field column" >
                                <label>Picture</label>
                                <input 
                                    type="text" 
                                    name="picture"
                                    defaultValue={postDetails.picture}
                                    onChange={e=>setPicture(e.target.value)}
                                />
                            </div>
                            <div>
                                <label><b>Description *</b></label>
                                <textarea rows="25" cols="1000"
                                    type="text" 
                                    name="description"
                                    defaultValue={postDetails.description}
                                    required  
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                            
                            <div style={{alignItems: "center"}}>
                                <input 
                                    type="submit" 
                                    className="ui blue button"
                                />
                                <button className='ui red button' onClick={() => cancel()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}