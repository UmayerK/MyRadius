// Import necessary libraries and components
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import WorkCalc from '/src/components/workCalc'; // Import the WorkCalc component
import './index.css'; // Import global styles

// Use ReactDOM to render the application into the 'root' div in the HTML
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* Render the main App component */}
    <WorkCalc /> {/* Render the WorkCalc component */}
  </React.StrictMode>,
);