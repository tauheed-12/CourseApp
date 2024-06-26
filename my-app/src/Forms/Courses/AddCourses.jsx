import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCourses = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    course_name: "",
    category: "Technology",
    thumbnail: null,
    description: ""
  });

  async function handleForm(event) {
    event.preventDefault();
    console.log(info);
    try {
      const formData = new FormData();
      formData.append('course_name', info.course_name);
      formData.append('category', info.category);
      formData.append('thumbnail', info.thumbnail);
      formData.append('description', info.description);
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/courses/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      alert("Internal Server Error")
      console.log('Error:', error);
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
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <form onSubmit={handleForm} className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <div className='mb-4'>
          <label htmlFor='course_name' className='block text-gray-700 font-bold mb-2'>Course Name</label>
          <input
            type='text'
            name='course_name'
            id='course_name'
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 font-bold mb-2'>Category</label>
          <select
            onChange={handleChange}
            id='category'
            name='category'
            required
            className='w-full px-3 py-2 border rounded'
          >
            <option>Technology</option>
            <option>Personal Development</option>
            <option>Finance</option>
            <option>Humanities</option>
            <option>Medical</option>
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor='thumbnail' className='block text-gray-700 font-bold mb-2'>Thumbnail</label>
          <input
            type='file'
            id='thumbnail'
            name='thumbnail'
            onChange={handleChange}
            required
            className='w-full'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='description' className='block text-gray-700 font-bold mb-2'>Description</label>
          <textarea
            id='description'
            name='description'
            onChange={handleChange}
            required
            className='w-full px-3 py-2 border rounded'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default AddCourses;
