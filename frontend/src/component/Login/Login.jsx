import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [name, setname] = useState('');
  console.log(name);
  const token = localStorage.getItem("token");


  const handlesubmite = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(`${API_BASE_URL}/user/login`, {
        email, password
      },
        { withCredentials: true },
        { Authentication: token }
      );
      console.log(data);
      // setname(data.data.user);/

      localStorage.setItem('userId', data.data.user.id || response.data.user._id);
      localStorage.setItem('username', data.data.user.name);
      localStorage.setItem('role', data.data.user.role);
      alert('login successfully');
      navigate('/');

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {/* <Home name={name}/> */}
      <div className=' d-flex justify-content-center'>
        <form className='w-25' onSubmit={handlesubmite}>
          <h3>login </h3>
          <div className="mb-3">

            <input
              type="email"
              className="form-control"
              placeholder='EMAIL'
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />

          </div>
          <div className="mb-3">

            <input
              type="password"
              className="form-control"
              placeholder='PASSWORD'
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>


          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>

      </div>
    </>
  )
}

export default Login
