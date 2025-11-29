import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Download,
  DownloadForOffline,
  Visibility,
  Close,
  FolderOpen,
  Folder,
  Description,
  CheckBox,
  Archive,
  ExpandMore,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import { api } from '../api/api';
import { useAuth } from '../contexts/authentication';
import { useSEO } from '../components/seo/seohook';

export default function ManualsForm() {
  // State management
  const [structure, setStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYearMake, setSelectedYearMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [previewDialog, setPreviewDialog] = useState({ open: false, file: null });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { hasRole, hasAnyRole } = useAuth();

  // Load directory structure on component mount
  useEffect(() => {
    loadStructure();
  }, []);

  const loadStructure = async () => {
    try {
      setLoading(true);
      const response = await api.files.getStructure();
      setStructure(response.data.structure || []);
      setError('');
    } catch (err) {
      console.error('Error loading structure:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load directory structure';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load files when year/make and model are selected
  useEffect(() => {
    if (selectedYearMake && selectedModel) {
      loadFiles();
    } else {
      setFiles([]);
      setSelectedFiles([]);
    }
  }, [selectedYearMake, selectedModel]);

  useSEO({
    title: "Ed & Linda's RV Adventures",
    description: "Access to technical drawings for Fleetwood Discovery and Discovery LXE RVs",
    keywords: "Fleetwood Discovery, Fleetwood Discovery LXE, schematics, electrical diagrams, plumbing diagrams, technical resources, RV manuals, parts lists"
  });

  const loadFiles = async () => {
    try {
      setFilesLoading(true);
      const response = await api.files.getFiles(selectedYearMake, selectedModel);
      const filesWithId = response.data.map((file, index) => ({
        id: index,
        ...file,
        selected: false
      }));

      setFiles(filesWithId);
      setSelectedFiles([]);
      setError('');
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load files for selected model');
      setFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

  // Group files by directory
  const groupFilesByDirectory = (files) => {
    const groups = {
      directories: [],
      rootFiles: []
    };

    files.forEach(file => {
      if (file.type === 'directory') {
        const directoryFiles = files.filter(f =>
          f.type === 'file' && f.parentDirectory === file.name
        );

        groups.directories.push({
          ...file,
          files: directoryFiles
        });
      } else if (!file.parentDirectory) {
        groups.rootFiles.push(file);
      }
    });

    return groups;
  };

  const grouped = useMemo(() => groupFilesByDirectory(files), [files]);

  // Handle year/make selection
  const handleYearMakeChange = useCallback((event) => {
    const yearMake = event.target.value;
    setSelectedYearMake(yearMake);
    setSelectedModel('');
    setFiles([]);
    setSelectedFiles([]);
  }, []);

  // Handle model selection
  const handleModelChange = useCallback((event) => {
    setSelectedModel(event.target.value);
  }, []);

  // Get available models for selected year/make
  const getAvailableModels = () => {
    const yearMakeData = structure.find(item => item.yearMake === selectedYearMake);
    return yearMakeData ? yearMakeData.models : [];
  };

  // Handle file selection
  const handleFileSelectionChange = (newSelection) => {
    setSelectedFiles(newSelection);
  };

  // Handle file download
  const handleFileDownload = useCallback(async (file) => {
    try {
      const result = await api.files.downloadFile(selectedYearMake, selectedModel, file.name, file.parentDirectory);

      // Since all files are PDFs, we can simplify this
      const blob = new Blob([result.data], { type: 'application/pdf' });
      downloadBlob(blob, file.name);
      setError('');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError(`Failed to download PDF: ${file.name}`);
    }
  }, [selectedYearMake, selectedModel]);

  // Handle select all/none
  const handleSelectAll = useCallback(() => {
    const selectableFiles = files.filter(item => item.type === 'file');
    const selectedSelectableFiles = selectedFiles.filter(id => {
      const item = files.find(f => f.id === id);
      return item && item.type === 'file';
    });

    if (selectedSelectableFiles.length === selectableFiles.length) {
      setSelectedFiles([]); // Deselect all
    } else {
      setSelectedFiles(selectableFiles.map(file => file.id)); // Select all files
    }
  }, [files, selectedFiles]);

  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const closePreviewDialog = useCallback(() => {
    if (previewDialog.file?.blobUrl) {
      window.URL.revokeObjectURL(previewDialog.file.blobUrl);
    }
    setPreviewDialog({ open: false, file: null });
    setIsFullscreen(false);
  }, [previewDialog.file?.blobUrl]);

  // Download selected files
  const handleDownloadSelected = useCallback(async () => {
    const selectedFileItems = selectedFiles
      .map(id => files.find(file => file.id === id))
      .filter(file => file && file.type === 'file');

    if (selectedFileItems.length === 0) {
      setError('Please select at least one file to download');
      return;
    }

    try {
      setDownloadLoading(true);

      if (selectedFileItems.length === 1) {
        // Single file download
        await handleFileDownload(selectedFileItems[0]);
      } else {
        // Multiple files as ZIP - send encoded filenames
        const fileNames = selectedFileItems.map(file => {
          if (file.parentDirectory) {
            // Encode directory files as directory__filename
            return `${file.parentDirectory}__${file.name}`;
          }
          // Root files use just the filename
          return file.name;
        });

        const response = await api.files.downloadSelected(selectedYearMake, selectedModel, fileNames);
        const blob = new Blob([response.data], { type: 'application/zip' });
        downloadBlob(blob, `${selectedYearMake}_${selectedModel}_selected_pdfs.zip`);
      }
      setError('');
    } catch (err) {
      console.error('Error downloading files:', err);
      setError('Failed to download selected files');
    } finally {
      setDownloadLoading(false);
    }
  }, [selectedFiles, files, selectedYearMake, selectedModel, handleFileDownload]);

  // Download all files
  const handleDownloadAll = useCallback(async () => {
    // Add admin check
    if (!hasRole('Admin')) {
      setError('Insufficient permissions to download all files');
      return;
    }

    if (files.length === 0) {
      setError('No files available to download');
      return;
    }

    try {
      setDownloadLoading(true);
      // FIX: Add missing await and response handling
      const response = await api.files.downloadAll(selectedYearMake, selectedModel);
      const blob = new Blob([response.data], { type: 'application/zip' });
      downloadBlob(blob, `${selectedYearMake}_${selectedModel}_all_drawings.zip`);
      setError('');
    } catch (err) {
      console.error('Error downloading all files:', err);
      setError('Failed to download all files');
    } finally {
      setDownloadLoading(false);
    }
  }, [selectedYearMake, selectedModel, files.length, hasRole]);

  // Preview file (for PDFs)
  const handlePreview = async (file) => {
    if (file.extension === '.pdf') {
      try {
        console.log(file);
        const previewPath = file.parentDirectory ? `${file.parentDirectory}/${file.name}` : file.name;
        const response = await api.files.downloadFile(selectedYearMake, selectedModel, file.name, file.parentDirectory);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const blobUrl = window.URL.createObjectURL(blob);
        setPreviewDialog({
          open: true,
          file: {
            ...file,
            previewPath,
            blobUrl
          }
        });
      } catch (err) {
        console.error('Error loading preview:', err);
        setError('Failed to load PDF preview');
      }
    } else {
      setError('Preview is only available for PDF files');
    }
  };

  // Handle directory download
  const handleDirectoryDownload = async (dirName) => {
    /*if (!hasAnyRole(['Admin', 'Manuals'])) {
      setError('Insufficient permissions to download all files');
      return;
    }*/

    try {
      const response = await api.files.downloadDirectory(selectedYearMake, selectedModel, dirName);
      const blob = new Blob([response.data], { type: 'application/zip' });
      downloadBlob(blob, `${selectedYearMake}_${selectedModel}_${dirName}.zip`);
      setError('');
    } catch (err) {
      console.error('Error downloading directory:', err);
      setError(`Failed to download directory: ${dirName}`);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadBlob = (blob, customFileName = null) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = customFileName || `${selectedYearMake}_${selectedModel}_selected_drawings.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const manualsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Fleetwood Discovery Manuals & Technical Drawings",
    "description": "Free technical manuals and drawings for Fleetwood Discovery and Discovery LXE RVs",
    "url": "https://edandlinda.com/manuals",
    "mainEntity": {
      "@type": "Dataset",
      "name": "Fleetwood Discovery Technical Documentation",
      "description": "Electrical diagrams, plumbing schematics, and technical manuals",
      "keywords": "Fleetwood Discovery, RV manuals, technical drawings, schematics"
    }
  };

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(manualsSchema) }}
    />
    <Box sx={{
      maxWidth: { xs: '100vw', md: 1200 },
      mx: 'auto',
      p: { xs: 1, md: 3 },
      overflow: 'auto',
      maxHeight: { xs: '100vh', md: '85vh' },
      mb: 3,
      minHeight: { xs: 'auto', md: '600px' }
    }}
    >
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FolderOpen color="primary" />
          Discovery Drawings & Manuals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and download technical drawings and manuals for Fleetwood Discovery RV's
        </Typography>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Selection Form */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Year/Make and Model
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 2 }}>
          {/* Year/Make Selection */}
          <FormControl fullWidth>
            <InputLabel>Year/Make</InputLabel>
            <Select
              value={selectedYearMake}
              onChange={handleYearMakeChange}
              label="Year/Make"
            >
              {structure.map((item) => (
                <MenuItem key={item.yearMake} value={item.yearMake}>
                  {item.yearMake.replace(/_/g, ' ')} ({item.modelCount} models)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Model Selection */}
          <FormControl fullWidth disabled={!selectedYearMake}>
            <InputLabel>Model</InputLabel>
            <Select
              value={selectedModel}
              onChange={handleModelChange}
              label="Model"
            >
              {getAvailableModels().map((model) => (
                <MenuItem key={model} value={model}>
                  {model.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Selection Summary */}
        {selectedYearMake && selectedModel && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Selected: <strong>{selectedYearMake.replace(/_/g, ' ')} - {selectedModel.replace(/_/g, ' ')}</strong>
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Files Display */}
      {selectedYearMake && selectedModel && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Available Files & Folders ({files.length})
            </Typography>

            {files.length > 0 && (
              <Stack direction="row" spacing={2}>
                {(
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<CheckBox />}
                      onClick={handleSelectAll}
                      size="small"
                    >
                      Select All Files
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadForOffline />}
                      onClick={handleDownloadAll}
                      disabled={downloadLoading}
                    >
                      Download All
                    </Button>
                  </>
                )}
                {(<Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownloadSelected}
                  disabled={selectedFiles.filter(id => {
                    const item = files.find(f => f.id === id);
                    return item && item.type === 'file';
                  }).length === 0 || downloadLoading}
                >
                  Download Selected ({selectedFiles.filter(id => {
                    const item = files.find(f => f.id === id);
                    return item && item.type === 'file';
                  }).length})
                </Button>)}
              </Stack>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {filesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : files.length > 0 ? (
            <Box>
              {(() => {
                return (
                  <Box>
                    {/* Directory Accordions */}
                    {grouped.directories.map((directory) => (
                      <Accordion key={directory.id} defaultExpanded={false}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            sx={{
                              bgcolor: 'primary.50',
                              '&:hover': { bgcolor: 'primary.100' },
                              flex: 1 // Take up available space
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <Folder color="primary" />
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {directory.name.replace(/_/g, ' ')}
                              </Typography>
                              <Chip
                                label={`${directory.fileCount} files`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={formatFileSize(directory.size)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </AccordionSummary>

                          {/* Move IconButton OUTSIDE AccordionSummary */}
                          {hasAnyRole(['Admin', 'Manuals']) && (
                            <Box sx={{ pr: 2 }}>
                              <Tooltip title="Download all files in this folder">
                                <IconButton
                                  onClick={() => handleDirectoryDownload(directory.name)}
                                  disabled={!directory.isDownloadable}
                                  color="primary"
                                  size="small"
                                >
                                  <Archive />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>


                        <AccordionDetails sx={{ p: 0 }}>
                          <List dense>
                            {directory.files.map((file) => (
                              <ListItem
                                key={file.id}
                                sx={{
                                  borderBottom: '1px solid #f0f0f0',
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                              >
                                <ListItemIcon>
                                  {hasAnyRole(['Admin', 'Manuals']) && (<Checkbox
                                    checked={selectedFiles.includes(file.id)}
                                    onChange={(event) => {
                                      const newSelection = event.target.checked
                                        ? [...selectedFiles, file.id]
                                        : selectedFiles.filter(id => id !== file.id);
                                      handleFileSelectionChange(newSelection);
                                    }}
                                  />)}
                                </ListItemIcon>
                                <ListItemIcon>
                                  <Description color="action" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={file.name}
                                  secondary={formatFileSize(file.size)}
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Tooltip title="Download file">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleFileDownload(file)}
                                    >
                                      <Download />
                                    </IconButton>
                                  </Tooltip>
                                  {file.extension === '.pdf' && (
                                    <Tooltip title="Preview PDF">
                                      <IconButton
                                        size="small"
                                        onClick={() => handlePreview(file)}
                                      >
                                        <Visibility />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    ))}

                    {/* Root Files */}
                    {grouped.rootFiles.length > 0 && (
                      <Accordion defaultExpanded={false}>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          sx={{ bgcolor: 'grey.50' }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Description color="primary" />
                            <Typography variant="h6">
                              Root Files ({grouped.rootFiles.length})
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          <List dense>
                            {grouped.rootFiles.map((file) => (
                              <ListItem
                                key={file.id}
                                sx={{
                                  borderBottom: '1px solid #f0f0f0',
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                              >
                                <ListItemIcon>
                                  <Checkbox
                                    checked={selectedFiles.includes(file.id)}
                                    onChange={(event) => {
                                      const newSelection = event.target.checked
                                        ? [...selectedFiles, file.id]
                                        : selectedFiles.filter(id => id !== file.id);
                                      handleFileSelectionChange(newSelection);
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemIcon>
                                  <Description color="action" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={file.name}
                                  secondary={formatFileSize(file.size)}
                                />
                                <ListItemSecondaryAction>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Download file">
                                      <IconButton
                                        size="small"
                                        onClick={() => handleFileDownload(file)}
                                      >
                                        <Download />
                                      </IconButton>
                                    </Tooltip>
                                    {file.extension === '.pdf' && (
                                      <Tooltip title="Preview PDF">
                                        <IconButton
                                          size="small"
                                          onClick={() => handlePreview(file)}
                                        >
                                          <Visibility />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Box>
                );
              })()}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No files found for the selected model
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* PDF Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={closePreviewDialog}
        maxWidth={isFullscreen ? false : "xl"} // Changed from "lg" to "xl" for larger size
        fullWidth
        fullScreen={isFullscreen}
        sx={{
          '& .MuiDialog-paper': {
            height: isFullscreen ? '100vh' : '95vh', // Increased from 80vh to 95vh
            maxHeight: isFullscreen ? '100vh' : '95vh',
            width: isFullscreen ? '100vw' : '95vw', // Use more of the viewport width
            margin: isFullscreen ? 0 : 'auto'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: isFullscreen ? 1 : 1.5, // Reduced padding
          px: isFullscreen ? 1 : 2
        }}>
          <Typography variant="h6" component="span">
            Preview: {previewDialog.file?.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
              <IconButton onClick={handleFullscreenToggle}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
            <IconButton onClick={closePreviewDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{
          p: 0, // Remove all padding from content area
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden' // Prevent any scrollbars on the content
        }}>
          {previewDialog.file?.blobUrl && (
            <iframe
              src={previewDialog.file.blobUrl}
              width="100%"
              height="100%"
              style={{
                border: 'none',
                flexGrow: 1,
                display: 'block' // Ensure no inline spacing
              }}
              title="PDF Preview"
            />
          )}
        </DialogContent>
        <DialogActions sx={{
          py: isFullscreen ? 0.5 : 1, // Reduced padding
          px: isFullscreen ? 1 : 2,
          minHeight: 'auto' // Don't force minimum height
        }}>
          <Button onClick={closePreviewDialog} size="small">
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              handleFileDownload(previewDialog.file);
            }}
            size="small"
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}