import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stack,
  Container
} from '@mui/material';
import {
  PersonAdd,
  Login,
  Email,
  Lock,
  Person
} from '@mui/icons-material';
import { api, apiHelpers } from '../api/api';
import { useAuth } from '../contexts/authentication';

function SignupForm({ setSignUp }) {
  const { setNonvalidUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific errors on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Clear password error if passwords now match
    if (name === 'confirmPassword' || name === 'user_password') {
      if (passwordError) {
        setPasswordError('');
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Username is required';
    }
    
    if (!formData.user_email.trim()) {
      newErrors.user_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      newErrors.user_email = 'Email is invalid';
    }
    
    if (!formData.user_password) {
      newErrors.user_password = 'Password is required';
    } else if (formData.user_password.length < 6) {
      newErrors.user_password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (formData.user_password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    } else {
      setPasswordError("");
    }

    setIsLoading(true);
    
    try {
      const response = await api.users.create(formData);
      console.log('Account created successfully:', response.data);
      setNonvalidUser(formData.user_email);
      navigate('/email-verification-pending');
    } catch (error) {
      apiHelpers.handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign up to get started with your RV adventures
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Username"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              error={!!errors.user_name}
              helperText={errors.user_name}
              InputProps={{
                startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="user_email"
              type="email"
              value={formData.user_email}
              onChange={handleChange}
              error={!!errors.user_email}
              helperText={errors.user_email}
              InputProps={{
                startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="user_password"
              type="password"
              value={formData.user_password}
              onChange={handleChange}
              error={!!errors.user_password}
              helperText={errors.user_password}
              InputProps={{
                startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              required
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword || !!passwordError}
              helperText={errors.confirmPassword || passwordError}
              InputProps={{
                startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              required
            />

            {errors.submit && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.submit}
              </Alert>
            )}

            <Stack spacing={2} sx={{ mt: 3 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={<PersonAdd />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                  }
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Button
                type="button"
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate('/signin')}
                startIcon={<Login />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Already have an account? Login
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignupForm;