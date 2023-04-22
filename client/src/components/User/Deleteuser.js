import React from "react";
import axios from 'axios';
import {notify} from '../CustomStyling/index.js';
import { useNavigate, Link } from "react-router-dom";
import {useDispatch} from 'react-redux';
import { bindActionCreators } from "redux";
import { actionCreator } from "../../state/index.js";

export const Deleteuser = (props) => {
    const dispatch = useDispatch();
    const action = bindActionCreators(actionCreator, dispatch);
    const navigate = useNavigate();
    const deleteConfirm = () => {
        axios.delete(`http://localhost:3001/user/${props.userId.userId}/delete`)
        .then((res)=>{
            console.log(res.data.msg);
            action.onLogout()
            notify(res.data.msg);
        })
        .catch(err => console.log(err))
        navigate('/home')
    }
    return(
        <div>
            Delete page
            {deleteConfirm()}
            <div>
                <Link to="/home"> Go back to HomePage</Link>
            </div>
        </div>
    )
}