import React, { useState, useEffect } from 'react';
import { db, storage } from '../config/firebase'; // Import the firebase configuration file
import { deleteDoc, doc, onSnapshot, collection, updateDoc } from 'firebase/firestore';

import './css/FirebasePage.scss';

const FirebasePage = () => {
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    // Load data from Firebase when the component mounts
    const unsubscribe = onSnapshot(usersCollectionRef,(snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers);
    });

    // Unsubscribe from the Firebase snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleDelete = async (userId) => {
    try {
      // Delete the user data from Firebase
      await deleteDoc(doc(db, "users", userId));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEdit = async (userId, updatedUserData) => {
    const userDoc = doc(db, "users", userId);
    try {
      // Update the user data in Firebase
      await updateDoc(userDoc, updatedUserData);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className='firebase-container'>
      <h2 className='heading'>Firebase Data</h2>
      {users.map((user) => (
        <div key={user.id} className='user-card'>
          <p>Name: {user.name}</p>
          <p>Phone Number: {user.phoneNumber}</p>
          <p>Email: {user.email}</p>
          {user.profilePicUrl && <img src={user.profilePicUrl} alt="Profile" style={{ maxWidth: '100px' }} />}
          <p>Date of Birth: {user.dob && user.dob.toDate().toDateString()}</p>
          <button onClick={() => handleDelete(user.id)}>Delete</button>
          {/* Pass the user id and the updated user data to the edit function */}
          <button onClick={() => handleEdit(user.id, { ...user, name: 'Updated Name' })}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default FirebasePage;
