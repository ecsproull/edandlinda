import React from 'react';
import { Box, Button, Typography, Alert, Collapse } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false,
      isAdmin: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Optional: Send to logging service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false,
    });
  };

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback && !import.meta.env.DEV) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI with Material-UI
      return (
        <Box sx={{ p: 3, m: 2 }}>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={this.handleReset}>
                Try Again
              </Button>
            }
          >
            <Typography variant="h6" gutterBottom>
              {this.props.title || "Something went wrong"}
            </Typography>
            <Typography variant="body2">
              {this.props.message || "We're sorry, but an unexpected error occurred. Please try refreshing the page."}
            </Typography>
          </Alert>

          {/* Show details button for development */}
          {(import.meta.env.DEV || this.props.isAdmin) && (
            <>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={this.toggleDetails}
                sx={{ mb: 2 }}
              >
                {this.state.showDetails ? 'Hide' : 'Show'} Error Details
              </Button>
              
              <Collapse in={this.state.showDetails}>
                <Alert severity="info" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {this.state.error?.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </Alert>
              </Collapse>
            </>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;