import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CssBaseline,
    TextField,
    Button,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import StoreIcon from '@mui/icons-material/Store';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { GoogleLogin } from '@react-oauth/google';
import '@fontsource/press-start-2p';
import './App.css';
import { ethers } from 'ethers';
import jwtDecode from 'jwt-decode';
import Home from './components/Home';
import Search from './components/Search';
import Marketplace from './components/Marketplace';
import Social from './components/Social';
import Portfolio from './components/Portfolio'; // Import the new component
import { Card, Set, User } from './types';
import Profile from './components/Profile';

const App = () => {
    const [activeTab, setActiveTab] = useState<string>('/');
    const navigate = useNavigate();

    const handleTabChange = (path: string) => {
        setActiveTab(path);
        navigate(path);
    };

    return (
        <>
            <CssBaseline />
            <Container
                maxWidth="sm"
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#02735E',
                    p: 0,
                }}
            >
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/social" element={<Social />} />
                        <Route path="/portfolio" element={<Portfolio />} /> {/* Use the imported component */}
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </Box>
                {/* Navigation bar unchanged */}
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: '#014040',
                        borderTop: '2px solid #03A678',
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        height: 60,
                        zIndex: 1100,
                    }}
                >
                    <Box onClick={() => handleTabChange('/')} sx={{ flex: 1, textAlign: 'center', color: activeTab === '/' ? '#F27405' : '#03A678', cursor: 'pointer', p: 1 }}>
                        <HomeIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>Home</Typography>
                    </Box>
                    <Box onClick={() => handleTabChange('/search')} sx={{ flex: 1, textAlign: 'center', color: activeTab === '/search' ? '#F27405' : '#03A678', cursor: 'pointer', p: 1 }}>
                        <SearchIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>Search</Typography>
                    </Box>
                    <Box onClick={() => handleTabChange('/marketplace')} sx={{ flex: 1, textAlign: 'center', color: activeTab === '/marketplace' ? '#F27405' : '#03A678', cursor: 'pointer', p: 1 }}>
                        <StoreIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>Market</Typography>
                    </Box>
                    <Box onClick={() => handleTabChange('/social')} sx={{ flex: 1, textAlign: 'center', color: activeTab === '/social' ? '#F27405' : '#03A678', cursor: 'pointer', p: 1 }}>
                        <GroupIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>Social</Typography>
                    </Box>
                    <Box onClick={() => handleTabChange('/portfolio')} sx={{ flex: 1, textAlign: 'center', color: activeTab === '/portfolio' ? '#F27405' : '#03A678', cursor: 'pointer', p: 1 }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>Portfolio</Typography>
                    </Box>
                    <Box onClick={() => handleTabChange('/profile')} sx={{ flex: 1, textAlign: 'center', color: activeTab === '/profile' ? '#F27405' : '#03A678', cursor: 'pointer', p: 1 }}>
                        <PersonIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>Profile</Typography>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

const WrappedApp = () => (
    <Router>
        <App />
    </Router>
);

export default WrappedApp;