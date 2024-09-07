import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Maximize';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface TabProps {
  id: number;
  tabType: string;
  content: string;
  position: [number, number];
  size: [number, number];
  attachedTo: number | null;
  onUpdate: (id: number, content: string) => void;
  onUpdatePosition: (id: number, position: [number, number]) => void;
  onUpdateSize: (id: number, size: [number, number]) => void;
  onDelete: (id: number) => void;
  onAttach: (docId: number) => void;
}

const Tab: React.FC<TabProps> = ({ id, tabType, content, position, size, attachedTo, onUpdate, onUpdatePosition, onUpdateSize, onDelete, onAttach }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [editorState, setEditorState] = useState(() => {
    if (content) {
      try {
        return EditorState.createWithContent(convertFromRaw(JSON.parse(content)));
      } catch {
        return EditorState.createWithContent(ContentState.createFromText(content));
      }
    }
    return EditorState.createEmpty();
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentSize, setCurrentSize] = useState(size);

  const tabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && tabRef.current) {
        const newX = e.clientX - tabRef.current.offsetWidth / 2;
        const newY = e.clientY - 20;
        setCurrentPosition([newX, newY]);
      } else if (isResizing && tabRef.current) {
        const newWidth = e.clientX - tabRef.current.offsetLeft;
        const newHeight = e.clientY - tabRef.current.offsetTop;
        setCurrentSize([newWidth, newHeight]);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdatePosition(id, currentPosition);
      }
      if (isResizing) {
        setIsResizing(false);
        onUpdateSize(id, currentSize);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, id, currentPosition, currentSize, onUpdatePosition, onUpdateSize]);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));
    onUpdate(id, rawContent);
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);
  const toggleMaximize = () => setIsMaximized(!isMaximized);

  const startDragging = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  return (
    <Paper
      ref={tabRef}
      elevation={3}
      sx={{
        position: 'absolute',
        left: `${currentPosition[0]}px`,
        top: `${currentPosition[1]}px`,
        width: isMaximized ? '100%' : `${currentSize[0]}px`,
        height: isMaximized ? '100%' : (isMinimized ? '40px' : `${currentSize[1]}px`),
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        resize: isResizing ? 'both' : 'none',
      }}
    >
      <Box
        onMouseDown={startDragging}
        sx={{
          padding: 1,
          backgroundColor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'move',
        }}
      >
        <Typography variant="subtitle1">{tabType}</Typography>
        <Box>
          {!attachedTo && (
            <IconButton size="small" onClick={() => onAttach(id)}>
              <AttachFileIcon />
            </IconButton>
          )}
          <IconButton size="small" onClick={toggleMinimize}>
            <MinimizeIcon />
          </IconButton>
          <IconButton size="small" onClick={toggleMaximize}>
            <MaximizeIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(id)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      {!isMinimized && (
        <Box sx={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
        </Box>
      )}
      <Box
        onMouseDown={startResizing}
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '10px',
          height: '10px',
          cursor: 'se-resize',
        }}
      />
    </Paper>
  );
};

export default Tab;
