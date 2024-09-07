import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { backend } from 'declarations/backend';

interface DocumentProps {
  id: number;
  fileName: string;
  fileType: string;
  position: [number, number];
  size: [number, number];
  onUpdatePosition: (id: number, position: [number, number]) => void;
  onUpdateSize: (id: number, size: [number, number]) => void;
  onDelete: (id: number) => void;
}

const Document: React.FC<DocumentProps> = ({ id, fileName, fileType, position, size, onUpdatePosition, onUpdateSize, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentSize, setCurrentSize] = useState(size);
  const [content, setContent] = useState<ArrayBuffer | null>(null);

  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const fetchedContent = await backend.getDocumentContent(id);
        if (fetchedContent) {
          setContent(fetchedContent);
        }
      } catch (error) {
        console.error('Error fetching document content:', error);
      }
    };
    fetchContent();
  }, [id]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && docRef.current) {
        const newX = e.clientX - docRef.current.offsetWidth / 2;
        const newY = e.clientY - 20;
        setCurrentPosition([newX, newY]);
      } else if (isResizing && docRef.current) {
        const newWidth = e.clientX - docRef.current.offsetLeft;
        const newHeight = e.clientY - docRef.current.offsetTop;
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

  const startDragging = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const renderContent = () => {
    if (!content) return null;

    if (fileType.startsWith('image/')) {
      const blob = new Blob([content], { type: fileType });
      const url = URL.createObjectURL(blob);
      return <img src={url} alt={fileName} style={{ maxWidth: '100%', maxHeight: '100%' }} />;
    }

    if (fileType === 'application/pdf') {
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      return <iframe src={url} width="100%" height="100%" />
    }

    return <Typography>Unsupported file type</Typography>;
  };

  return (
    <Paper
      ref={docRef}
      elevation={3}
      sx={{
        position: 'absolute',
        left: `${currentPosition[0]}px`,
        top: `${currentPosition[1]}px`,
        width: `${currentSize[0]}px`,
        height: `${currentSize[1]}px`,
        overflow: 'hidden',
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
        <Typography variant="subtitle1">{fileName}</Typography>
        <IconButton size="small" onClick={() => onDelete(id)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
        {renderContent()}
      </Box>
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

export default Document;
