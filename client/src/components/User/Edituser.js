import React,{useState, useEffect} from "react";
import axios from "axios";
import { notify } from "../CustomStyling/notify";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from '../Navbar/Navbar.js';

export const Edituser= () =>{
    var {userId} = useParams()
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [age, setAge] = useState(0)
    const [email, setEmail] = useState('')
    const [dP, setDp] = useState({myPict: ''})
    const [bio, setBio] = useState('')
    const user = localStorage.getItem('user')

    useEffect( () => {
        if(!user){
            notify('You need to be logged in to do that!')
            navigate('/login')
        }
        //Before rendering the edit user form
         axios.get(`https://blogstation-agfm.onrender.com/user/${userId}/edit`)
        .then((res)=>{
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
                        notify("Could not edit user details. Try again.")
                    }
                })
                .catch(err => console.log(err))
            }else{
                setUserDetails(res.data)
                //These are to set the initial values of states right away
                setFirstName(userDetails.firstName);
                setLastName(userDetails.lastName);
                setUsername(userDetails.username);
                setAge(userDetails.age);
                setEmail(userDetails.email);
                setDp({myPict: userDetails.dP});
                setBio(userDetails.bio);
            }
        })
        .catch((error) => {console.log(error)})

    }, [])
    const onChangeDp = async(e) => {
        setDp({myPict: ''})

        const file = e.target.files[0]
        const base64 = await convToBase64(file)
        setDp({myPict: base64})
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
        const updatedUser = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            age: age,
            email: email,
            password: userDetails.password,
            dP: dP.myPict,
            bio: bio,
            following: userDetails.following,
            followers: userDetails.followers,
        }
        if(!dP.myPict){
            notify('No image was given. Please upload an image')
        }else{
            
            await axios.post('https://blogstation-agfm.onrender.com/user/uploadImage', dP)
            .then(res => {updatedUser.dP = res.data.secure_url})
            .catch(err => console.log(err))
            await axios.patch(`https://blogstation-agfm.onrender.com/user/${userId}/update`, updatedUser)
            .then((res)=>{
                notify(res.data.msg)
            })
            .catch((error) => {console.log(error)});
            setFirstName('')
            setLastName('')
            setUsername('')
            setAge(0)
            setEmail('')
            setDp({myPict: ''})
            setBio('')        
            navigate(-1)
        }
        
    }
    const cancel = () => {
        navigate(`/user/${userDetails._id}`)
    }
    return(
        <>
        <Navbar/>
        <div>
            <form className="ui form two column stackable grid" onSubmit={onSubmit} style={{
                margin: 'auto',
                width: '70%',
                minWidth: '570px',
            }}>
                <div style={{
                    // marginLeft: '15%',
                    // marginRight: '15%',
                    width: '80%',
                    border: '15px solid white',
                    borderRadius: '4px',
                    // margin: 'auto',
                    background: 'white',
                    opacity: '90%'
                }}>
                    <div className="field" >
                        < h3 className="ui center aligned header" style={{margin: '2%'}}>Edit user details</h3>
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
                        <div className="ui two column stackable grid" style={{margin: "4%", marginTop: "0%"}}>
                                <div className="three column row">
                            <div className=" column required field" >

                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName"
                                        defaultValue={userDetails.firstName}
                                        required
                                        onChange={e => setFirstName(e.target.value)}
                                        />
                                </div>
                                <div className=" column required field">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        defaultValue={userDetails.lastName}
                                        required
                                        onChange={e => setLastName(e.target.value)}  
                                        />
                                </div>
                                <div className="required field column" >
                                    <label>Username</label>
                                    <input 
                                        type="text" 
                                        name="userName" 
                                        defaultValue={userDetails.username}
                                        required 
                                        onChange={e => setUsername(e.target.value)}
                                        />
                                </div>
                            </div>
                            <div className="required field column">
                                <label>Age</label>
                                <input 
                                    type="number" 
                                    name="age" 
                                    defaultValue={userDetails.age} 
                                    required 
                                    onChange={e => setAge(e.target.value)} 
                                    />
                            </div>
                            <div className="required field column" >
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    defaultValue={userDetails.email}
                                    required
                                    onChange={e => setEmail(e.target.value)}
                                    />
                            </div>
                            <div className="two column row" >
                                    <div  style={{
                                            // position: 'sticky',
                                            // margin: '10px',
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
                                        defaultValue={userDetails.bio}
                                        id='bio'
                                        placeholder="Let others know about you..." 
                                        name="bio" 
                                        onChange={e=>setBio(e.target.value)}
                                        style={{
                                            marginBottom: '10px'
                                        }}
                                        >
                                    
                                    </textarea>
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
                                    onClick={cancel}
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