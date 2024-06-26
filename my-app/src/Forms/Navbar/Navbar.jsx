import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = ({
  isLoggedIn,
  LoggedId,
  setProfileContact,
  setProfileEmail,
  setProfileName,
  setActivateProfile,
  setEnrolled,
  setProfileImg,
  setCategory
}) => {
  const navigate = useNavigate();

  const handProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found in localStorage");
        return;
      }

      const requestData = { loggedId: LoggedId };
      console.log("Token:", token);
      console.log("Request Data:", requestData);

      const response = await axios.post('http://localhost:5000/student/profile', requestData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Response Data:", response.data);

      setEnrolled(response.data.courses);
      setProfileContact(response.data.data[0].contact);
      setProfileEmail(response.data.data[0].email);
      setProfileName(response.data.data[0].name);
      setProfileImg(response.data.data[0].imgname);
      setActivateProfile(true);
      navigate(`/student/${LoggedId}`);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className='Navbar bg-gray-800 text-white p-4 flex flex-col md:justify-between md:items-center md:flex-row'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold'>CourseWorld</h1>
        <span className='ml-4'>Filter</span>
        <select className='ml-2 p-2 bg-gray-700 text-white' onChange={(event) => setCategory(event.target.value)}>
          <option>Technology</option>
          <option>Personal Development</option>
          <option>Finance</option>
          <option>Humanities</option>
          <option>Medical</option>
        </select>
      </div>
      <div className='mt-4 md:mt-0'>
        {!isLoggedIn ? (
          <div className='flex gap-4'>
            <Link to='/login/student'><button className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Sign In</button></Link>
            <Link to='/login/admin'><button className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Teach on CourseWorld</button></Link>
            <Link to='/register/student'><button className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Sign Up</button></Link>
          </div>
        ) : (
          <div className='flex gap-4'>
            <button onClick={handProfile} className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Profile</button>
            <Link to='/student/logout'><button className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Logout</button></Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
