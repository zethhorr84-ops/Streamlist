import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-container">
        <NavLink to="/" className="logo">🎬 StreamList</NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Movies</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Cart</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
        </div>
        <div className="account-controls">
          <span className="signed-in-label" title={user?.email}>{user?.name || 'Signed in'}</span>
          <button className="logout-button" type="button" onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
