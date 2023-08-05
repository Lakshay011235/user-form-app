import React, { useState, useEffect } from 'react';
import { db, storage } from '../config/firebase'; // Import the firebase configuration file
import { getDoc, deleteDoc, doc, onSnapshot, collection, updateDoc } from 'firebase/firestore';

import './css/FirebasePage.scss';
import { ref, deleteObject } from 'firebase/storage';

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
    // Fetch the user data from Firestore
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    // Delete the user data from Firestore
    await deleteDoc(userRef);

    // If a profile picture URL exists, delete the corresponding file from Firebase Storage
    if (userData && userData.profilePicUrl) {
      // Create a reference to the profile picture file
      const profilePicRef = ref(storage, userData.profilePicUrl);

      // Delete the file from Storage
      await deleteObject(profilePicRef);
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
