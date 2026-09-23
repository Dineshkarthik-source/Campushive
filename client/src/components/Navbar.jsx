import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="nav">
      <Link to="/" className="brand">
        <span className="hex" aria-hidden="true" />
        CampusHive
      </Link>
      <nav className="nav-links">
        <NavLink to="/feed">Feed</NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/clubs">Clubs</NavLink>
      </nav>
      <div className="nav-user">
        {user ? (
          <>
            <span className="hex-avatar" title={user.name}>{user.name[0]}</span>
            <button className="btn ghost" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link className="btn ghost" to="/login">Log in</Link>
            <Link className="btn" to="/register">Join the hive</Link>
          </>
        )}
      </div>
    </header>
  );
}
