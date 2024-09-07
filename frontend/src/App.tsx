import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { backend } from 'declarations/backend';
import Tab from './components/Tab';

interface TabData {
  id: number;
  tabType: string;
  content: string;
  timestamp: bigint;
  position: [number, number];
  size: [number, number];
}

const App: React.FC = () => {
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTabs();
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

  const createTab = async (tabType: string) => {
    try {
      const newTabId = await backend.createTab(tabType, "", [0, 0], [300, 200]);
      const newTab: TabData = { 
        id: Number(newTabId), 
        tabType, 
        content: "", 
        timestamp: BigInt(Date.now()),
        position: [0, 0],
        size: [300, 200]
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
          onClick={() => createTab('Document')}
          sx={{ marginRight: 1 }}
        >
          Add Document
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => createTab('Note')}
        >
          Add Note
        </Button>
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
            onUpdate={updateTabContent}
            onUpdatePosition={updateTabPosition}
            onUpdateSize={updateTabSize}
            onDelete={deleteTab}
          />
        ))}
      </Box>
    </Box>
  );
};

export default App;
