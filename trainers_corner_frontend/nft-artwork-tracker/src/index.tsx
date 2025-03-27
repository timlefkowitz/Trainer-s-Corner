import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
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

const container = document.getElementById('root');
root.render(
    <GoogleOAuthProvider clientId="582169319592-oo3oa5155hb53k24vq9tfb12d4lhbbo9.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
);