import Navbar from "./Navbar"
import Pricing from "./pages/workcalc"
import Home from "./pages/Home"
import Register from "./pages/Register"
import { Route, Routes } from "react-router-dom"
import "tailwindcss/tailwind.css"

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<Register />} />
        </Routes>
      </div>
    </>
  )
}

export default App
