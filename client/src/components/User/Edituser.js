import React,{useState, useEffect} from "react";
import axios from "axios";
import { notify } from "../CustomStyling/notify";
import { useNavigate, useParams } from "react-router-dom";
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
         axios.get(`http://localhost:3001/user/${userId}/edit`)
        .then((res)=>{
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
        if(dP.myPict){
            await axios.post('http://localhost:3001/user/uploadImage', dP)
            .then(res => {updatedUser.dP = res.data.secure_url})
            .catch(err => console.log(err))
        }
        await axios.patch(`http://localhost:3001/user/${userId}/update`, updatedUser)
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
    const cancel = () => {
        navigate(`/user/${userDetails._id}`)
    }
    const showImage = () => {
        if(dP.myPict){
            return dP.myPict
        }else{
            return userDetails.dP
        }
    }
    return(
        <div>
            Edit form
            <form className="ui form" onSubmit={onSubmit}>
                <div>
                    <div className="field" style={{marginLeft: '15%', marginRight: '15%'}}>
                        <img src={showImage()} alt='NAN' className="ui medium circular image"/>
                        <div>
                            <label>Change profile picture</label>
                            <input 
                                type="file"
                                name='dP'
                                accept='.png, .jpg, .jpeg'
                                onChange={(e)=>onChangeDp(e)}
                            />
                        </div>
                        <div className="ui two column grid" style={{margin: "10%", marginTop: "0%"}}>
                            {/* <div className="field column" >
                                <label>Profile picture</label>
                                <input 
                                    type="text" 
                                    name="dP" 
                                    defaultValue={userDetails.dP}
                                    onChange={e => setDp(e.target.value)}
                                />
                            </div> */}
                            <div className="field column" >
                                <label>First Name *</label>
                                <input 
                                    type="text" 
                                    name="firstName"
                                    defaultValue={userDetails.firstName}
                                    required
                                    onChange={e => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="field column">
                                <label>Last Name *</label>
                                <input 
                                    type="text" 
                                    name="lastName" 
                                    defaultValue={userDetails.lastName}
                                    required
                                    onChange={e => setLastName(e.target.value)}  
                                />
                            </div>
                            <div className="field column" >
                                <label>Username *</label>
                                <input 
                                    type="text" 
                                    name="userName" 
                                    defaultValue={userDetails.username}
                                    required 
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="field column">
                                <label>Age *</label>
                                <input 
                                    type="number" 
                                    name="age" 
                                    defaultValue={userDetails.age} 
                                    required 
                                    onChange={e => setAge(e.target.value)} 
                                />
                            </div>
                            <div className="field column" >
                                <label>Email *</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    defaultValue={userDetails.email}
                                    required
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="sixteen wide column" >
                                <label><b>About</b></label>
                                <textarea 
                                    rows="3" 
                                    cols="4"
                                    defaultValue={userDetails.bio}
                                    name="bio"
                                    onChange={e => setBio(e.target.value)}
                                ></textarea>
                            </div>
                            <div style={{alignItems: "center"}}>
                                <input 
                                    type="submit"  
                                    className="ui blue button"
                                    placeholder='Submit'
                                />
                                <button className="ui button red" onClick={cancel}>
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