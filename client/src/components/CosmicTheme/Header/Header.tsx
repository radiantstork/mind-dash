import { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import customFetch from "../../../services/custom_fetch";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { getCookie } from "../../../services/crsf_token";
import { toast } from "react-toastify";
import { catchAxiosError } from "../../../services/catch_axios_error";

const Header = () => {
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log(user.isAuthenticated);
  

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
      <div className={styles.logo}>⚡ Mind Dash</div>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        {!user.isAuthenticated
          ? <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
          : <button onClick={handleLogout}>
            {loading ? "Logging out..." : "Logout"}
          </button>
        }
      </nav>
    </header>
  );
};

export default Header;
