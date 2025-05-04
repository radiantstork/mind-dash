import { useState, FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import customFetch from '../services/custom_fetch';
import { catchAxiosError } from '../services/catch_axios_error';
import { getCookie } from '../services/crsf_token';
import { toast } from 'react-toastify';

interface LoginResponse {
  user: {
    id: string;
    username: string;
  };
  detail?: string;
}

export default function LoginForm() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await customFetch.get('/api/csrf/');

      const response = await customFetch.post('/api/auth/login/', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie("csrftoken")
        }
      });
      setLoading(false);

      console.log(response);
      const data: LoginResponse = response.data;
      setUser({
        isAuthenticated: true,
        id: data.user.id,
        username: data.user.username,
      });
      navigate("/");
      toast.success("Logged in successfully");
    } catch (err) {
      catchAxiosError(err);
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? "Loading..." : "Log in"}
      </Button>
    </Form>
  );
}