import styles from './Header.module.css';
import logo from '../../../assets/logo.jpg'; 
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="Logo" />
        <span>Mind <strong>Dash</strong></span>
      </Link>
      <div className={styles.authButtons}>
        <Link to="/signup" className={styles.btnOutline}>Sign Up</Link>
        <Link to="/login" className={styles.btnSolid}>Log In</Link>
      </div>
    </header>
  );
};

export default Header;
