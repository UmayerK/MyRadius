import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Ensure this path is correct

const Register = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [merchantId, setMerchantId] = useState(''); // State for merchantId
    const { login } = useAuth();  // Get login function from context

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/register', {
                email,
                password,
                username: name,
                merchantId // Include merchantId in the request body
            });
            console.log('Registration response:', response.data); // Log response
            if (response.data.success) {
                alert('Registration completed');
                login(response.data.userId);  // Automatically log in the user after registration
            }
        } catch (error) {
            console.error('Registration error:', error.response.data); // Log error
            alert('Registration failed: ' + error.response.data);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                email,
                password
            });
            if (response.data.success) {
                login(response.data.userId);  // Call login function on successful login
                alert('Login successful');
            } else {
                alert('Login failed');
            }
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center ml-[15%] ">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`px-4 py-2 rounded-t-md ${activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`px-4 py-2 rounded-t-md ${activeTab === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Register
                    </button>
                </div>
                {activeTab === 'login' ? (
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Login
                        </h2>
                        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="email-address" className="sr-only">Email address</label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Register
                        </h2>
                        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="email-address" className="sr-only">Email address</label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name" className="sr-only">Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="merchant-id" className="sr-only">Merchant ID</label>
                                    <input
                                        id="merchant-id"
                                        name="merchantId"
                                        type="text"
                                        autoComplete="merchant-id"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Merchant ID"
                                        value={merchantId}
                                        onChange={(e) => setMerchantId(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
