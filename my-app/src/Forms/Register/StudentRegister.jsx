import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentRegister = () => {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    profile: null
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleForm(event) {
    event.preventDefault();

    // Basic validation
    if (!info.profile) {
      setError("Please upload a profile picture");
      return;
    }
    if (info.profile.size > 1024 * 1024) { // 1MB limit
      setError("File size should not exceed 1MB");
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(info.profile.type)) {
      setError("Only JPG, PNG, and GIF file formats are allowed");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', info.name);
      formData.append('email', info.email);
      formData.append('contact', info.contact);
      formData.append('profile', info.profile);
      formData.append('password', info.password);

      const response = await axios.post('http://localhost:5000/student/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      navigate('/login/student');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User already exists, please login");
      } else {
        setError("Internal Server Error");
        console.error('Error:', error);
      }
    }
  }

  function handleChange(event) {
    const { name, value, type } = event.target;
    const newValue = type === 'file' ? event.target.files[0] : value;
    setInfo(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-blue-400 flex justify-center">
        <div className="flex justify-center self-center flex-col text-white">
          <h1 className="text-3xl text-center mb-4">Hello, Learner</h1>
          <h3 className="text-2xl">Register to dive into the world of courses</h3>
          <h3 className="text-xl mt-8 mb-4">Already have an account?</h3>
          <button className="text-white border-none px-4 py-2 bg-blue-500 w-52 self-center">LogIn</button>
        </div>
      </div>
      <div className="flex-1 flex justify-center self-center p-8">
        <form onSubmit={handleForm} className="flex flex-col">
          <div className="mb-8 flex flex-col text-lg">
            <input type='text' id='name' name='name' className="border-b-2 bg-gray-200 px-4 py-2" onChange={handleChange} value={info.name} placeholder='Name' required></input>
          </div>
          <div className="mb-8 flex flex-col text-lg">
            <input type='email' id='email' name='email' className="border-b-2 bg-gray-200 px-4 py-2" onChange={handleChange} value={info.email} placeholder='Email' required></input>
          </div>
          <div className="mb-8 flex flex-col text-lg">
            <input type='number' id='contact' name='contact' className="border-b-2 bg-gray-200 px-4 py-2" onChange={handleChange} value={info.contact} placeholder='Contact' required></input>
          </div>
          <div className="mb-8 flex flex-col text-lg">
            <input type='password' id='password' name='password' className="border-b-2 bg-gray-200 px-4 py-2" onChange={handleChange} value={info.password} placeholder='Password' required></input>
          </div>
          <div className="mb-8 flex flex-col text-lg">
            <label htmlFor='profile'>Upload a Profile Pic:</label>
            <input type='file' id='profile' name='profile' onChange={handleChange} required></input>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type='submit' className="text-white border-none px-4 py-2 bg-blue-500 w-52 self-center">Register</button>
        </form>
      </div>
    </div>
  );
}

export default StudentRegister;
