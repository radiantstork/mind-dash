import { Button } from 'react-bootstrap';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../services/crsf_token';
import customFetch from '../services/custom_fetch';
import { catchAxiosError } from '../services/catch_axios_error';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function LogoutButton() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

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

  if (!user.isAuthenticated) return null;

  return (
    <Button variant="outline-danger" onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Log out"}
    </Button>
  );
}