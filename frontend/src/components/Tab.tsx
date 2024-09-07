import React, { useState } from 'react';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Maximize';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface TabProps {
  id: number;
  tabType: string;
  content: string;
  onUpdate: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}

const Tab: React.FC<TabProps> = ({ id, tabType, content, onUpdate, onDelete }) => {
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

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));
    onUpdate(id, rawContent);
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);
  const toggleMaximize = () => setIsMaximized(!isMaximized);

  return (
    <Paper
      elevation={3}
      sx={{
        width: isMaximized ? '100%' : 300,
        height: isMaximized ? '100%' : (isMinimized ? 40 : 200),
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        margin: 1,
      }}
    >
      <Box
        sx={{
          padding: 1,
          backgroundColor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1">{tabType}</Typography>
        <Box>
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
    </Paper>
  );
};

export default Tab;
