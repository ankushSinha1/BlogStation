import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actionCreator} from '../../state/index.js';

import {notify} from '../CustomStyling/index.js';
export const Newuser = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const action = bindActionCreators(actionCreator, dispatch);

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [age, setAge] = useState(0)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [dP, setDp] = useState('')
    const [bio, setBio] = useState('')
    const [posts] = useState([])
    const [following] = useState(0)
    const [followers] = useState(0)
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
    const onChangeDp = (e) => {
        setDp(e.target.value)

    }
    const onChangeBio = (e) => {
        setBio(e.target.value)

    }
    const onSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            age: age,
            email: email,
            password: password,
            dP: dP,
            bio: bio,
            posts: posts,
            following: following,
            followers: followers,
        };
        axios.post('http://localhost:3001/user/new', newUser)
        .then((res) => {
            console.log(res.data)
            action.onLogin(res.data.token, res.data.user)
            notify(res.data.msg)
        })
        .catch((error) => {console.log(error)});
        setFirstName('')
        setLastName('')
        setUsername('')
        setAge(0)
        setEmail('')
        setPassword('')
        setDp('')
        setBio('')
        navigate(`/home`)
    }
    return(
        <div className="container">
        <h3 className="ui center aligned header">Welcome to BlogStation!</h3>
        <h3 className="ui center aligned header">We are glad to have you onBoard</h3>
            <form className="ui form" onSubmit={onSubmit}>
                <div>
                    <div className="field" style={{marginLeft: '15%', marginRight: '15%'}}>
                        <div className="ui two column doubling grid" style={{margin: "10%", marginTop: "0%"}}>
                            <div className="field column" >
                                <label>First Name *</label>
                                <input 
                                    type="text" 
                                    name="firstName" 
                                    value={firstName}
                                    placeholder="Enter first name" 
                                    required
                                    onChange={onChangeFirstName}
                                />
                            </div>
                            <div className="field column">
                                <label>Last Name *</label>
                                <input 
                                    type="text" 
                                    name="lastName" 
                                    value={lastName}
                                    placeholder="Enter last name" 
                                    required  
                                    onChange={onChangeLastName}
                                />
                            </div>
                            <div className="field column" >
                                <label>Username *</label>
                                <input 
                                    type="text" 
                                    name="userName" 
                                    value={username}
                                    placeholder="Enter username" 
                                    required 
                                    onChange={onChangeUsername}
                                />
                            </div>
                            <div className="field column">
                                <label>Age *</label>
                                <input 
                                    type="number" 
                                    name="age" 
                                    value={age}
                                    placeholder="Enter your age" 
                                    required  
                                    onChange={onChangeAge}
                                />
                            </div>
                            <div className="field column" >
                                <label>Email *</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={email}
                                    placeholder="Enter your email" 
                                    required 
                                    onChange={onChangeEmail}
                                />
                            </div>
                            <div className="field column" >
                                <label>Password *</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={password}
                                    placeholder="Enter password" 
                                    required 
                                    onChange={onChangePassword}
                                />
                            </div>
                            <div className="field column" >
                                <label>Profile picture</label>
                                <input 
                                    type="text" 
                                    name="dP" 
                                    value={dP}
                                    placeholder="Provide your profile pic url" 
                                    onChange={onChangeDp}
                                />
                            </div>
                            <div className="field column" >
                                <label>About</label>
                                <textarea 
                                    rows="3" 
                                    cols="4" 
                                    value={bio}
                                    placeholder="Let others know about you..." 
                                    name="bio" 
                                    onChange={onChangeBio}
                                ></textarea>
                            </div>
                            <div style={{alignItems: "center"}}>
                                <input 
                                    type="submit" 
                                    placeholder="Submit" 
                                    className="ui blue button"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}