import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit,
  FilterList,
  Person,
  Category as CategoryIcon,
  Delete,
  AdminPanelSettings,
  Article
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/pagelayout';
import { blogCategories } from '../consts/consts';
import { api } from '../api/api';
import { useAuth } from '../contexts/authentication';

export default function EditBlog() {
  const { user, hasRole } = useAuth();
  const [error, setError] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, blog: null });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) { // Only fetch when user is loaded
      fetchBlogs();
    }
  }, [user]); // Add user as dependency

  useEffect(() => {
    filterBlogs();
  }, [blogs, selectedCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.blog.getAll();

      // Filter blogs based on user role
      let userBlogs = response.data;

      if (!hasRole('Admin')) {
        // Non-admin users can only see their own blogs
        userBlogs = response.data.filter(blog =>
          blog.blog_owner_email === user?.email ||
          blog.blog_owner_name === user?.name
        );
      }

      setBlogs(userBlogs);
      setError('');
    } catch (error) {
      console.error('Error fetching blogs:', error);
      if (error.response) {
        setError(`Failed to load blog posts. Server error: ${error.response.status}`);
      } else if (error.request) {
        setError('Failed to load blog posts. Network error.');
      } else {
        setError('Failed to load blog posts. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    if (selectedCategory === 'All') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.blog_category === selectedCategory));
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleEditBlog = (blog) => {
    // Check if user can edit this blog
    if (!hasRole('Admin') && blog.blog_owner_email !== user?.email && blog.blog_owner_name !== user?.name) {
      setError('You can only edit your own blog posts.');
      return;
    }

    navigate(`/edit-blog/${blog.id}`, {
      state: { blog: blog }
    });
  };

  const handleDelete = (blog) => {
    // Check if user can delete this blog
    if (!hasRole('Admin') && blog.blog_owner_email !== user?.email && blog.blog_owner_name !== user?.name) {
      setError('You can only delete your own blog posts.');
      return;
    }

    setDeleteDialog({ open: true, blog });
  };

  const confirmDelete = async () => {
    try {
      await api.blog.delete(deleteDialog.blog.id);

      // Remove the deleted blog from the state
      setBlogs(prev => prev.filter(blog => blog.id !== deleteDialog.blog.id));

      // Show success message (optional)
      setError('Blog post deleted successfully');
      setTimeout(() => setError(''), 3000);

    } catch (error) {
      console.error('Error deleting blog:', error);

      if (error.response) {
        setError(`Failed to delete blog post. Server error: ${error.response.status}`);
      } else if (error.request) {
        setError('Failed to delete blog post. Network error.');
      } else {
        setError('Failed to delete blog post. Please try again.');
      }
    } finally {
      setDeleteDialog({ open: false, blog: null });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (htmlText, maxLength = 150) => {
    if (!htmlText) return '';

    // Strip HTML tags to get plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlText;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Travel': 'primary',
      'RV Technology': 'secondary',
      'Maintenance': 'warning',
      'Destinations': 'success',
      'Tips & Tricks': 'info',
      'Personal Stories': 'error',
      'Equipment Reviews': 'default',
      'Camping Life': 'primary',
      'Adventures': 'secondary',
      'General': 'default'
    };
    return colors[category] || 'default';
  };

  const decodeHtmlEntities = (text) => {
    if (!text) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  if (loading || !user) {
    return (
      <PageLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Paper variant="gradient" elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            <Edit sx={{ mr: 2, fontSize: '2rem' }} />
            Manage Blog Posts
          </Typography>
          <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
            {hasRole('Admin') ? 'Admin view: All blog posts' : 'Your blog posts'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Chip
              icon={hasRole('Admin') ? <AdminPanelSettings /> : <Person />}
              label={hasRole('Admin') ? 'Admin Access' : 'User Access'}
              color={hasRole('Admin') ? 'secondary' : 'primary'}
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filter Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FilterList color="primary" />
            <Typography variant="h6" sx={{ mr: 2 }}>Filter Posts:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
              >
                {blogCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              Showing {filteredBlogs.length} of {blogs.length} posts
            </Typography>
          </Box>
        </Paper>

        {/* Blog Posts Grid */}
        {filteredBlogs.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Article sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No blog posts found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedCategory === 'All'
                ? 'You haven\'t created any blog posts yet.'
                : `No posts found in the "${selectedCategory}" category.`}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/create-blog')}
              sx={{ mt: 2 }}
            >
              Create Your First Post
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredBlogs.map((blog) => (
              <Grid size={12} key={blog.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Header with category and date */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip
                        icon={<CategoryIcon />}
                        label={blog.blog_category}
                        color={getCategoryColor(blog.blog_category)}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(blog.createdAt)}
                      </Typography>
                    </Box>

                    {/* Title */}
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                      {decodeHtmlEntities(blog.blog_subject)}
                    </Typography>

                    {/* Author info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                        {blog.blog_owner_name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        by {blog.blog_owner_name}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Content preview */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {truncateText(blog.blog_body)}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">
                        {blog.blog_body.length} characters
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {blog.blog_body.split(' ').length} words
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => handleEditBlog(blog)}
                        sx={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                          }
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(blog)}
                        sx={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, blog: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Delete color="error" />
            <Typography variant="h6">Delete Blog Post</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this blog post?
          </Typography>

          {deleteDialog.blog && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {deleteDialog.blog.blog_subject}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                by {deleteDialog.blog.blog_owner_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(deleteDialog.blog.createdAt)}
              </Typography>
            </Box>
          )}

          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. The blog post will be permanently deleted.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, blog: null })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{
              background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
              }
            }}
          >
            Delete Post
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}