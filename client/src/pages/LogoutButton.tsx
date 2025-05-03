import { Button } from 'react-bootstrap';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getCsrfToken } from '../services/crsf_token';
import customFetch from '../services/custom_fetch';
import { catchAxiosError } from '../services/catch_axios_error';

export default function LogoutButton() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await customFetch.post('/api/auth/logout/', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': await getCsrfToken(),
        },
        credentials: 'include',
      });

      setUser({
        isAuthenticated: false,
        id: 'local_anon',
        username: 'Guest'
      });
      navigate('/login');
    } catch (err) {
      catchAxiosError(err);
    }
  };

  if (!user.isAuthenticated) return null;

  return (
    <Button variant="outline-danger" onClick={handleLogout}>
      Logout
    </Button>
  );
}