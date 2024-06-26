import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  async function handleForm(event) {
    event.preventDefault();

    // Basic validation
    if (info.password !== info.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/admin/register', info);
      console.log(response.data);
      navigate('/login/admin');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User already exists, please login");
      } else {
        setError("Internal Server Error");
        console.error('Error registering admin:', error);
      }
    }
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
            <input type='text' id='name' name='name' onChange={handleChange} value={info.name} className="border-b-2 bg-gray-200 px-4 py-2" placeholder='Full Name' required />
          </div>
          <div className="mb-8 flex flex-col text-lg">
            <input type='email' id='email' name='email' onChange={handleChange} value={info.email} className="border-b-2 bg-gray-200 px-4 py-2" placeholder='Email' required />
          </div>
          <div className="mb-8 flex flex-col text-lg">
            <input type='tel' id='contact' name='contact' onChange={handleChange} value={info.contact} className="border-b-2 bg-gray-200 px-4 py-2" placeholder='Contact' required />
          </div>
          <div className="mb-8 flex flex-col text-lg">
            <input type='password' id='password' name='password' onChange={handleChange} value={info.password} className="border-b-2 bg-gray-200 px-4 py-2" placeholder='Password' required />
          </div>
          <div className="mb-8 flex flex-col text-lg">
            <input type='password' id='confirmPassword' name='confirmPassword' onChange={handleChange} value={info.confirmPassword} className="border-b-2 bg-gray-200 px-4 py-2" placeholder='Confirm Password' required />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type='submit' className="text-white border-none px-4 py-2 bg-blue-500 w-52 self-center">Register</button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
