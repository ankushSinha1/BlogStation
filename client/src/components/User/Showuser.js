import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { notify } from '../CustomStyling/notify';
// import { Navbar } from '../Navbar/Navbar.js';


export const Showuser = () => {
    var {userId} = useParams()
    const navigate = useNavigate()
    const [userData, setUserData] = useState({})
    let user = localStorage.getItem('user')
    useEffect(async () => {
        if(user){
            axios.defaults.headers.common['Authorization'] =  `Bearer ${JSON.parse(user).token}`
        }
        await axios.get(`https://blogstation-agfm.onrender.com/user/${userId}`)
        .then(async (res)=>{ setUserData(res.data)})
        .catch((error) => {console.log(error)})
    }, [])
    console.log(userData)
    if(userData.msg ===  'User does not exist!' ){
        notify(userData.msg)
        navigate(-1);
    }
    else if(userData._id){
        const authForEditAndDeleteUser = () => {
            if(user && JSON.parse(user).user._id === userId){
                return (
                    <div style={{
                        marginLeft: '4%',
                        // marginTop: '4%',
                        marginRight: '4%',
                        marginBottom: '2%',
                        // display: 'inline'
                    }}>
                        <Link to={`/user/${userId}/edit`} 
                            className="ui button primary">
                                Edit user details
                        </Link>
                        <Link to={`/user/${userId}/delete`} 
                            className="ui button red"
                            style={{
                                float: 'right'
                            }}
                            >
                                Delete user
                        </Link>
                    </div>
                )
            }else{
                return(<></>)
            }
        }
        return(
            <>
            {/* <Navbar/> */}
            <div className='ui container' style={{
                margin: 'auto',
                width: '80%',
                minWidth: '500px',
            }}>
                <div style={{
                    backgroundColor: 'white',
                    paddingLeft: '7%',
                    paddingRight: '7%',
                    paddingTop: '2.5%',
                    paddingBottom: '1%',
                    marginLeft: '10%',
                    marginRight: '10%',
                    borderRadius: '10px'
                }}
                >
                <h2 className='ui center aligned header'>User details</h2>
                <div style={{
                    border: '1px solid #e5e5e5'
                }}>
                    <center>
                        <div>
                            <img src={userData.dP} className="" alt="err" 
                            style={{
                                width: "250px", 
                                height:"250px",
                                objectFit: 'cover',
                                marginLeft: '3%',
                                marginTop: '5%',
                                marginRight: '3%',
                                marginBottom: '3%',
                                borderRadius: '120px'
                            }}/>
                        </div>
                        <div style={{
                            // margin: '3%'
                            padding: '2px'
                        }}>
                            <b>Profile image</b>
                        </div>
                    </center>
                    <div className='field' style={{
                        marginLeft: '2%',
                        marginRight: '2%'
                    }}>
                    <div className='ui form two column stackable grid '
                    style={{margin: "4%"}}
                    >
                            <div className="two column row" style={{}}>
                                    <div className='field column' 
                                        style={{
                                            padding: '14px', 
                                            marginBottom: '3%',
                                            // fontSize: '120%',
                                            // width: '100%',
                                            // maxWidth: '100%'
                                            wordWrap: 'break-word'
                                        }}
                                        ><b>Firstname:</b> {userData.firstName}</div>
                                    <div className='field column' 
                                        style={{
                                            padding: '14px', 
                                            marginBottom: '3%',
                                            // fontSize: '120%',
                                            // width: '100%',
                                            // maxWidth: '100%'
                                            wordWrap: 'break-word'
                                        }}
                                        ><b>Lastname:</b> {userData.lastName}</div>
                                    <div className='field column' 
                                        style={{
                                            padding: '14px', 
                                            marginBottom: '3%',
                                            // fontSize: '120%',
                                            // width: '100%',
                                            // maxWidth: '100%'
                                            wordWrap: 'break-word'
                                        }}
                                        ><b>Username:</b> {userData.username}</div>
                                    <div className='field column' 
                                        style={{
                                            padding: '14px', 
                                            marginBottom: '3%',
                                            // fontSize: '120%',
                                            // width: '100%',
                                            // maxWidth: '100%'
                                            wordWrap: 'break-word'
                                        }}
                                        ><b>Age:</b> {userData.age}</div>
                                    <div className='field column' 
                                        style={{
                                            padding: '14px', 
                                            marginBottom: '3%',
                                            // fontSize: '120%',
                                            // width: '100%',
                                            // maxWidth: '100%'
                                            wordWrap: 'break-word'
                                        }}
                                        ><b>Email:</b> {userData.email}</div>
                                    <div className='field column' 
                                        style={{
                                            padding: '14px', 
                                            marginBottom: '3%',
                                            // fontSize: '120%',
                                            // width: '100%',
                                            // maxWidth: '100%'
                                            wordWrap: 'break-word'
                                        }}
                                        ><b>About:</b> {userData.bio}</div>
                                    <div className='field column' 
                                        style={{
                                            padding: '14px', 
                                            marginBottom: '3%',
                                            // fontSize: '120%',
                                            // width: '100%',
                                            // maxWidth: '100%'
                                            wordWrap: 'break-word'
                                        }}
                                        ><b>{userData.following} Following</b></div>
                                    <div className='field column' 
                                        style={{
                                            padding: '14px', 
                                            marginBottom: '3%',
                                            // fontSize: '120%',
                                            // width: '100%',
                                            // maxWidth: '100%'
                                            wordWrap: 'break-word'
                                        }}
                                        ><b>{userData.followers} Followers</b></div>
                                </div>
                            </div>
                            {authForEditAndDeleteUser()}
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }else{
        return(
            <div>Loading...</div>
        )
    }
}