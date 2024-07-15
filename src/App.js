import Navbar from "./Navbar";
import Pricing from "./pages/workcalc";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // Ensure this path is correct
import "tailwindcss/tailwind.css";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
