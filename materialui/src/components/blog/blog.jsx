import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Article,
  FilterList,
  Category as CategoryIcon,
  DateRange,
  ExpandMore,
  ExpandLess,
  Comment as CommentIcon,
  Send,
  Person,
  Edit,
  Save,
  Cancel,
  Delete,
  ContentCopy
} from '@mui/icons-material';
import PageLayout from '../../layouts/pagelayout';
import { blogCategories } from '../../consts/consts';
import { api, apiHelpers } from '../../api/api';
import { useAuth } from '../../contexts/authentication';
import { useSEO } from '../seo/seohook';

export default function Blog() {
  const { user, isAuthenticated, hasAnyRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [editingComments, setEditingComments] = useState(new Set());
  const [editCommentTexts, setEditCommentTexts] = useState({});
  const [commentForm, setCommentForm] = useState({
    commenter_name: user?.name || '',
    commenter_email: user?.email || '',
    comment_body: ''
  });

  useSEO({
    description: "Latest RV travel stories, triathlon training, website development, and campground reviews",
    keywords: "RV blog, travel stories, camping tips, website development, campground reviews, triathlon training, Ironman tips, triathlon blog"
  });

  useEffect(() => {
    // Only use search params for consistency
    const categoryFromUrl = searchParams.get('category') || 'All';
    setSelectedCategory(categoryFromUrl);

    // Only fetch blogs once
    if (blogs.length === 0) {
      fetchBlogs();
    }

  }, [searchParams]); // Only depend on searchParams

  // Add this useEffect back to filter blogs when data changes
  useEffect(() => {
    filterBlogs();
  }, [blogs, selectedCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.blog.getAll();
      setBlogs(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching blogs:', error);
      apiHelpers.handleError(error);
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
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);

    // Update URL search params
    if (newCategory === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCategory);
    }
    setSearchParams(searchParams);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 300) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const decodeHtmlEntities = (text) => {
    if (!text) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Travel': 'primary',
      'RV Technology': 'secondary',
      'Software': 'success',
      'General': 'default'
    };
    return colors[category] || 'default';
  };

  const toggleExpanded = (blogId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(blogId)) {
      newExpanded.delete(blogId);
    } else {
      newExpanded.add(blogId);
    }
    setExpandedPosts(newExpanded);
  };

  const formatBlogContent = (content) => {
    // If content contains HTML tags, render as HTML
    if (content.includes('<')) {
      return (
        <Box
          dangerouslySetInnerHTML={{ __html: content }}
          sx={{
            '& h1, & h2, & h3': { mt: 2, mb: 1, fontWeight: 'bold' },
            '& p': { mb: 1 },
            '& blockquote': {
              borderLeft: '4px solid #ccc',
              paddingLeft: 2,
              margin: '16px 0',
              fontStyle: 'italic'
            },
            '& ul, & ol': { paddingLeft: 3, margin: '8px 0' },
            '& pre': {
              backgroundColor: 'grey.100',
              padding: 1.5,
              borderRadius: 1,
              overflow: 'auto',
              fontFamily: 'monospace'
            },
            '& a': { color: 'primary.main' },
            '& img': { maxWidth: '100%', height: 'auto' }
          }}
        />
      );
    }

    // Otherwise, split into paragraphs as before
    return content.split('\n\n').map((paragraph, index) => (
      <Typography key={index} variant="body1" component="div" gutterBottom>
        {paragraph}
      </Typography>
    ));
  };

  const fetchComments = async (blogId) => {
    setLoadingComments(prev => ({ ...prev, [blogId]: true }));
    try {
      const response = await api.comments.getByBlogId(blogId);
      setComments(prev => ({ ...prev, [blogId]: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      apiHelpers.handleError(error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [blogId]: false }));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentForm.commenter_name || !commentForm.commenter_email || !commentForm.comment_body) {
      return;
    }

    try {
      await api.comments.create(currentBlogId, commentForm);
      setCommentForm({
        commenter_name: user?.name || '',
        commenter_email: user?.email || '',
        comment_body: ''
      });
      setCommentDialogOpen(false);

      // Refresh comments for this blog
      fetchComments(currentBlogId);
    } catch (error) {
      console.error('Error submitting comment:', error);
      apiHelpers.handleError(error);
    }
  };

  const openCommentDialog = (blogId) => {
    setCurrentBlogId(blogId);
    setCommentDialogOpen(true);
  };

  const toggleComments = (blogId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(blogId)) {
      newExpanded.delete(blogId);
    } else {
      newExpanded.add(blogId);
      // Fetch comments if not already loaded
      if (!comments[blogId]) {
        fetchComments(blogId);
      }
    }
    setExpandedComments(newExpanded);
  };

  const canEditComment = (comment) => {
    if (!isAuthenticated || !user) return false;

    // Admin can edit any comment
    if (hasAnyRole(['Admin'])) return true;

    // Comment owner can edit their own comment
    return user.name === comment.commenter_name || user.email === comment.commenter_email;
  };

  const canDeleteComment = (comment) => {
    if (!isAuthenticated || !user) return false;

    // Admin can delete any comment
    if (hasAnyRole(['Admin'])) return true;

    // Comment owner can delete their own comment
    return user.name === comment.commenter_name || user.email === comment.commenter_email;
  };

  const startEditingComment = (commentId, currentText) => {
    setEditingComments(prev => new Set([...prev, commentId]));
    setEditCommentTexts(prev => ({ ...prev, [commentId]: currentText }));
  };

  const cancelEditingComment = (commentId) => {
    setEditingComments(prev => {
      const newSet = new Set(prev);
      newSet.delete(commentId);
      return newSet;
    });
    setEditCommentTexts(prev => {
      const newTexts = { ...prev };
      delete newTexts[commentId];
      return newTexts;
    });
  };

  const saveCommentEdit = async (commentId, blogId) => {
    const newText = editCommentTexts[commentId];
    if (!newText || newText.trim() === '') return;

    try {
      await api.comments.update(blogId, commentId, { comment_body: newText.trim() });
    } catch (error) {
      console.error('Error updating comment:', error);
      apiHelpers.handleError(error);
    }

    // Update the comment in state
    setComments(prev => ({
      ...prev,
      [blogId]: prev[blogId].map(comment =>
        comment.id === commentId
          ? { ...comment, comment_body: newText.trim() }
          : comment
      )
    }));

    // Exit edit mode
    cancelEditingComment(commentId);
  };

  const deleteComment = async (commentId, blogId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await api.comments.delete(blogId, commentId);

      // Remove the comment from state
      setComments(prev => ({
        ...prev,
        [blogId]: prev[blogId].filter(comment => comment.id !== commentId)
      }));

      console.log('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      apiHelpers.handleError(error);
    }
  };

  if (loading) {
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
            <Article sx={{ mr: 2, fontSize: '2rem' }} />
            Ed's Blog
          </Typography>
          <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
            Stories, tips, and adventures from the road
          </Typography>
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
            <Typography variant="h6" sx={{ mr: 2 }}>Filter by Category:</Typography>
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
              {filteredBlogs.length} posts found
            </Typography>
          </Box>
        </Paper>

        {/* Blog Posts */}
        {filteredBlogs.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Article sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No blog posts found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedCategory === 'All'
                ? 'No blog posts are available at the moment.'
                : `No posts found in the "${selectedCategory}" category.`}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredBlogs.map((blog) => {
              const isExpanded = expandedPosts.has(blog.id);
              const shouldShowReadMore = blog.blog_body.length > 300;

              return (
                <Grid size={12} key={blog.id}>
                  <Card
                    elevation={2}
                    sx={{
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      {/* Header with category and date */}
                      <Grid container spacing={1} alignItems="center" sx={{ mb: 2, width: '100%' }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Chip
                            icon={<CategoryIcon />}
                            label={blog.blog_category}
                            color={getCategoryColor(blog.blog_category)}
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: { xs: 'left', md: 'center' }, alignItems: 'center', gap: 1 }}>
                            <a
                              href={`/blog/${blog.id}`}
                              style={{
                                color: '#1976d2', // MUI primary blue
                                textDecoration: 'underline',
                                fontWeight: 500,
                                cursor: 'pointer'
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open Link
                            </a>
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/blog/${blog.id}`);
                              }}
                              sx={{ ml: 0.5 }}
                              title="Copy link"
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: { xs: 'left', md: 'flex-end' }, alignItems: 'center' }}>
                            <DateRange fontSize="small" color="disabled" />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(blog.createdAt)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>


                      {/* Title */}
                      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        {decodeHtmlEntities(blog.blog_subject)}
                      </Typography>

                      {/* Author info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {blog.blog_owner_name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {blog.blog_owner_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Author
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Content */}
                      <Box sx={{ mb: 2 }}>
                        {isExpanded ? (
                          formatBlogContent(blog.blog_body)
                        ) : (
                          <Typography variant="body1" component="div">
                            {formatBlogContent(truncateText(blog.blog_body))}
                          </Typography>
                        )}
                      </Box>

                      {/* Read More/Less Button */}
                      {shouldShowReadMore && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Button
                            onClick={() => toggleExpanded(blog.id)}
                            startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                            sx={{ textTransform: 'none' }}
                          >
                            {isExpanded ? 'Read Less' : 'Read More'}
                          </Button>
                        </Box>
                      )}

                      {/* Stats */}
                      <Box sx={{ display: 'flex', gap: 3, mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary">
                          {blog.blog_body.length} characters
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {blog.blog_body.split(' ').filter(word => word.length > 0).length} words
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ~{Math.ceil(blog.blog_body.split(' ').filter(word => word.length > 0).length / 200)} min read
                        </Typography>
                      </Box>

                      {/* Comments Section */}
                      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Button
                            onClick={() => toggleComments(blog.id)}
                            startIcon={<CommentIcon />}
                            endIcon={expandedComments.has(blog.id) ? <ExpandLess /> : <ExpandMore />}
                            sx={{ textTransform: 'none' }}
                          >
                            {expandedComments.has(blog.id) ? 'Hide Comments' : 'Show Comments'}
                            {comments[blog.id] && ` (${comments[blog.id].length})`}
                          </Button>

                          {isAuthenticated && hasAnyRole(['Admin', 'Creator', 'Commentor']) ? (
                            <Button
                              onClick={() => openCommentDialog(blog.id)}
                              variant="outlined"
                              size="small"
                              startIcon={<Send />}
                              sx={{ textTransform: 'none' }}
                            >
                              Add Comment
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              {isAuthenticated
                                ? 'Commentor role required to post comments'
                                : 'Log in to comment'
                              }
                            </Typography>
                          )}
                        </Box>

                        <Collapse in={expandedComments.has(blog.id)}>
                          {loadingComments[blog.id] ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                              <CircularProgress size={24} />
                            </Box>
                          ) : comments[blog.id] && comments[blog.id].length > 0 ? (
                            <List sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1 }}>
                              {comments[blog.id].map((comment) => {
                                const isEditing = editingComments.has(comment.id);
                                const canEdit = canEditComment(comment);
                                const canDelete = canDeleteComment(comment);

                                return (
                                  <ListItem key={comment.id} alignItems="flex-start">
                                    <ListItemAvatar>
                                      <Avatar sx={{ width: 32, height: 32 }}>
                                        <Person />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            {comment.commenter_name}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {formatDate(comment.createdAt)}
                                          </Typography>
                                          {(canEdit || canDelete) && (
                                            <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                                              {canEdit && (
                                                isEditing ? (
                                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <IconButton
                                                      size="small"
                                                      onClick={() => saveCommentEdit(comment.id, blog.id)}
                                                      disabled={!editCommentTexts[comment.id]?.trim()}
                                                    >
                                                      <Save fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                      size="small"
                                                      onClick={() => cancelEditingComment(comment.id)}
                                                    >
                                                      <Cancel fontSize="small" />
                                                    </IconButton>
                                                  </Box>
                                                ) : (
                                                  <IconButton
                                                    size="small"
                                                    onClick={() => startEditingComment(comment.id, comment.comment_body)}
                                                  >
                                                    <Edit fontSize="small" />
                                                  </IconButton>
                                                )
                                              )}
                                              {canDelete && !isEditing && (
                                                <IconButton
                                                  size="small"
                                                  onClick={() => deleteComment(comment.id, blog.id)}
                                                  sx={{ color: 'error.main' }}
                                                >
                                                  <Delete fontSize="small" />
                                                </IconButton>
                                              )}
                                            </Box>
                                          )}
                                        </Box>
                                      }
                                      secondary={
                                        isEditing ? (
                                          <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            value={editCommentTexts[comment.id] || ''}
                                            onChange={(e) => setEditCommentTexts(prev => ({
                                              ...prev,
                                              [comment.id]: e.target.value
                                            }))}
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            inputProps={{ maxLength: 1000 }}
                                            helperText={`${(editCommentTexts[comment.id] || '').length}/1000 characters`}
                                          />
                                        ) : (
                                          <Typography variant="body2" component="div">
                                            {comment.comment_body}
                                          </Typography>
                                        )
                                      }
                                    />
                                  </ListItem>
                                );
                              })}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                              No comments yet. Be the first to comment!
                            </Typography>
                          )}
                        </Collapse>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Comment Dialog */}
        <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add a Comment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Your Name"
              value={commentForm.commenter_name}
              onChange={(e) => setCommentForm(prev => ({ ...prev, commenter_name: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Your Email"
              type="email"
              value={commentForm.commenter_email}
              onChange={(e) => setCommentForm(prev => ({ ...prev, commenter_email: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Your Comment"
              multiline
              rows={4}
              value={commentForm.comment_body}
              onChange={(e) => setCommentForm(prev => ({ ...prev, comment_body: e.target.value }))}
              margin="normal"
              required
              inputProps={{ maxLength: 1000 }}
              helperText={`${commentForm.comment_body.length}/1000 characters`}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCommentSubmit}
              variant="contained"
              disabled={!commentForm.commenter_name || !commentForm.commenter_email || !commentForm.comment_body}
              startIcon={<Send />}
            >
              Post Comment
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageLayout>
  );
}