// Create src/components/auth/EmailVerificationPending.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Email,
  Refresh,
  CheckCircle
} from '@mui/icons-material';
import { api } from '../api/api';
import { useAuth } from '../contexts/authentication';

function EmailVerificationPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { nonvalidUser } = useAuth();

  const email = nonvalidUser || '';

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');
    
    try {
      await api.auth.resendVerificationEmail({ email });
      setResendMessage('Verification email sent! Please check your inbox.');
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      setResendMessage('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Email sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Check Your Email
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We've sent a verification link to:
          </Typography>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mb: 3 }}>
            {email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click the link in the email to verify your account and complete registration.
          </Typography>
        </Box>

        {resendMessage && (
          <Alert 
            severity={resendMessage.includes('sent') ? 'success' : 'error'} 
            sx={{ mb: 3 }}
          >
            {resendMessage}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            onClick={handleResendEmail}
            disabled={isResending || countdown > 0}
            variant="outlined"
            startIcon={isResending ? <CircularProgress size={20} /> : <Refresh />}
            fullWidth
          >
            {countdown > 0 
              ? `Resend in ${countdown}s` 
              : isResending 
                ? 'Sending...' 
                : 'Resend Verification Email'
            }
          </Button>

          <Button
            onClick={() => navigate('/signin')}
            variant="text"
            fullWidth
          >
            Back to Sign In
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            <strong>Didn't receive the email?</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Check your spam/junk folder<br/>
            • Make sure {email} is correct<br/>
            • Wait a few minutes and try again
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default EmailVerificationPending;