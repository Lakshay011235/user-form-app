import React, { useState } from 'react';
import { db, storage } from '../config/firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection } from 'firebase/firestore';

const UserForm = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [dob, setDob] = useState(null);
  const usersCollectionRef = collection(db, "users");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save data to local storage
      const userData = {
        name,
        phoneNumber,
        email,
        profilePic: profilePic && profilePic.name,
        dob: dob && dob.toISOString(),
      };
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));

      // Save data to Firebase
      const profilePicRef = profilePic && storage.ref().child(`profile_pics/${profilePic.name}`);
      const dobTimestamp = dob && db.Timestamp.fromDate(dob);

      const userDoc = {
        name,
        phoneNumber,
        email,
        profilePicUrl: profilePic && (await profilePicRef.put(profilePic)).downloadURL,
        dob: dobTimestamp,
      };
      await addDoc(usersCollectionRef, userDoc);

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
    <form onSubmit={handleSubmit}>
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
