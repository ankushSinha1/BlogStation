import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { notify } from "../CustomStyling/index.js";
import { useEffect, useState } from "react";

export const Navbar = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(()=>{
        const loggedInUser = localStorage.getItem('user')
        if(loggedInUser){
            console.log('Hit')
            const foundUser = loggedInUser;
            setUser(foundUser);
            setIsLoggedIn(true)
        }
    }, [])
    const loggedIn = (isLoggedIn) => {
        if(!isLoggedIn){
            return(
                <div className="right menu">
                    <div>
                        <Link to='/login' className="item">Login</Link>
                    </div>
                    <div>
                        <Link to='/user/new' className="item">Sign Up</Link>
                    </div>
                    
                </div>                
            )
        }
        else{
            return(
                <div className="right menu">
                    <div className="item">
                        <Link to={`/user/${JSON.parse(user).user._id}`}>
                            {JSON.parse(user).user.firstName} {JSON.parse(user).user.lastName}
                        </Link>
                    </div>
                    <div className="item">
                        <button 
                            className="ui button primary" 
                            onClick = {async ()=>{
                                localStorage.clear()
                                setIsLoggedIn(false);
                                navigate('/')
                                notify('Logged out successfully!')
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )
        }
    } 
    return (
        <>
        <div style={{height: '40ptoken', backgroundColor: 'white', marginBottom:'10ptoken'}} >
            <div className="ui secondary pointing menu">
                <div>
                    <Link to='/' className="item">BlogStation</Link>
                </div>
                <div>
                    <Link to="/home" className="item">Home</Link>
                </div>
                <div>
                    <Link to="/posts/new" className="item">Add post</Link>
                </div>
                {loggedIn(isLoggedIn)}
            </div>
        </div>
        </>
    )
}