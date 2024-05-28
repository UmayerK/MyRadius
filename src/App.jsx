// Import necessary libraries and components
import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';

// Define the App component
function App() {
  // Define a state variable 'count' and its setter 'setCount'
  const [count, setCount] = useState(0);

  // Use the useEffect hook to run code after the component mounts
  useEffect(() => {
    // Get the first stylesheet on the page
    const styleSheet = document.styleSheets[0];

    // Define a string for a CSS keyframes animation
    const keyframes = `
      @keyframes gradient {
        0% { background-color: #000000; }
        33% { background-color: #00008B; }
        66% { background-color: #2c003e; }
        100% { background-color: #000000; }
      }
    `;

    // Insert the keyframes animation into the stylesheet
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  }, []); // Empty dependency array means this effect runs once on mount and not on updates

  // Return the JSX to render
  return (
    <div className="App">
      <Header /> {/* Render the Header component */}
      <div className="w-full h-screen flex items-center justify-center" style={{
        animation: 'gradient 12s infinite', // Apply the gradient animation
        backgroundSize: '400% 400%' // Increase the size of the background image
      }}>
        <h1 className="text-6xl font-bold text-white z-[100]">Radius</h1>
      </div>
    </div>
  );
}

export default App;