import React, { useState } from 'react';

export default function Register() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would add your logic to handle the submission
    // For demonstration, we'll just log the values
    console.log({ email, password, ...(isLogin ? {} : { name }) });
    // Simulate an error
    setError('You have entered a wrong email or password');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        <button
          className={`px-4 py-2 ${isLogin ? 'text-blue-500' : 'text-gray-500'}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 ${!isLogin ? 'text-blue-500' : 'text-gray-500'}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>
      <form className="w-full max-w-xs" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        {/* Email and Password fields remain unchanged */}
      </form>
    </div>
  );
}
export default Register;