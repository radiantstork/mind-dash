import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Welcome to Mind Dash</h1>
      <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: 24 }}>
        Challenge your reflexes, memory, and perception.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Link to="/time-perception" style={buttonStyle}>🕒 Time Perception Test</Link>
        <Link to="/login" style={buttonStyle}>🔐 Login</Link>
        {/* You can add more links as you build new tests */}
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#ffffff22',
  border: '1px solid #ffffff44',
  borderRadius: 8,
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
};

