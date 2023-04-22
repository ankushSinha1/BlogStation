import { useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actionCreator} from '../../state/index.js';
import { notify } from '../CustomStyling/index.js';

export const Login = () => {
    const navigate = useNavigate();
    
    const dispatch = useDispatch();
    const actions = bindActionCreators(actionCreator, dispatch);
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    // const instance = axios.create({
    //     baseURL: 'http://localhost:3001/',
    //     timeout: 30000,
    //     headers: {
    //         'authorization': `${token}`
    //     }
    // })
    const onSubmit = async (e) => {
        e.preventDefault();
        const loginData = {
            email: email,
            password: password
        }
        axios.post('http://localhost:3001/login', loginData)
        .then((res) => {
            console.log(res.data.msg)
            if(res.status === 200){
                //Sets the authorization parameter in req.headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                actions.onLogin(res.data.accessToken, res.data.user);
            }else{
                console.log(res.data.msg)
            }
            notify(res.data.msg)
        })
        .catch((err) => console.log(err));
        navigate('/home');
    }
    return(
        <div className="container">
            <form className="ui form" onSubmit={onSubmit}>
                <div>
                    <div className="field" style={{margin: '10%'}}>
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
                        <div style={{alignItems: "center"}}>
                            <input 
                                type="submit" 
                                placeholder="Submit" 
                                className="ui blue button"
                            />
                            <button 
                                className="ui button red"
                                onClick={() => {navigate(-1)}}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}