import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Ensure this path is correct

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth(); // Get isLoggedIn and logout from context

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Radius
      </Link>
      <ul>
        <CustomLink to="/pricing">Pricing</CustomLink>
        {isLoggedIn ? (
          <>
            <li>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </li>
          </>
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
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
