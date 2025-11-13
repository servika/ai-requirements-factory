import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import { WizardProvider } from './context/WizardContext';
import Header from './components/Layout/Header';
import HomePage from './pages/HomePage';
import WizardPage from './pages/WizardPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WizardProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wizard" element={<WizardPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </Box>
        </Router>
      </WizardProvider>
    </ThemeProvider>
  );
}

export default App;