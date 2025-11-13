import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Home as HomeIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../../context/WizardContext';

export default function Header() {
  const navigate = useNavigate();
  const { state } = useWizard();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <AutoAwesomeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Factory - SDLC Wizard
        </Typography>

        {state.isConnected ? (
          <Chip
            label="Connected"
            color="success"
            size="small"
            sx={{ mr: 2 }}
          />
        ) : (
          <Chip
            label="Disconnected"
            color="error"
            size="small"
            sx={{ mr: 2 }}
          />
        )}

        <IconButton color="inherit" onClick={() => navigate('/')}>
          <HomeIcon />
        </IconButton>

        <IconButton color="inherit" onClick={() => navigate('/history')}>
          <HistoryIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}