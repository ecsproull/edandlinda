import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Grid,
} from '@mui/material';
import {
  Create,
  Send,
  Person,
  Email,
  Category,
  Subject,
} from '@mui/icons-material';
import PageLayout from '../layouts/pagelayout';
import { blogCategories } from '../consts/consts';
import { useParams, useLocation } from 'react-router-dom';
import RichTextEditor from '../components/richtexteditor/richtexteditor';
import { api, apiHelpers } from '../api/api';


export default function BlogForm() {
  const { id } = useParams();
  const location = useLocation();
  const blogFromState = location.state?.blog;


  const [formData, setFormData] = useState({
    id: 0,
    blog_owner_name: '',
    blog_owner_email: '',
    blog_category: '',
    blog_subject: '',
    blog_body: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  // Effect to handle blog data loading
  useEffect(() => {
    if (blogFromState) {
      // If blog data was passed via navigation state
      setFormData({
        id: blogFromState.id || 0,
        blog_owner_name: blogFromState.blog_owner_name || '',
        blog_owner_email: blogFromState.blog_owner_email || '',
        blog_category: blogFromState.blog_category || '',
        blog_subject: blogFromState.blog_subject || '',
        blog_body: blogFromState.blog_body || ''
      });
    } else if (id) {
      // If we have an ID but no state data, fetch from API
      fetchBlogData(id);
    }
  }, [id, blogFromState]);

  // Function to fetch blog data by ID
  const fetchBlogData = async (blogId) => {
    setFetchLoading(true);
    try {
      const response = await api.blog.getById(blogId);

      // Populate form with fetched data
      setFormData({
        blog_id: response.data.id || 0,
        blog_owner_name: response.data.blog_owner_name || '',
        blog_owner_email: response.data.blog_owner_email || '',
        blog_category: response.data.blog_category || '',
        blog_subject: response.data.blog_subject || '',
        blog_body: response.data.blog_body || ''
      });

    } catch (error) {
      apiHelpers.handleError(error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    console.log('Submitting blog post:', formData);
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.blog.create(formData);
      console.log('Blog post created:', response.data);

      setAlert({
        open: true,
        message: 'Blog post created successfully!',
        severity: 'success'
      });

      // Reset form
      setFormData({
        blog_owner_name: '',
        blog_owner_email: '',
        blog_category: '',
        blog_subject: '',
        blog_body: ''
      });

    } catch (error) {
      console.error('Error creating blog post:', error);
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Error creating blog post. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const isFormValid = () => {
    return formData.blog_owner_name.trim() !== '' &&
      formData.blog_owner_email.trim() !== '' &&
      formData.blog_category.trim() !== '' &&
      formData.blog_subject.trim() !== '' &&
      formData.blog_body.trim() !== '';
  };

  const handleEditorChange = useCallback((content) => {
    setFormData(prev => ({ ...prev, blog_body: content }));
  }, []);

  return (
    <PageLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Paper variant="gradient" elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            <Create sx={{ mr: 2, fontSize: '2rem' }} />
            Create Post
          </Typography>
          <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
            Share your RV adventures and experiences
          </Typography>
        </Paper>

        {/* Form */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ sx: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="blog_owner_name"
                  value={formData.blog_owner_name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Person color="primary" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>

              <Grid size={{ sx: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Your Email"
                  name="blog_owner_email"
                  type="email"
                  value={formData.blog_owner_email}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Email color="primary" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>

              <Grid size={{ sx: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="blog_category"
                    value={formData.blog_category}
                    onChange={handleInputChange}
                    label="Category"
                    startAdornment={<Category color="primary" sx={{ mr: 1 }} />}
                  >
                    {blogCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ sx: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Subject/Title"
                  name="blog_subject"
                  value={formData.blog_subject}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Subject color="primary" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>

              <Grid size={12}>
                <Typography variant="body1" gutterBottom>
                  Blog Content *
                </Typography>
                <RichTextEditor
                  value={formData.blog_body}
                  onChange={handleEditorChange}
                  placeholder="Write your blog post here... Share your RV adventures, tips, experiences!"
                />
              </Grid>

              {/* Submit Button */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!isFormValid() || loading}
                    startIcon={<Send />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                      }
                    }}
                  >
                    {loading ? 'Publishing...' : formData.id ? 'Update Blog Post' : 'Publish Blog Post'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Character Count Helper */}
        <Paper elevation={1} sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="body2" color="text.secondary">
            Subject: {formData.blog_subject.length} characters |
            Content: {formData.blog_body.length} characters
          </Typography>
        </Paper>

        {/* Success/Error Alert */}
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageLayout>
  );
}