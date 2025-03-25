import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import '@fontsource/dm-sans';
import App from './App'; // Adjust the import path if necessary

const theme = createTheme({
    typography: {
        fontFamily: '"DM Sans", sans-serif',
    },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
);