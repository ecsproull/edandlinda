import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  ButtonGroup,
  Button,
  Typography,
  Divider,
  Stack
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Link,
  Image,
  Undo,
  Redo,
  Html,
  Wysiwyg
} from '@mui/icons-material';

//import WysiwygIcon from '@mui/icons-material/Wysiwyg';
//import HtmlIcon from '@mui/icons-material/Html';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [placeholder, setPlaceholder] = useState('Start typing...');
  const [showHtml, setShowHtml] = useState(false); // Add this state
  const lastValueRef = useRef(value); // Track the last external value

  // Simple history management
  const [history, setHistory] = useState([value || '']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Only update editor content if it's truly an external change
  useEffect(() => {
    if (!isInternalUpdate &&
      editorRef.current &&
      value !== editorRef.current.innerHTML &&
      value !== lastValueRef.current) {

      // Save current cursor position
      const selection = window.getSelection();
      let range = null;
      let cursorOffset = 0;

      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        cursorOffset = range.startOffset;
      }

      // Update content
      editorRef.current.innerHTML = value || '';
      lastValueRef.current = value;

      // Restore cursor position if possible
      if (range && editorRef.current.firstChild) {
        try {
          const newRange = document.createRange();
          const textNode = editorRef.current.firstChild;
          const maxOffset = textNode.textContent ? textNode.textContent.length : 0;

          newRange.setStart(textNode, Math.min(cursorOffset, maxOffset));
          newRange.setEnd(textNode, Math.min(cursorOffset, maxOffset));

          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch (e) {
          // Fallback: focus at end
          editorRef.current.focus();
        }
      }

      setHistory([value || '']);
      setHistoryIndex(0);
    }
  }, [value, isInternalUpdate]);

  // Sync editor DOM when switching from HTML to WYSIWYG
  useEffect(() => {
    if (!showHtml && editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [showHtml, value]);

  const executeCommand = useCallback((command, commandValue = null) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand(command, false, commandValue);

    // Get updated content and notify parent
    const content = editorRef.current.innerHTML;
    lastValueRef.current = content;
    setIsInternalUpdate(true);
    onChange(content);
    addToHistory(content);

    // Reset internal update flag
    setTimeout(() => setIsInternalUpdate(false), 0);
  }, [onChange]);

  const addToHistory = useCallback((content) => {
    // Don't add duplicate entries
    if (content === history[historyIndex]) return;

    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), content];
      return newHistory.slice(-50); // Keep last 50 entries
    });
    setHistoryIndex(prev => prev + 1);
  }, [history, historyIndex]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      lastValueRef.current = content;
      setIsInternalUpdate(true);
      onChange(content);
      // Reset internal update flag
      setTimeout(() => setIsInternalUpdate(false), 0);
    }
  }, [onChange]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);

      // Update editor content directly
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        editorRef.current.focus();
      }

      lastValueRef.current = content;
      setIsInternalUpdate(true);
      onChange(content);
      setTimeout(() => setIsInternalUpdate(false), 0);
    }
  }, [historyIndex, history, onChange]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);

      // Update editor content directly
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        editorRef.current.focus();
      }

      lastValueRef.current = content;
      setIsInternalUpdate(true);
      onChange(content);
      setTimeout(() => setIsInternalUpdate(false), 0);
    }
  }, [historyIndex, history, onChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
        default:
          break;
      }
    }
  }, [executeCommand, handleUndo, handleRedo]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  }, [executeCommand]);

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  }, [executeCommand]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Handler for HTML textarea changes
  const handleHtmlChange = (e) => {
    const html = e.target.value;
    lastValueRef.current = html;
    setIsInternalUpdate(true);
    onChange(html);
    setTimeout(() => setIsInternalUpdate(false), 0);
  };

  return (
    <Paper elevation={1} sx={{ border: 1, borderColor: 'divider', position: 'relative' }}>
      {/* Toolbar */}
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', backgroundColor: 'grey.50' }}>
        <Stack direction="column" spacing={1}>
          {/* First row */}
          <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <ButtonGroup size="small" sx={{ mb: 1 }}>
              <Button
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Undo />
              </Button>
              <Button
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Redo />
              </Button>
            </ButtonGroup>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, display: 'inline-block' }} />
            <ButtonGroup size="small" sx={{ mb: 1, ml: 1 }}>
              <Button
                onClick={() => executeCommand('bold')}
                title="Bold (Ctrl+B)"
                onMouseDown={(e) => e.preventDefault()}
              >
                <FormatBold />
              </Button>
              <Button
                onClick={() => executeCommand('italic')}
                title="Italic (Ctrl+I)"
                onMouseDown={(e) => e.preventDefault()}
              >
                <FormatItalic />
              </Button>
              <Button
                onClick={() => executeCommand('underline')}
                title="Underline (Ctrl+U)"
                onMouseDown={(e) => e.preventDefault()}
              >
                <FormatUnderlined />
              </Button>
            </ButtonGroup>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, display: 'inline-block' }} />
            <ButtonGroup size="small" sx={{ mb: 1, ml: 1 }}>
              <Button
                onClick={() => executeCommand('insertUnorderedList')}
                title="Bullet List"
                onMouseDown={(e) => e.preventDefault()}
              >
                <FormatListBulleted />
              </Button>
              <Button
                onClick={() => executeCommand('insertOrderedList')}
                title="Numbered List"
                onMouseDown={(e) => e.preventDefault()}
              >
                <FormatListNumbered />
              </Button>
              <Button
                onClick={() => executeCommand('formatBlock', 'blockquote')}
                title="Quote"
                onMouseDown={(e) => e.preventDefault()}
              >
                <FormatQuote />
              </Button>
            </ButtonGroup>
          </Box>
          {/* Second row */}
          <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <ButtonGroup size="small" sx={{ mb: 1, ml: 1 }}>
              <Button
                onClick={insertLink}
                title="Insert Link"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Link />
              </Button>
              <Button
                onClick={insertImage}
                title="Insert Image"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image />
              </Button>
              <Button
                onClick={() => executeCommand('formatBlock', 'pre')}
                title="Code Block"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Code />
              </Button>
            </ButtonGroup>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, display: 'inline-block' }} />
            <ButtonGroup size="small" sx={{ mb: 1, ml: 1 }}>
              <Button
                onClick={() => executeCommand('formatBlock', 'h1')}
                title="Heading 1"
                onMouseDown={(e) => e.preventDefault()}
              >
                H1
              </Button>
              <Button
                onClick={() => executeCommand('formatBlock', 'h2')}
                title="Heading 2"
                onMouseDown={(e) => e.preventDefault()}
              >
                H2
              </Button>
              <Button
                onClick={() => executeCommand('formatBlock', 'h3')}
                title="Heading 3"
                onMouseDown={(e) => e.preventDefault()}
              >
                H3
              </Button>
              <Button
                onClick={() => executeCommand('formatBlock', 'p')}
                title="Paragraph"
                onMouseDown={(e) => e.preventDefault()}
              >
                P
              </Button>
              <Button
                variant={showHtml ? "contained" : "outlined"}
                size="small"
                onClick={() => setShowHtml(v => !v)}
              >
                {showHtml ? <Wysiwyg /> : <Html />}
              </Button>
            </ButtonGroup>
          </Box>
        </Stack>
      </Box>

        {/* Editor or HTML textarea */}
        {showHtml ? (
          <Box sx={{ p: 2 }}>
            <textarea
              value={value}
              onChange={handleHtmlChange}
              style={{
                width: '100%',
                minHeight: '300px',
                fontFamily: 'monospace',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                resize: 'vertical'
              }}
            />
          </Box>
        ) : (
          <>
            {/* WYSIWYG Editor */}
            <Box
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsEditorFocused(true)}
              onBlur={() => setIsEditorFocused(false)}
              suppressContentEditableWarning={true}
              sx={{
                minHeight: '300px',
                p: 2,
                outline: 'none',
                '&:focus': {
                  backgroundColor: 'grey.50'
                },
                '& h1, & h2, & h3': {
                  margin: '16px 0 8px 0',
                  fontWeight: 'bold'
                },
                '& p': {
                  margin: '8px 0'
                },
                '& blockquote': {
                  borderLeft: '4px solid #ccc',
                  paddingLeft: '16px',
                  margin: '16px 0',
                  fontStyle: 'italic'
                },
                '& ul, & ol': {
                  paddingLeft: '24px',
                  margin: '8px 0'
                },
                '& pre': {
                  backgroundColor: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontFamily: 'monospace'
                },
                '& a': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto'
                },
                '& strong, & b': {
                  fontWeight: 'bold'
                },
                '& em, & i': {
                  fontStyle: 'italic'
                },
                '& u': {
                  textDecoration: 'underline'
                }
              }}
            />
            {/* Placeholder */}
            {!editorRef.current?.innerHTML && !isEditorFocused && (
              <Typography
                variant="body1"
                sx={{
                  position: 'absolute',
                  top: '60px',
                  left: '16px',
                  color: 'text.secondary',
                  pointerEvents: 'none'
                }}
              >
                {placeholder}
              </Typography>
            )}
          </>
        )}

        {/* Keyboard Shortcuts Help */}
        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', backgroundColor: 'grey.50' }}>
          <Typography variant="caption" color="text.secondary">
            Keyboard shortcuts: <strong>Ctrl+Z</strong> Undo, <strong>Ctrl+Y</strong> Redo,
            <strong>Ctrl+B</strong> Bold, <strong>Ctrl+I</strong> Italic, <strong>Ctrl+U</strong> Underline
          </Typography>
        </Box>
    </Paper>
  );
}