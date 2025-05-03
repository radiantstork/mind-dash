// frontend/src/pages/LoginPage.js
import { Container } from 'react-bootstrap';
import LoginForm from './LoginForm.tsx';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <Container className="py-5">
      <h2 className="mb-4">Log In</h2>
      <LoginForm />
      <p className="mt-3 text-center">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </Container>
  );
}