import React, { useState, useEffect } from 'react';
import './css/LocalStoragePage.scss';

const LocalStoragePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load data from local storage when the component mounts
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  const handleDelete = (index) => {
    // Remove the user data from the array and update local storage
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleEdit = (index, updatedUserData) => {
    // Update the user data in the array and update local storage
    const updatedUsers = [...users];
    updatedUsers[index] = updatedUserData;
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  return (
    <div className='local-storage-container'>
      <h2 className='heading'>Local Storage Data</h2>
      {users.map((user, index) => (
        <div key={index} className='user-card'>
          <p>Name: {user.name}</p>
          <p>Phone Number: {user.phoneNumber}</p>
          <p>Email: {user.email}</p>
          {user.profilePic && <img src={user.profilePic} alt="Profile" style={{ maxWidth: '100px' }} />}
          <p>Date of Birth: {user.dob}</p>
          <button onClick={() => handleDelete(index)}>Delete</button>
          {/* Pass the user data and the index to the edit function */}
          <button onClick={() => handleEdit(index, { ...user, name: 'Updated Name' })}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default LocalStoragePage;
