import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import {Welcomepage} from './components/Welcomepage/Welcomepage.js';
import {Homepage} from './components/Homepage/Homepage.js';
import { Navbar } from './components/Navbar/Navbar.js';
import {Showuser} from './components/User/Showuser.js';
import {Newuser} from './components/User/Newuser.js';
import {Edituser} from './components/User/Edituser.js';
import {Deleteuser} from './components/User/Deleteuser.js';
import {Showpost} from './components/Posts/Showpost.js';
import {Newpost} from './components/Posts/Newpost.js';
import {Editpost} from './components/Posts/Editpost.js';
import {Deletepost} from './components/Posts/Deletepost.js';
import {Login} from './components/Auth/Login.js';
import {Register} from './components/Auth/Register.js';
import {Editcomment} from './components/Comments/Editcomment.js';

import { ToastContainer } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';

function App() {
  let DisplayUser = () => {
    const {userId} = useParams();
    return <Showuser userId={{userId}}/>
  }
  let UpdateUser = () => {
    const {userId} = useParams();
    return <Edituser userId={{userId}} />
  }
  let DeleteUser = () => {
    const {userId} = useParams();
    return <Deleteuser userId={{userId}}/>
  }
  let DisplayPost =() => {
    const {postId} = useParams();
    return <Showpost postId={{postId}}/>
  }
  let UpdatePost =() => {
    const {postId} = useParams();
    return <Editpost postId={{postId}}/>
  }
  let DeletePost = () => {
    const {postId} = useParams();
    return <Deletepost postId = {{postId}}/>
  }
  
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={Welcomepage()}/>
          <Route path='/home' element={<Homepage/>}/>
          <Route path='/user/:userId' element={<DisplayUser/>}/>
          <Route path='/user/new' element={<Newuser/>}/>
          <Route path='/user/:userId/edit' element={<UpdateUser/>}/>
          <Route path='/user/:userId/delete' element={<DeleteUser/>}/>
          <Route path='/posts/:postId' element={<DisplayPost/>}/>
          <Route path='/posts/new' element={<Newpost/>}/>
          <Route path='/posts/:postId/edit' element={<UpdatePost/>}/>
          <Route path='/posts/:postId/delete' element={<DeletePost/>}/>
          <Route path='/posts/:postId/comment/:commentId/edit' element={<Editcomment/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={Register()}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );

}

export default App;
