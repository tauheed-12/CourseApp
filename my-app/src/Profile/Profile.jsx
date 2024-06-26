import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Forms/Navbar/Navbar';

const Profile = ({ name, email, contact, Enrolled, img, studentId }) => {
  const [info, setInfo] = useState({
    studentId: studentId,
    name: "",
    email: "",
    contact: "",
  });
  const [isEdited, setIsEdited] = useState(false);
  const [error, setError] = useState(null);

  const handleUnEnroll = async (course_id) => {
    try {
      const data = { course_id, studentId };
      const response = await axios.post('http://localhost:5000/courses/unenroll', data);
      console.log(response);
    } catch (error) {
      console.log("Error unenrolling:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", info);
    try {
      const response = await axios.post('http://localhost:5000/student/profileEdit', info);
      console.log(response.data);
      setIsEdited(false);
    } catch (error) {
      console.log("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      {isEdited ? (
        <form onSubmit={handleFormSubmit} className="p-4">
          <label htmlFor='name'>New Full Name:</label>
          <input type='text' id='name' name='name' onChange={handleChange} value={info.name} className="border-b-2 bg-gray-200 px-4 py-2 mb-2" required />
          <label htmlFor='email'>New Email:</label>
          <input type='email' id='email' name='email' onChange={handleChange} value={info.email} className="border-b-2 bg-gray-200 px-4 py-2 mb-2" required />
          <label htmlFor='contact'>New Contact Number:</label>
          <input type='tel' id='contact' name='contact' onChange={handleChange} value={info.contact} className="border-b-2 bg-gray-200 px-4 py-2 mb-2" required />
          {error && <p className="text-red-500">{error}</p>}
          <button type='submit' className="text-white border-none px-4 py-2 bg-blue-500 self-center mt-2">Update</button>
        </form>
      ) : (
        <div className="p-4 flex justify-center items-center">
          <div className="flex gap-8 shadow-lg rounded-md w-2/5 self-center py-8 px-4">
            <img src={`http://localhost:5000/uploads/${img}`} className="h-28 w-28 rounded-full" alt="Profile" />
            <div className="flex flex-col justify-start self-start gap-2">
              <h1 className="text-lg font-semibold">{name}</h1>
              <span className='text-md'>{email}</span>
              <span className='text-md'>{contact}</span>
              <button className="border-solid border-blue-900 border-2 bg-blue-900 p-2 py-1 shadow-md text-white rounded-md mt-2" onClick={() => setIsEdited(true)}>Edit</button>
            </div>
          </div>
        </div>
      )}

      <div className="px-8">
        <h1 className="text-2xl font-semibold text-blue-800">Your Learning</h1>
        <div className="w-20 h-2 bg-blue-900 mb-4"></div>
        <div className="flex flex-wrap justify-center">
          {Enrolled && Enrolled.length > 0 ? (
            Enrolled.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center max-w-96 p-2 py-4 shadow-lg m-4 gap-4 mb-8">
                <img src={`http://localhost:5000/uploads/${item.thumbnail}`} alt={`Thumbnail ${index}`} className="max-h-60" />
                <h1 className="text-lg font-semibold">{item.course_name}</h1>
                <h3 className="text-md">{item.category}</h3>
                <p className="text-sm">{item.description}</p>
                <button onClick={() => handleUnEnroll(item.course_id)} className="border-solid border-blue-900 border-2 bg-blue-900 p-2 py-1 shadow-md text-white rounded-md mt-2">Unenroll</button>
                <button className="border-solid border-blue-900 border-2 bg-blue-900 p-2 py-1 shadow-md text-white rounded-md mt-2">Continue</button>
              </div>
            ))
          ) : (
            <p className="text-center mt-8">No courses enrolled.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
