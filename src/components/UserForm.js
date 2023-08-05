import React, { useState } from 'react';
import { db, storage } from '../config/firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import './css/UserForm.scss';


const UserForm = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [dob, setDob] = useState(null);
  const usersCollectionRef = collection(db, "users");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save data to Firebase
      const profilePicRef = ref(storage, `profile_pics/${profilePic.name + v4()}`);
      await uploadBytes(profilePicRef, profilePic).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // Save data to local storage
          const userData = {
            name,
            phoneNumber,
            email,
            profilePic: profilePic && profilePic.name,
            dob: dob && dob.toISOString(),
          };

          setProfilePicUrl(url);
          setProfilePic(url);
          
          const users = JSON.parse(localStorage.getItem('users')) || [];
          users.push(userData);
          localStorage.setItem('users', JSON.stringify(users));

          // Create the userDoc object inside the getDownloadURL callback
          const dobTimestamp = dob && Timestamp.fromDate(dob);

          let userDoc = {
            name,
            phoneNumber,
            email,
            profilePicUrl: url, // Use the updated profilePicUrl from the callback
            dob: dobTimestamp,
          };

          // Save userDoc to Firestore
          addDoc(usersCollectionRef, userDoc);
        }).catch((error) => {console.error('Error getting download URL:', error);});
      });
      // Clear the form after submission
      setName('');
      setPhoneNumber('');
      setEmail('');
      setProfilePic(null);
      setDob(null);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='user-form-container'>
      {/* Name Input */}
      <label htmlFor="name">Name</label>
      <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />

      {/* Phone Number Input */}
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="text"
        id="phoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />

      {/* Email Input */}
      <label htmlFor="email">Email</label>
      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      {/* Profile Picture Input */}
      <label htmlFor="profilePic">Profile Picture</label>
      <input type="file" id="profilePic" onChange={(e) => setProfilePic(e.target.files[0])} />

      {/* Date of Birth Input */}
      <label htmlFor="dob">Date of Birth</label>
      <DatePicker id="dob" selected={dob} onChange={(date) => setDob(date)} dateFormat="yyyy-MM-dd" />

      {/* Submit Button */}
      <button type="submit">Save</button>
    </form>
  );
};

export default UserForm;
