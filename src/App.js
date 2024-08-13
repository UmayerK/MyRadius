import Navbar from "./Navbar";
import Pricing from "./pages/workcalc";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CoreInfo from "./pages/CoreInfo"; // Import CoreInfo page
import FulfillerInfo from "./pages/FulfillerInfo"; // Import FulfillerInfo page
import AboutSection from "./pages/About"; // Corrected the import to AboutSection
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; 
import "tailwindcss/tailwind.css";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/core-info" element={<CoreInfo />} /> {/* Add CoreInfo route */}
          <Route path="/fulfiller-info" element={<FulfillerInfo />} /> {/* Add FulfillerInfo route */}
          <Route path="/about" element={<AboutSection />} /> {/* Corrected to AboutSection */}
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
