import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CssBaseline,
    TextField,
    Button,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import StoreIcon from '@mui/icons-material/Store';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonIcon from '@mui/icons-material/Person';
import '@fontsource/press-start-2p';
import './App.css';
import { ethers } from 'ethers';

interface Card {
    id: number;
    name: string;
    rarity: string;
    price: number;
    set: string | null;
}

interface Set {
    name: string;
}

// Home Page
const Home: React.FC = () => (
    <Box sx={{ p: 2, textAlign: 'center', color: '#F27405' }}>
        <Typography
            variant="h4"
            sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
            TRAINERS CORNER
        </Typography>
        <Typography
            sx={{ mt: 2, fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#03A678' }}
        >
            Welcome! Explore cards and sets.
        </Typography>
    </Box>
);

// Search Page
const Search: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [results, setResults] = useState<{ cards: Card[]; sets: Set[] }>({ cards: [], sets: [] });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setResults({ cards: [], sets: [] });
            return;
        }
        setLoading(true);
        try {
            const [cardsResponse, setsResponse] = await Promise.all([
                fetch(`/api/cards?search=${encodeURIComponent(searchTerm)}`),
                fetch(`/api/sets?search=${encodeURIComponent(searchTerm)}`),
            ]);
            if (!cardsResponse.ok) throw new Error(`Cards fetch failed: ${cardsResponse.status}`);
            if (!setsResponse.ok) throw new Error(`Sets fetch failed: ${setsResponse.status}`);
            const cardsData = await cardsResponse.json();
            const setsData = await setsResponse.json();
            setResults({ cards: cardsData, sets: setsData });
            setError(null);
        } catch (err: unknown) {
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2, color: '#F27405' }}>
            <TextField
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search cards or sets..."
                InputProps={{
                    endAdornment: (
                        <Button onClick={handleSearch} sx={{ minWidth: 'auto', p: 1 }}>
                            <SearchIcon sx={{ color: '#F27405' }} />
                        </Button>
                    ),
                    sx: {
                        fontFamily: '"Press Start 2P", cursive',
                        color: '#F27405',
                        bgcolor: '#014040',
                        border: '2px solid #03A678',
                        '& .MuiInputBase-input': { padding: '8px' },
                    },
                }}
                sx={{ mb: 2 }}
            />
            {loading ? (
                <Typography sx={{ fontFamily: '"Press Start 2P", cursive' }}>Loading...</Typography>
            ) : error ? (
                <Typography sx={{ fontFamily: '"Press Start 2P", cursive' }}>{error}</Typography>
            ) : (
                <Box>
                    {results.sets.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
                                Sets
                            </Typography>
                            {results.sets.map((set) => (
                                <Typography
                                    key={set.name}
                                    onClick={() => navigate(`/sets/${set.name}`)}
                                    sx={{
                                        fontFamily: '"Press Start 2P", cursive',
                                        fontSize: '0.8rem',
                                        color: '#03A678',
                                        cursor: 'pointer',
                                        '&:hover': { color: '#F27405' },
                                    }}
                                >
                                    {set.name}
                                </Typography>
                            ))}
                        </Box>
                    )}
                    {results.cards.length > 0 && (
                        <Box>
                            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
                                Cards
                            </Typography>
                            {results.cards.map((card) => (
                                <Box
                                    key={card.id}
                                    onClick={() => navigate(`/cards/${card.id}`)}
                                    sx={{
                                        p: 1,
                                        mb: 1,
                                        bgcolor: '#014040',
                                        border: '2px solid #03A678',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#02735E' },
                                    }}
                                >
                                    <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>
                                        {card.name} ({card.set})
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.6rem', color: '#03A678' }}>
                                        {card.rarity} - ${card.price.toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {results.cards.length === 0 && results.sets.length === 0 && searchTerm && (
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive' }}>
                            No results found.
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

// Placeholder Components
const Marketplace: React.FC = () => (
    <Box sx={{ p: 2, textAlign: 'center', color: '#F27405' }}>
        <Typography sx={{ fontFamily: '"Press Start 2P", cursive' }}>Marketplace (Coming Soon)</Typography>
    </Box>
);

const Social: React.FC = () => (
    <Box sx={{ p: 2, textAlign: 'center', color: '#F27405' }}>
        <Typography sx={{ fontFamily: '"Press Start 2P", cursive' }}>Social (Coming Soon)</Typography>
    </Box>
);

const Portfolio: React.FC = () => (
    <Box sx={{ p: 2, textAlign: 'center', color: '#F27405' }}>
        <Typography sx={{ fontFamily: '"Press Start 2P", cursive' }}>Portfolio (Coming Soon)</Typography>
    </Box>
);

const Profile: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            setWalletAddress(accounts[0]);
        } catch (error) {
            console.error('Wallet connection failed:', error);
        }
    };

    return (
        <Box sx={{ p: 2, textAlign: 'center', color: '#F27405' }}>
            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
                {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Profile'}
            </Typography>
            {!walletAddress && (
                <Button
                    onClick={connectWallet}
                    sx={{
                        mt: 2,
                        fontFamily: '"Press Start 2P", cursive',
                        color: '#F27405',
                        bgcolor: '#014040',
                        border: '2px solid #03A678',
                        '&:hover': { bgcolor: '#02735E' },
                    }}
                >
                    Connect Wallet
                </Button>
            )}
        </Box>
    );
};

// Main App Component
const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('/'); // Track active tab
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
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </Box>
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
                    <Box
                        onClick={() => handleTabChange('/')}
                        sx={{
                            flex: 1,
                            textAlign: 'center',
                            color: activeTab === '/' ? '#F27405' : '#03A678',
                            cursor: 'pointer',
                            p: 1,
                        }}
                    >
                        <HomeIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>
                            Home
                        </Typography>
                    </Box>
                    <Box
                        onClick={() => handleTabChange('/search')}
                        sx={{
                            flex: 1,
                            textAlign: 'center',
                            color: activeTab === '/search' ? '#F27405' : '#03A678',
                            cursor: 'pointer',
                            p: 1,
                        }}
                    >
                        <SearchIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>
                            Search
                        </Typography>
                    </Box>
                    <Box
                        onClick={() => handleTabChange('/marketplace')}
                        sx={{
                            flex: 1,
                            textAlign: 'center',
                            color: activeTab === '/marketplace' ? '#F27405' : '#03A678',
                            cursor: 'pointer',
                            p: 1,
                        }}
                    >
                        <StoreIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>
                            Market
                        </Typography>
                    </Box>
                    <Box
                        onClick={() => handleTabChange('/social')}
                        sx={{
                            flex: 1,
                            textAlign: 'center',
                            color: activeTab === '/social' ? '#F27405' : '#03A678',
                            cursor: 'pointer',
                            p: 1,
                        }}
                    >
                        <GroupIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>
                            Social
                        </Typography>
                    </Box>
                    <Box
                        onClick={() => handleTabChange('/portfolio')}
                        sx={{
                            flex: 1,
                            textAlign: 'center',
                            color: activeTab === '/portfolio' ? '#F27405' : '#03A678',
                            cursor: 'pointer',
                            p: 1,
                        }}
                    >
                        <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>
                            Portfolio
                        </Typography>
                    </Box>
                    <Box
                        onClick={() => handleTabChange('/profile')}
                        sx={{
                            flex: 1,
                            textAlign: 'center',
                            color: activeTab === '/profile' ? '#F27405' : '#03A678',
                            cursor: 'pointer',
                            p: 1,
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem', mt: 0.5 }}>
                            Profile
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

// Wrap App in Router
const WrappedApp: React.FC = () => (
    <Router>
        <App />
    </Router>
);

export default WrappedApp;