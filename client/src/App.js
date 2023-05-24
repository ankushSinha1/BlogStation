import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import {Editcomment} from './components/Comments/Editcomment.js';

import { ToastContainer } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';

function App() {
  const [message, setMessage] = useState("");
  useEffect(()=>{
    fetch("https://blogstation-agfm.onrender.com")
    .then(res => res.json())
    .then(data => setMessage(data.message))

  }, [])
  console.log(message)
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <div className='container' style={{padding: '1%'}}>
        <Routes>
          <Route path='/' element={<Welcomepage/>}/>
          <Route path='/home' element={<Homepage/>}/>
          <Route path='/user/:userId' element={<Showuser/>}/>
          <Route path='/user/new' element={<Newuser/>}/>
          <Route path='/user/:userId/edit' element={<Edituser/>}/>
          <Route path='/user/:userId/delete' element={<Deleteuser />}/>
          <Route path='/posts/:postId' element={<Showpost/>}/>
          <Route path='/posts/new' element={<Newpost/>}/>
          <Route path='/posts/:postId/edit' element={<Editpost/>}/>
          <Route path='/posts/:postId/delete' element={<Deletepost/>}/>
          <Route path='/posts/:postId/comment/:commentId/edit' element={<Editcomment/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );

}

export default App;
