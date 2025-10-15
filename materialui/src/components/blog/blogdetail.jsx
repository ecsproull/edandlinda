import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comments state
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentForm, setCommentForm] = useState({
    commenter_name: '',
    commenter_email: '',
    comment_body: ''
  });
  const [commentError, setCommentError] = useState('');

  // Fetch blog post
  useEffect(() => {
    api.blog.getById(id).then(res => {
      setBlog(res.data);
      setLoading(false);
    });
  }, [id]);

  // Fetch comments
  useEffect(() => {
    setLoadingComments(true);
    api.comments.getByBlogId(id)
      .then(res => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setLoadingComments(false));
  }, [id]);

  // Handle comment form changes
  const handleFormChange = (e) => {
    setCommentForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Handle comment submit
  const handleCommentSubmit = async () => {
    if (!commentForm.commenter_name || !commentForm.commenter_email || !commentForm.comment_body) {
      setCommentError('All fields are required.');
      return;
    }
    setCommentError('');
    try {
      await api.comments.create(id, commentForm);
      setCommentForm({ commenter_name: '', commenter_email: '', comment_body: '' });
      setCommentDialogOpen(false);
      // Refresh comments
      setLoadingComments(true);
      const res = await api.comments.getByBlogId(id);
      setComments(res.data);
    } catch (error) {
      setCommentError('Failed to submit comment.');
    } finally {
      setLoadingComments(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!blog) return <Typography>Blog not found.</Typography>;

  return (
    <Paper sx={{ p: 4, height: '80vh', overflow: 'auto' }}>
      <Typography variant="h3">{blog.blog_subject}</Typography>
      <Typography variant="subtitle1">{blog.blog_owner_name}</Typography>
      <Box sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: blog.blog_body }} />

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h5" gutterBottom>Comments</Typography>
        {loadingComments ? (
          <CircularProgress size={24} />
        ) : (
          <List>
            {comments.length === 0 && (
              <ListItem>
                <ListItemText primary="No comments yet." />
              </ListItem>
            )}
            {comments.map((c) => (
              <ListItem key={c._id || c.id}>
                <ListItemText
                  primary={c.comment_body}
                  secondary={`${c.commenter_name} (${c.commenter_email})`}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setCommentDialogOpen(true)}
        >
          Add Comment
        </Button>
      </Box>

      <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)}>
        <DialogTitle>Add a Comment</DialogTitle>
        <DialogContent>
          {commentError && <Alert severity="error" sx={{ mb: 2 }}>{commentError}</Alert>}
          <TextField
            margin="dense"
            label="Name"
            name="commenter_name"
            fullWidth
            value={commentForm.commenter_name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="commenter_email"
            fullWidth
            value={commentForm.commenter_email}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Comment"
            name="comment_body"
            fullWidth
            multiline
            minRows={3}
            value={commentForm.comment_body}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCommentSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}