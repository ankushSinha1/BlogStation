import React,{useState, useEffect} from "react";
import axios from "axios";
// import { notify } from "../CustomStyling";
import { useNavigate } from "react-router-dom";
export const Edituser= (props) =>{
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [age, setAge] = useState(0)
    const [email, setEmail] = useState('')
    const [dP, setDp] = useState('')
    const [bio, setBio] = useState('')

    useEffect(() => {
        axios.get(`http://localhost:3001/user/${props.userId.userId}/edit`)
        .then((res)=>{
            setUserDetails(res.data)
        })
        .catch((error) => {console.log(error)})
        //These are to set the initial values of states right away
        setFirstName(userDetails.firstName);
        setLastName(userDetails.lastName);
        setUsername(userDetails.username);
        setAge(userDetails.age);
        setEmail(userDetails.email);
        setDp(userDetails.dP);
        setBio(userDetails.bio);
    }, [props])
    const onSubmit = (event) => {
        event.preventDefault();
        const updatedUser = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            age: age,
            email: email,
            password: userDetails.password,
            dP: dP,
            bio: bio,
            following: userDetails.following,
            followers: userDetails.followers,
        }
        axios.patch(`http://localhost:3001/user/${props.userId.userId}/update`, updatedUser)
        .then((res)=>{
            // notify(res.data.msg)
        })
        .catch((error) => {console.log(error)});
        setFirstName('')
        setLastName('')
        setUsername('')
        setAge(0)
        setEmail('')
        setDp('')
        setBio('')        
        navigate(-1)
    }
    const cancel = () => {
        navigate(`/user/${userDetails._id}`)
    }
    return(
        <div>
            Edit form
            <form className="ui form" onSubmit={onSubmit}>
                <div>
                    <div className="field" style={{marginLeft: '15%', marginRight: '15%'}}>
                        <div className="ui two column doubling grid" style={{margin: "10%", marginTop: "0%"}}>
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
                            <div className="field column" >
                                <label>Profile picture</label>
                                <input 
                                    type="text" 
                                    name="dP" 
                                    defaultValue={userDetails.dP}
                                    onChange={e => setDp(e.target.value)}
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