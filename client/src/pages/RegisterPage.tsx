// frontend/src/pages/RegisterPage.js
import { Container } from 'react-bootstrap';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Create Account</h2>
      <RegisterForm />
    </Container>
  );
}