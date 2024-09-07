import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { backend } from 'declarations/backend';
import Tab from './components/Tab';
import Document from './components/Document';
import FileUpload from './components/FileUpload';

interface TabData {
  id: number;
  tabType: string;
  content: string;
  timestamp: bigint;
  position: [number, number];
  size: [number, number];
  attachedTo: number | null;
}

interface DocumentData {
  id: number;
  fileName: string;
  fileType: string;
  position: [number, number];
  size: [number, number];
}

const App: React.FC = () => {
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTabs();
    fetchDocuments();
  }, []);

  const fetchTabs = async () => {
    try {
      const fetchedTabs = await backend.getTabs();
      setTabs(fetchedTabs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tabs:', error);
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const fetchedDocs = await backend.getDocuments();
      setDocuments(fetchedDocs.map(doc => ({
        id: doc[0],
        fileName: doc[1],
        fileType: doc[2],
        position: doc[3],
        size: doc[4]
      })));
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const createTab = async (tabType: string, attachedTo: number | null = null) => {
    try {
      const newTabId = await backend.createTab(tabType, "", [0, 0], [300, 200], attachedTo);
      const newTab: TabData = { 
        id: Number(newTabId), 
        tabType, 
        content: "", 
        timestamp: BigInt(Date.now()),
        position: [0, 0],
        size: [300, 200],
        attachedTo
      };
      setTabs([...tabs, newTab]);
    } catch (error) {
      console.error('Error creating tab:', error);
    }
  };

  const updateTabContent = async (id: number, content: string) => {
    try {
      await backend.updateTabContent(id, content);
      setTabs(tabs.map(tab => tab.id === id ? { ...tab, content } : tab));
    } catch (error) {
      console.error('Error updating tab content:', error);
    }
  };

  const updateTabPosition = async (id: number, position: [number, number]) => {
    try {
      await backend.updateTabPosition(id, position);
      setTabs(tabs.map(tab => tab.id === id ? { ...tab, position } : tab));
    } catch (error) {
      console.error('Error updating tab position:', error);
    }
  };

  const updateTabSize = async (id: number, size: [number, number]) => {
    try {
      await backend.updateTabSize(id, size);
      setTabs(tabs.map(tab => tab.id === id ? { ...tab, size } : tab));
    } catch (error) {
      console.error('Error updating tab size:', error);
    }
  };

  const deleteTab = async (id: number) => {
    try {
      await backend.deleteTab(id);
      setTabs(tabs.filter(tab => tab.id !== id));
    } catch (error) {
      console.error('Error deleting tab:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const content = reader.result as ArrayBuffer;
        const newDocId = await backend.uploadDocument(
          file.name,
          file.type,
          new Uint8Array(content),
          [0, 0],
          [300, 300]
        );
        const newDoc: DocumentData = {
          id: Number(newDocId),
          fileName: file.name,
          fileType: file.type,
          position: [0, 0],
          size: [300, 300]
        };
        setDocuments([...documents, newDoc]);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const updateDocumentPosition = async (id: number, position: [number, number]) => {
    try {
      await backend.updateDocumentPosition(id, position);
      setDocuments(documents.map(doc => doc.id === id ? { ...doc, position } : doc));
    } catch (error) {
      console.error('Error updating document position:', error);
    }
  };

  const updateDocumentSize = async (id: number, size: [number, number]) => {
    try {
      await backend.updateDocumentSize(id, size);
      setDocuments(documents.map(doc => doc.id === id ? { ...doc, size } : doc));
    } catch (error) {
      console.error('Error updating document size:', error);
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      await backend.deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => createTab('Note')}
          sx={{ marginRight: 1 }}
        >
          Add Note
        </Button>
        <FileUpload onUpload={handleFileUpload} />
      </Box>
      <Box sx={{ position: 'relative', width: '100%', height: 'calc(100% - 60px)', marginTop: '60px' }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            tabType={tab.tabType}
            content={tab.content}
            position={tab.position}
            size={tab.size}
            attachedTo={tab.attachedTo}
            onUpdate={updateTabContent}
            onUpdatePosition={updateTabPosition}
            onUpdateSize={updateTabSize}
            onDelete={deleteTab}
            onAttach={(docId) => createTab('Note', docId)}
          />
        ))}
        {documents.map((doc) => (
          <Document
            key={doc.id}
            id={doc.id}
            fileName={doc.fileName}
            fileType={doc.fileType}
            position={doc.position}
            size={doc.size}
            onUpdatePosition={updateDocumentPosition}
            onUpdateSize={updateDocumentSize}
            onDelete={deleteDocument}
          />
        ))}
      </Box>
    </Box>
  );
};

export default App;
