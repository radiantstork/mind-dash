import { useState, FormEvent, ChangeEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import customFetch from '../services/custom_fetch';
import { catchAxiosError } from '../services/catch_axios_error';
import { getCsrfToken } from '../services/crsf_token';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

interface ApiResponse {
  detail?: string;
  user?: {
    id: string;
    username: string;
  };
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      await customFetch.post('/api/auth/register/', {
        credentials: formData.password,
        body: {
          username: formData.username,
          password: formData.password
        },
      });

        // Auto-login after registration
        const loginResponse = await customFetch.post('/api/auth/login/', {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': await getCsrfToken(),
          },
          credentials: 'include',
          body: {
            username: formData.username,
            password: formData.password
          },
        });

        const userData: ApiResponse = loginResponse.data;
        if (userData.user) {
          setUser({
            isAuthenticated: true,
            id: userData.user.id,
            username: userData.user.username
          });
          navigate('/');
        }
    } catch (err) {
      catchAxiosError(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          isInvalid={!!errors.username}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          isInvalid={!!errors.confirmPassword}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Register
      </Button>
    </Form>
  );
}