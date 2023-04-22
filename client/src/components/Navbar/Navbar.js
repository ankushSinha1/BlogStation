import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actionCreator} from '../../state/index.js';
import { notify } from "../CustomStyling/index.js";

export const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const actions = bindActionCreators(actionCreator, dispatch);
    const token = useSelector(state=>state.token);
    const isToken = Boolean(useSelector(state=>state.token));
    const loggedIn = (token) => {
        if(!isToken){
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
        }else{
            return(
                <div className="right menu">
                    <div className="item">
                        <Link to={`/user/${token.user._id}`}>
                            {token.user.firstName} {token.user.lastName}
                        </Link>
                    </div>
                    <div className="item">
                        <button 
                            className="ui button primary" 
                            onClick = {()=>{
                                actions.onLogout(token)
                                notify('Logged out successfully!')
                                navigate('/')
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
                {loggedIn(token)}
            </div>
        </div>
        </>
    )
}