import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Delete,
  Person,
  AdminPanelSettings,
  Create,
  Comment,
  PersonAdd,
  Refresh,
  Book
} from '@mui/icons-material';
import { USER_ROLES } from '../consts/consts';
import { api } from '../api/api';

const getRoleIcon = (role) => {
  switch (role) {
    case 'User': return <Person fontSize="small" />;
    case 'Commentor': return <Comment fontSize="small" />;
    case 'Creator': return <Create fontSize="small" />;
    case 'Admin': return <AdminPanelSettings fontSize="small" />;
    case 'Manuals': return <Book fontSize="small" />;
    default: return <Person fontSize="small" />;
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case 'User': return 'default';
    case 'Commentor': return 'info';
    case 'Creator': return 'success';
    case 'Admin': return 'error';
    case 'Manuals': return 'warning';
    default: return 'default';
  }
};

function EditUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.users.getAll();
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      user_name: user.user_name,
      user_email: user.user_email,
      user_role: user.user_role || "",
      user_approved: user.user_approved || false
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (userId) => {
    try {
      const response = await api.users.update(userId, editForm);

      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, ...response.data.user } : user
      ));
      setEditingUser(null);
      setEditForm({});
      setSuccess('User updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const confirmDelete = async () => {
    try {
      await api.users.delete(deleteDialog.user.id);
      setUsers(prev => prev.filter(user => user.id !== deleteDialog.user.id));
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete user');
    } finally {
      setDeleteDialog({ open: false, user: null });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            <PersonAdd sx={{ mr: 2, fontSize: '2rem' }} />
            User Management
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Approved</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    {editingUser === user.id ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editForm.user_name}
                        onChange={(e) => handleFormChange('user_name', e.target.value)}
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {user.user_name}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingUser === user.id ? (
                      <TextField
                        fullWidth
                        size="small"
                        type="email"
                        value={editForm.user_email}
                        onChange={(e) => handleFormChange('user_email', e.target.value)}
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {user.user_email}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingUser === user.id ? (
                      <FormControl fullWidth size="small">
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={editForm.user_role}
                          onChange={(e) => handleFormChange('user_role', e.target.value)}
                          label="Role"
                        >
                          {Object.entries(USER_ROLES).map(([key, roleObj]) => (
                            <MenuItem key={key} value={roleObj.name}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getRoleIcon(roleObj.name)}
                                {roleObj.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip
                        icon={getRoleIcon(user.user_role)}
                        label={user.user_role}
                        color={getRoleColor(user.user_role)}
                        size="small"
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    {editingUser === user.id ? (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editForm.user_approved}
                            onChange={(e) => handleFormChange('user_approved', e.target.checked)}
                          />
                        }
                        label="Approved"
                      />
                    ) : (
                      <Chip
                        label={user.user_approved ? 'Approved' : 'Pending'}
                        color={user.user_approved ? 'success' : 'warning'}
                        size="small"
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {editingUser === user.id ? (
                        <>
                          <Tooltip title="Save">
                            <IconButton
                              color="primary"
                              onClick={() => handleSave(user.id)}
                              size="small"
                            >
                              <Save />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton
                              color="secondary"
                              onClick={handleCancelEdit}
                              size="small"
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(user)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(user)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {users.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PersonAdd sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No users found
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{deleteDialog.user?.user_name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditUsers;