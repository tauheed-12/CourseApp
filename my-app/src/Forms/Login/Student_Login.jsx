import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Student_Login = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleForm = async (event) => {
    try {
      event.preventDefault();
      const response = await axios.post('http://localhost:5000/auth/student/login', { email, password });
      console.log(response.data.data[0].student_id);
      props.setLoggedId(response.data.data[0].student_id);
      const token = response.data.token;
      localStorage.setItem('token', token);
      if (token) {
        props.setLoggedIn(true);
        console.log(token);
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Email does not exist!");
      } else if (error.response && error.response.status === 401) {
        alert("Invalid Password!");
      } else {
        alert("Internal Server Error");
        console.error('Error during login:', error);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 bg-blue-400 flex justify-center items-center p-8 md:p-0">
        <div className="flex flex-col text-white text-center md:text-left">
          <h1 className="text-3xl mb-4">Welcome, Learner</h1>
          <h3 className="text-2xl mb-4">Continue your journey into the world of courses</h3>
          <h3 className="text-xl mt-8 mb-4">Don't have an account?</h3>
          <Link to='/register/student' className="text-white border-none px-4 py-2 bg-blue-500 w-full md:w-52 self-center">SignUp</Link>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center p-8">
        <form className="flex flex-col w-full max-w-md" onSubmit={handleForm}>
          <div className="mb-8 flex flex-col text-lg">
            <input type='email' name='email' id='email' onChange={(event) => setEmail(event.target.value)} className="border-b-2 bg-gray-200 px-4 py-2" placeholder='Email' required />
          </div>
          <div className="mb-8 flex flex-col text-lg">
            <input type='password' name='password' id='password' onChange={(event) => setPassword(event.target.value)} className="border-b-2 bg-gray-200 px-4 py-2" placeholder='Password' required />
          </div>
          <button type='submit' className="text-white border-none px-4 py-2 bg-blue-500 w-full md:w-52 self-center">Login</button>
          <Link to='/forgetPassword' className="mt-4 text-blue-800">Forget Password?</Link>
          <Link to='/register/student' className="mt-4 text-blue-800">New User?</Link>
        </form>
      </div>
    </div>
  );
}

export default Student_Login;
