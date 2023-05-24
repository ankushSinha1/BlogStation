import React, { useState} from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {notify} from '../CustomStyling/notify.js';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreator } from '../../state/index.js';
// import { Navbar } from '../Navbar/Navbar.js';


export const Newuser = () => {
    const navigate = useNavigate();
    const login = useSelector(state => state.login);
    const dispatch = useDispatch();
    const actions = bindActionCreators(actionCreator, dispatch);

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [age, setAge] = useState(0)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [dP, setDp] = useState({myPict: ''})
    const [bio, setBio] = useState('')

    const onChangeFirstName = (e) => {
        setFirstName(e.target.value)
    }
    const onChangeLastName = (e) => {
        setLastName(e.target.value)
    }
    const onChangeUsername = (e) => {
        setUsername(e.target.value)

    }
    const onChangeAge = (e) => {
        setAge(e.target.value)

    }
    const onChangeEmail = (e) => {
        setEmail(e.target.value)

    }
    const onChangePassword = (e) => {
        setPassword(e.target.value)

    }
    const onChangeDp = async (e) => {
        setDp({myPict: ''})
        const file = e.target.files[0];
        const base64 = await convToBase64(file);
        setDp({myPict: base64})
    }
    const onChangeBio = (e) => {
        setBio(e.target.value)

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
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            age: age,
            email: email,
            password: password,
            dP: dP.myPict,
            bio: bio,
            following: 0,
            followers: 0,
        };
        //For uploading image on cloudinary
        if(!dP.myPict){
            notify('No image was given. Please upload an image')
        }else{
            await axios.post('https://blogstation-agfm.onrender.com/posts/uploadImage', dP)
            .then(res => {
                newUser.dP = res.data.secure_url
            })
            .catch(err => console.log(err))
            //For creating new user
            await axios.post('https://blogstation-agfm.onrender.com/user/new', newUser)
            .then((res) => {
                if(res.data.msg === 'User with this email already exists!'){
                    notify(res.data.msg)
                    navigate('/user/new')
                }else{
                    localStorage.setItem('user', JSON.stringify(res.data))
                    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                    navigate('/home')
                    notify('Welcome to BlogStation')
                }
            })
            .catch((error) => {console.log(error)});
            actions.onLogin(true);
            setFirstName('')
            setLastName('')
            setUsername('')
            setAge(0)
            setEmail('')
            setPassword('')
            setDp({myPict: ''})
            setBio('')
            navigate(`/home`)
        }
    }
    return(
        // <>
        //     <Navbar/>
        <div>
            <form 
                className="ui form " 
                onSubmit={onSubmit} 
                encType="multipart/form-data"
                style={{
                    margin: 'auto',
                    width: '70%',
                    minWidth: '570px',
                }}
                >
                <div>
                    <div className="field" 
                        style={{
                            // marginLeft: '15%',
                            // marginRight: '15%',
                            width: '80%',
                            border: '15px solid white',
                            borderRadius: '4px',
                            margin: 'auto',
                            background: 'white',
                            opacity: '90%'
                        }}>
                            <h3 className="ui center aligned header" style={{margin: '2%'}}>Welcome to BlogStation!<br></br>We are glad to have you onBoard</h3>
                            {/* <div  style={{margin: '2%', fontSize: '14px'}}>Please enter the following details:</div> */}
                                <div className="ui two column doubling grid" style={{margin: '2%'}}>
                                <div className="field column required" >
                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName" 
                                        value={firstName}
                                        placeholder="Enter first name " 
                                        required
                                        onChange={onChangeFirstName}
                                        />
                                </div>
                                <div className="field column required">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        value={lastName}
                                        placeholder="Enter last name" 
                                        required  
                                        onChange={onChangeLastName}
                                        />
                                </div>
                                <div className="field column required" >
                                    <label>Username</label>
                                    <input 
                                        type="text" 
                                        name="userName" 
                                        value={username}
                                        placeholder="Enter username" 
                                        required 
                                        onChange={onChangeUsername}
                                        />
                                </div>
                                <div className="field column required">
                                    <label>Age</label>
                                    <input 
                                        type="number" 
                                        name="age" 
                                        value={age}
                                        placeholder="Enter your age" 
                                        required  
                                        onChange={onChangeAge}
                                        />
                                </div>
                                <div className="field column required" >
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={email}
                                        placeholder="Enter your email" 
                                        required 
                                        onChange={onChangeEmail}
                                        />
                                </div>
                                <div className="field column required" >
                                    <label>Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={password}
                                        placeholder="Enter password" 
                                        required 
                                        onChange={onChangePassword}
                                        />
                                </div>
                                <div style={{height: ''}}>
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

                                    <img src={dP.myPict} alt='Selected image will be shown here' className='responsive'
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
                                        {dP.myPict ? (
                                            <button onClick={() => setDp({myPict: ''})}
                                                className='ui button' 
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
                                        name="dP"
                                        id='IMAGE'
                                        accept='.png, .jpg, .jpeg'
                                        required
                                        hidden={true}
                                        onChange={e => {onChangeDp(e)}}
                                        />
                                </div>
                                <div className="two column row" >
                                    <div  style={{
                                        // position: 'sticky',
                                        left: '0px',
                                        display: 'block ',
                                        width: '100%',
                                        // fontStyle: 'strong'
                                        // margnTop: '100px'
                                    }}
                                    className='field required'>
                                            <label for='bio' ><b>About</b></label>
                                    </div>
                                    {/* <div style={{height: '24px'}}></div> */}
                                    <textarea 
                                        required
                                        rows="6" 
                                        cols="4" 
                                        value={bio}
                                        id='bio'
                                        placeholder="Let others know about you..." 
                                        name="bio" 
                                        onChange={onChangeBio}
                                        >
                                    
                                    </textarea>
                                </div>
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
                                        placeholder="Submit" 
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

                                Already have an account? <Link to='/login'>Login</Link>
                                </div>
                            </div>            
                    </div>
                </div>
            </form>
        </div>
    )
}