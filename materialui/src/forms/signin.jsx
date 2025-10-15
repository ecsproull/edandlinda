import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrawer } from '../contexts/drawer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import PageLayout from '../layouts/pagelayout';
import { useAuth } from '../contexts/authentication';
import { api } from '../api/api'; // Add this import

function Signin() {
  const { login, setNonvalidUser } = useAuth();
  const [formData, setFormData] = useState({
    user_name: '',
    user_password: '',
  });
  const { drawerWidth } = useDrawer();
  const navigate = useNavigate();
  const [error, setError] = useState(''); // Add error state
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);

    try {
      const response = await api.auth.login(formData);

      console.log('Login successful:', response.data);

      // Login with the token from response
      login(response.data.accessToken);
      navigate('/home');

    } catch (error) {
      console.error('Login error:', error);

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401) {
          setError('Invalid username or password. Please try again.');
        } else if (status === 403) {
          setError('Account not approved. Please contact an administrator.');
          setNonvalidUser(error.response.data?.user_email)
          navigate('/email-verification-pending')
        } else if (status === 429) {
          setError('Too many login attempts. Please try again later.');
        } else {
          setError(message || `Server error: ${status}. Please try again.`);
        }
      } else if (error.request) {
        // Network error
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Box sx={{ width: 300, mb: 2 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            id="username"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            margin="normal"
            disabled={isLoading}
            required
          />
        </Box>
        <Box sx={{ width: 300, mb: 2 }}>
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            id="password"
            name="user_password"
            value={formData.user_password}
            onChange={handleChange}
            margin="normal"
            disabled={isLoading}
            required
          />
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ width: 300, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading || !formData.user_name.trim() || !formData.user_password.trim()}
          sx={{
            mt: 2,
            px: 5,
            py: 1.5,
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%)',
            position: 'relative',
            minWidth: 120,
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign In'
          )}
        </Button>
      </Box>
    </PageLayout>
  );
}

export default Signin;