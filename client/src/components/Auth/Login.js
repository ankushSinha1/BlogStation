import React, { useEffect } from 'react';
import { useState} from 'react';
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actionCreator} from '../../state/index.js';
import { notify } from '../CustomStyling/notify.js';

export const Login = () => {
    const navigate = useNavigate();
    
    const dispatch = useDispatch();
    const actions = bindActionCreators(actionCreator, dispatch);
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        const loginData = {
            email: email,
            password: password
        }
        axios.post('http://localhost:3001/login', loginData)
        .then((res) => {
            if(res.data.token){
                //Sets the authorization parameter in req.headers
                localStorage.setItem('user', JSON.stringify(res.data))
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                navigate('/home');
                navigate(0)
                notify(res.data.msg)
            }else{
                notify(res.data.msg)
            }
        })
        .catch((err) => console.log(err));
    }
    return(
        <div 
        style={{minWidth: '500px'}}>
            <form className="ui form" onSubmit={onSubmit} 
                style={{
                        margin: 'auto',
                        width: '50%',
                        minWidth: '500px',
                        // fontFamily: 'Montserrat'
                        
                        }}>
                <div>
                    <div className="field" style={{
                        border: '25px solid white',
                        borderRadius: '4px',
                        margin: '5%',
                        background: 'white',
                        opacity: '90%'
                        
                    }}>
                        <h1 className="ui center aligned header">Login</h1>
                        <div className="field column" >
                            <label>Email</label>
                            <input 
                                type="text" 
                                name="email" 
                                placeholder="Enter email" 
                                required
                                onChange={e=>setemail(e.target.value)}
                            />
                        </div>
                        <div className="field column" >
                            <label>Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Enter password"
                                required
                                onChange={e=>setPassword(e.target.value)}
                            />
                        </div>                            
                        <div style={{alignItems: "center", display: 'inline'}}>
                            <input 
                                type="submit" 
                                placeholder="Submit" 
                                className="ui positive button fluid"
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
                        <div style={{margin: '10px'}}>
                            Don't have an account? <Link to='/user/new'> Register now!</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}