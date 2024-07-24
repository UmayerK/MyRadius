import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Ensure this path is correct
import { useState } from "react"; // Import useState for managing dropdown state

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth(); // Get isLoggedIn and logout from context
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      <Link to="/" className="text-white text-xl font-bold">
        Radius
      </Link>
      <ul className="flex space-x-4">
        <CustomLink to="/pricing">Pricing</CustomLink>
        {isLoggedIn ? (
          <li className="relative">
            <button
              onClick={toggleDropdown}
              className="text-white bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
            >
              Settings
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                <li className="border-b">
                  <Link to="/core-info" className="block px-4 py-2 text-black hover:bg-gray-200">
                    Core Information
                  </Link>
                </li>
                <li className="border-b">
                  <Link to="/fulfiller-info" className="block px-4 py-2 text-black hover:bg-gray-200">
                    Fulfiller Information
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <CustomLink to="/register">Register/Login</CustomLink>
        )}
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "text-blue-700" : "text-white"}>
      <Link to={to} {...props} className="hover:text-blue-300">
        {children}
      </Link>
    </li>
  );
}
