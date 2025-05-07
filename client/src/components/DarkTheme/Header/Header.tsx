import styles from './Header.module.css';
import logo from '../../../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { catchAxiosError } from '../../../services/catch_axios_error';
import customFetch from '../../../services/custom_fetch';
import { getCookie } from '../../../services/crsf_token';
import { useUserContext } from '../../../context/UserContext';
import { useState } from 'react';

const Header = () => {
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await customFetch.post('/api/auth/logout/', {}, {
        headers: {
          "Content-Type": 'application/json',
          'X-CSRFToken': getCookie("csrftoken"),
        }
      });

      setUser({
        isAuthenticated: false,
        id: 'local_anon',
        username: 'Guest'
      });
      setLoading(false);
      navigate('/');
      toast.success("Logged out successfully");
    } catch (err) {
      setLoading(false);
      catchAxiosError(err);
    }
  };
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="Logo" />
        <span>Mind <strong>Dash</strong></span>
      </Link>
      <div className={styles.authButtons}>
        {!user.isAuthenticated
          ? <>
            <Link to="/signup" className={styles.btnOutline}>Sign Up</Link>
            <Link to="/login" className={styles.btnSolid}>Log In</Link>
          </>
          : <button onClick={handleLogout} className={styles.btnOutline}>
            {loading ? "Logging out..." : "Logout"}
          </button>
        }
      </div>
    </header>
  );
};

export default Header;
