// src/pages/CoreInfo.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Ensure correct path to AuthContext

const CoreInfo = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: '',
    merchantId: '',
    profileId: '',
    merchantOrderSupportContact: {
      email: '',
      phoneNumber: ''
    },
    supportContact: {
      email: ''
    },
    merchantSalesChannel: '',
    merchantCustomerId: ''
  });
  const { userId } = useAuth(); // Assuming useAuth provides userId
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userId) {
      axios.get(`/api/users/${userId}`)
        .then(response => {
          setUserInfo(response.data);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split('.');

    if (subfield) {
      setUserInfo({
        ...userInfo,
        [field]: {
          ...userInfo[field],
          [subfield]: value
        }
      });
    } else {
      setUserInfo({
        ...userInfo,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`/api/users/${userId}`, userInfo)
      .then(response => {
        setMessage('User information updated successfully');
      })
      .catch(error => {
        setMessage('Failed to update user information');
        console.error('Error updating user information:', error);
      });
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Core Information</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white">Username:</label>
          <input
            type="text"
            name="username"
            value={userInfo.username}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Email:</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Password:</label>
          <input
            type="password"
            name="password"
            value={userInfo.password}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Merchant ID:</label>
          <input
            type="text"
            name="merchantId"
            value={userInfo.merchantId}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Profile ID:</label>
          <input
            type="text"
            name="profileId"
            value={userInfo.profileId}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Merchant Order Support Contact Email:</label>
          <input
            type="email"
            name="merchantOrderSupportContact.email"
            value={userInfo.merchantOrderSupportContact.email}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Merchant Order Support Contact Phone Number:</label>
          <input
            type="text"
            name="merchantOrderSupportContact.phoneNumber"
            value={userInfo.merchantOrderSupportContact.phoneNumber}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Support Contact Email:</label>
          <input
            type="email"
            name="supportContact.email"
            value={userInfo.supportContact.email}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Merchant Sales Channel:</label>
          <input
            type="text"
            name="merchantSalesChannel"
            value={userInfo.merchantSalesChannel}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Merchant Customer ID:</label>
          <input
            type="text"
            name="merchantCustomerId"
            value={userInfo.merchantCustomerId}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600">
          Update
        </button>
      </form>
      {message && (
        <div className={`mt-4 p-4 rounded ${message.includes('successfully') ? 'bg-green-500' : 'bg-red-500'} text-white text-center`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CoreInfo;
