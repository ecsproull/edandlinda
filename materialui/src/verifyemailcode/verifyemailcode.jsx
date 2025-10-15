import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Login,
  Email
} from '@mui/icons-material';
import { api } from '../api/api';
import { useAuth } from '../contexts/authentication';

function VerifyEmailCode() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!code) {
        setStatus('error');
        setMessage('Invalid verification code. Please check your email link.');
        return;
      }

      try {
        console.log('Sending verification request with code:', code);
        const response = await api.users.verify({ code }); // Pass object, not JSON string
        login(response.data.accessToken); // Assuming the response contains an access token
        console.log('Verification successful:', response.data);
        setStatus('success');
        navigate('/home');
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');

        // Handle different types of errors
        if (error.message.includes('expired')) {
          setMessage('Verification code has expired. Please request a new verification email.');
        } else if (error.message.includes('invalid') || error.message.includes('not found')) {
          setMessage('Invalid verification code. Please check your email link or request a new verification email.');
        } else {
          setMessage(error.message || 'Verification failed. Please try again or contact support.');
        }
      }
    };

    verifyEmail();
  }, [code]);

  const handleSignIn = () => {
    navigate('/signin', {
      state: {
        message: 'Email verified successfully! Please sign in with your credentials.',
        email: userEmail
      }
    });
  };

  const handleRequestNewCode = () => {
    navigate('/signup', {
      state: {
        message: 'Please sign up again to receive a new verification email.'
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {status === 'verifying' && (
            <>
              <CircularProgress size={64} sx={{ mb: 2, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Verifying Email...
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please wait while we verify your email address
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom sx={{
                color: 'success.main',
                fontWeight: 'bold'
              }}>
                Email Verified!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your account has been successfully activated
              </Typography>
            </>
          )}

          {status === 'error' && (
            <>
              <Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom sx={{
                color: 'error.main',
                fontWeight: 'bold'
              }}>
                Verification Failed
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We couldn't verify your email address
              </Typography>
            </>
          )}
        </Box>

        {/* Status Message */}
        <Alert
          severity={status === 'success' ? 'success' : status === 'error' ? 'error' : 'info'}
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>

        {/* User Email Display (if available) */}
        {userEmail && status === 'success' && (
          <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Verified email:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {userEmail}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {status === 'success' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              onClick={handleSignIn}
              variant="contained"
              startIcon={<Login />}
              fullWidth
              size="large"
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
              Continue to Sign In
            </Button>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              You can now sign in with your username and password
            </Typography>
          </Box>
        )}

        {status === 'error' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              onClick={handleRequestNewCode}
              variant="contained"
              fullWidth
              size="large"
              sx={{ py: 1.5 }}
            >
              Request New Verification Email
            </Button>

            <Button
              onClick={() => navigate('/signin')}
              variant="outlined"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Back to Sign In
            </Button>
          </Box>
        )}

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              <strong>Debug Info:</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Code: {code || 'No code provided'}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Status: {status}
            </Typography>
          </Box>
        )}

        {/* Help Text */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            <strong>Need help?</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Check that you clicked the correct link from your email<br />
            • Verification links expire after 24 hours<br />
            • Make sure you're using the latest email we sent you
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default VerifyEmailCode;