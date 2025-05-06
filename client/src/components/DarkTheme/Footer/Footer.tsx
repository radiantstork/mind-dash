import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <h3>Human Benchmark</h3>
        <ul>
          <li><a href="#">Help</a></li>
          <li><a href="#">Status</a></li>
          <li><a href="#">Privacy</a></li>
        </ul>
      </div>
      <div className={styles.socials}>
        <a href="#">🐦</a>
        <a href="#">📘</a>
        <a href="#">📺</a>
        <a href="#">📸</a>
      </div>
    </footer>
  );
};

export default Footer;