import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, AppBar, Toolbar, Button, TextField, Menu, MenuItem } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import CollectionsIcon from '@mui/icons-material/Collections';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArtworkCard from './components/ArtworkCard';
import '@fontsource/press-start-2p';
import './App.css';
import { ethers } from 'ethers';
import contractABI from './contract/ArtworkNFT.json';

const contractAddress = '0xYourDeployedContractAddress';

interface Set {
    name: string;
}

interface Card {
    id: number;
    name: string;
    rarity: string;
    price: number;
    set: string | null;
    year?: number | null;
    condition?: string | null;
    image_url?: string | null;
    card_type?: string | null;
    language?: string | null;
}

// Landing Page
const LandingPage: React.FC = () => (
    <Container
        maxWidth="lg"
        sx={{
            py: 4,
            mt: 8,
            backgroundColor: '#02735E',
            color: '#F27405',
            minHeight: 'calc(100vh - 64px)',
            textAlign: 'center',
        }}
    >
        <Typography
            variant="h3"
            gutterBottom
            sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
            WELCOME TO TRAINERS CORNER
        </Typography>
        <Typography
            sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '0.75rem', sm: '1rem' }, color: '#03A678' }}
        >
            Explore Pokémon card sets, track prices, and dive into the market!
        </Typography>
        <Button
            component={Link}
            to="/sets"
            sx={{
                mt: 4,
                fontFamily: '"Press Start 2P", cursive',
                color: '#F27405',
                backgroundColor: '#014040',
                border: '2px solid #03A678',
                fontSize: '1rem',
                padding: '0.5rem 1rem',
                '&:hover': { backgroundColor: '#02735E' },
            }}
        >
            VIEW SETS
        </Button>
    </Container>
);

// Card List Page
const CardList: React.FC = () => {
    const [sets, setSets] = useState<Set[]>([]);
    const [selectedSet, setSelectedSet] = useState<string | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [loadingSets, setLoadingSets] = useState<boolean>(true);
    const [loadingCards, setLoadingCards] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const fetchSets = async () => {
        try {
            const response = await fetch('/api/sets');
            if (!response.ok) throw new Error(`Failed to fetch sets: ${response.status}`);
            const data = await response.json();
            setSets(data);
            setLoadingSets(false);
        } catch (err: unknown) { // Changed to unknown
            console.error('Fetch sets error:', err);
            if (err instanceof Error) {
                setError(err.message || 'Error fetching sets');
            } else {
                setError('Unknown error occurred');
            }
            setLoadingSets(false);
        }
    };

    const fetchCards = async (setName: string) => {
        setLoadingCards(true);
        try {
            const response = await fetch(`/api/cards?set=${encodeURIComponent(setName)}`);
            if (!response.ok) throw new Error(`Failed to fetch cards: ${response.status}`);
            const data = await response.json();
            setCards(data);
            setLoadingCards(false);
        } catch (err: unknown) { // Changed to unknown
            console.error('Fetch cards error:', err);
            if (err instanceof Error) {
                setError(err.message || 'Error fetching cards');
            } else {
                setError('Unknown error occurred');
            }
            setLoadingCards(false);
        }
    };

    useEffect(() => {
        fetchSets();
    }, []);

    const handleSetsClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSetSelect = (setName: string) => {
        setSelectedSet(setName);
        fetchCards(setName);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 4,
                mt: 8,
                backgroundColor: '#02735E',
                color: '#F27405',
                minHeight: 'calc(100vh - 64px)',
            }}
        >
            <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '1rem', sm: '1.5rem' } }}
            >
                {selectedSet ? `${selectedSet} CARDS` : 'SELECT A SET'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                    sx={{
                        fontFamily: '"Press Start 2P", cursive',
                        color: '#03A678',
                        backgroundColor: '#014040',
                        border: '2px solid #03A678',
                        fontSize: { xs: '0.75rem', sm: '1rem' },
                        padding: '0.25rem 0.5rem',
                        '&:hover': { backgroundColor: '#02735E' },
                    }}
                    startIcon={<CollectionsIcon sx={{ color: '#F27405' }} />}
                    onClick={handleSetsClick}
                >
                    SETS
                    <ArrowDropDownIcon sx={{ color: '#F27405' }} />
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            backgroundColor: '#014040',
                            border: '2px solid #03A678',
                            color: '#F27405',
                            fontFamily: '"Press Start 2P", cursive',
                        },
                    }}
                >
                    {loadingSets ? (
                        <MenuItem>Loading...</MenuItem>
                    ) : error ? (
                        <MenuItem>{error}</MenuItem>
                    ) : sets.length === 0 ? (
                        <MenuItem>No sets found</MenuItem>
                    ) : (
                        sets.map((set) => (
                            <MenuItem key={set.name} onClick={() => handleSetSelect(set.name)}>
                                {set.name}
                            </MenuItem>
                        ))
                    )}
                </Menu>
            </Box>
            {selectedSet && (
                <Box sx={{ mt: 4, p: 2, bgcolor: '#014040', border: '2px solid #03A678' }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '0.875rem', sm: '1.25rem' }, color: '#F27405' }}
                    >
                        {selectedSet} CARDS
                    </Typography>
                    {loadingCards ? (
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', color: '#03A678' }}>
                            Loading cards...
                        </Typography>
                    ) : error ? (
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', color: '#03A678' }}>
                            {error}
                        </Typography>
                    ) : cards.length === 0 ? (
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', color: '#03A678' }}>
                            No cards found for this set.
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {cards.map((card) => (
                                <Box
                                    key={card.id}
                                    onClick={() => navigate(`/cards/${card.id}`)}
                                    sx={{
                                        bgcolor: '#333',
                                        border: '2px solid #fff',
                                        p: 1,
                                        width: { xs: '100%', sm: '200px' },
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#444' },
                                    }}
                                >
                                    <Typography
                                        sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.75rem', color: '#fff' }}
                                    >
                                        {card.name}
                                    </Typography>
                                    <Typography
                                        sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.6rem', color: '#03A678' }}
                                    >
                                        {card.rarity}
                                    </Typography>
                                    <Typography
                                        sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.6rem', color: '#F27405' }}
                                    >
                                        ${card.price.toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
        </Container>
    );
};

/// Card Detail Page
const CardDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [card, setCard] = useState<Card | null>(null);
    const [currentOwner, setCurrentOwner] = useState<string>('Loading...');
    const [salePrice, setSalePrice] = useState<string>('Loading...');
    const [saleDate, setSaleDate] = useState<string>('Loading...');
    const [chartData, setChartData] = useState<{ dates: string[]; prices: number[] }>({
        dates: ['01/01/2025', '01/15/2025', '02/01/2025', '02/15/2025', '03/01/2025'],
        prices: [1.2, 1.8, 2.5, 2.0, 3.0],
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCard = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/cards/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch card: ${response.status}`);
            const data = await response.json();
            setCard(data);
            // Placeholder data until real sale history is implemented
            setCurrentOwner('0x1234...5678');
            setSalePrice(`$${data.price.toFixed(2)}`);
            setSaleDate('03/24/2025');
            setLoading(false);
        } catch (err: unknown) { // Changed to unknown
            console.error('Fetch card error:', err);
            if (err instanceof Error) {
                setError(err.message || 'Error fetching card');
            } else {
                setError('Unknown error occurred');
            }
            setLoading(false);
        }
    };

    const loadArtworkData = async () => {
        if (!window.ethereum) {
            console.log('No Ethereum provider detected');
            setCurrentOwner('No wallet detected');
            setSalePrice('N/A');
            setSaleDate('N/A');
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
            const saleHistory = (await contract.getSaleHistory(Number(id))) as any[];
            if (saleHistory.length === 0) {
                setCurrentOwner('No sales yet');
                setSalePrice('N/A');
                setSaleDate('N/A');
                return;
            }
            const formattedHistory = saleHistory.map((sale) => ({
                price: Number(ethers.formatEther(sale.price)),
                owner: sale.owner as string,
                date: new Date(Number(sale.date) * 1000).toLocaleDateString(),
            }));
            setChartData({
                dates: formattedHistory.map((sale) => sale.date),
                prices: formattedHistory.map((sale) => sale.price),
            });
            const latestSale = formattedHistory[formattedHistory.length - 1];
            setCurrentOwner(latestSale.owner);
            setSalePrice(`${latestSale.price} ETH`);
            setSaleDate(latestSale.date);
        } catch (error) {
            console.error('Error fetching sale data:', error);
            setCurrentOwner('Error fetching data');
            setSalePrice('N/A');
            setSaleDate('N/A');
        }
    };

    useEffect(() => {
        fetchCard();
        // loadArtworkData(); // Uncomment if integrating with NFT contract
    }, [id]);

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 4,
                mt: 8,
                backgroundColor: '#02735E',
                color: '#F27405',
                minHeight: 'calc(100vh - 64px)',
            }}
        >
            {loading ? (
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '1rem', sm: '1.5rem' } }}
                >
                    LOADING...
                </Typography>
            ) : error ? (
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '1rem', sm: '1.5rem' } }}
                >
                    {error}
                </Typography>
            ) : (
                <>
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '1rem', sm: '1.5rem' } }}
                    >
                        {card ? `${card.name} (${card.set})` : 'CARD DETAILS'}
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '0.75rem', sm: '1rem' }, color: '#03A678' }}
                    >
                        OWNER: {currentOwner}
                    </Typography>
                    <Box sx={{ mt: 4, p: 2, bgcolor: '#014040', border: '2px solid #03A678' }}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '0.875rem', sm: '1.25rem' }, color: '#F27405' }}
                        >
                            SALE HISTORY
                        </Typography>
                        <LineChart
                            xAxis={[{ data: chartData.dates, label: 'DATE', tickFontSize: 10 }]}
                            series={[{ data: chartData.prices, label: 'PRICE (ETH)', color: '#F27405' }]}
                            height={300}
                            margin={{ top: 20, bottom: 50, left: 50, right: 20 }}
                            sx={{ '& .MuiChartsAxis-tickLabel': { fontFamily: '"Press Start 2P", cursive', fill: '#03A678' } }}
                        />
                    </Box>
                    <ArtworkCard salePrice={salePrice} saleDate={saleDate} />
                </>
            )}
        </Container>
    );
};

// Main App Component
const App: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = (await provider.send('eth_requestAccounts', [])) as string[];
            setWalletAddress(accounts[0]);
        } catch (error) {
            console.error('Wallet connection failed:', error);
        }
    };

    return (
        <Router>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: '#014040',
                    border: '4px solid #03A678',
                    padding: { xs: '0.25rem', sm: '0.5rem' },
                    zIndex: 1100,
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: { xs: 0.5, sm: 1 },
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: '"Press Start 2P", cursive',
                            color: '#F27405',
                            fontSize: { xs: '0.75rem', sm: '1rem' },
                            textTransform: 'uppercase',
                            flexGrow: { xs: 0, sm: 1 },
                        }}
                    >
                        trainersCorner
                    </Typography>
                    <Box sx={{ display: 'flex', gap: { xs: 0.25, sm: 0.5 } }}>
                        <Button
                            component={Link}
                            to="/"
                            sx={{
                                fontFamily: '"Press Start 2P", cursive',
                                color: '#03A678',
                                backgroundColor: '#014040',
                                border: '2px solid #03A678',
                                fontSize: { xs: '0.4rem', sm: '0.75rem' },
                                padding: { xs: '0.1rem 0.2rem', sm: '0.25rem 0.5rem' },
                                '&:hover': { backgroundColor: '#02735E' },
                            }}
                            startIcon={<HomeIcon sx={{ color: '#F27405', fontSize: { xs: 16, sm: 24 } }} />}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                HOME
                            </Box>
                        </Button>
                        <Button
                            component={Link}
                            to="/sets"
                            sx={{
                                fontFamily: '"Press Start 2P", cursive',
                                color: '#03A678',
                                backgroundColor: '#014040',
                                border: '2px solid #03A678',
                                fontSize: { xs: '0.4rem', sm: '0.75rem' },
                                padding: { xs: '0.1rem 0.2rem', sm: '0.25rem 0.5rem' },
                                '&:hover': { backgroundColor: '#02735E' },
                            }}
                            startIcon={<CollectionsIcon sx={{ color: '#F27405', fontSize: { xs: 16, sm: 24 } }} />}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                SETS
                            </Box>
                        </Button>
                        <Button
                            sx={{
                                fontFamily: '"Press Start 2P", cursive',
                                color: '#03A678',
                                backgroundColor: '#014040',
                                border: '2px solid #03A678',
                                fontSize: { xs: '0.4rem', sm: '0.75rem' },
                                padding: { xs: '0.1rem 0.2rem', sm: '0.25rem 0.5rem' },
                                '&:hover': { backgroundColor: '#02735E' },
                            }}
                            startIcon={<BarChartIcon sx={{ color: '#F27405', fontSize: { xs: 16, sm: 24 } }} />}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                STATS
                            </Box>
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            border: '2px solid #03A678',
                            backgroundColor: '#014040',
                            padding: { xs: '0 4px', sm: '0 8px' },
                        }}
                    >
                        <SearchIcon sx={{ color: '#F27405', width: { xs: 16, sm: 24 }, height: { xs: 16, sm: 24 } }} />
                        <TextField
                            variant="standard"
                            size="small"
                            placeholder="SEARCH"
                            sx={{
                                fontFamily: '"Press Start 2P", cursive',
                                color: '#03A678',
                                '& .MuiInputBase-input': {
                                    padding: '2px 0',
                                    fontSize: { xs: '0.5rem', sm: '0.75rem' },
                                    color: '#03A678',
                                },
                                width: { xs: '80px', sm: '150px' },
                            }}
                            InputProps={{ disableUnderline: true }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        onClick={connectWallet}
                        sx={{
                            fontFamily: '"Press Start 2P", cursive',
                            backgroundColor: '#731702',
                            color: '#F27405',
                            border: '2px solid #F27405',
                            fontSize: { xs: '0.4rem', sm: '0.75rem' },
                            padding: { xs: '0.1rem 0.2rem', sm: '0.25rem 0.5rem' },
                            '&:hover': { backgroundColor: '#02735E' },
                        }}
                        startIcon={<AccountBalanceWalletIcon sx={{ color: '#F27405', fontSize: { xs: 16, sm: 24 } }} />}
                    >
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'CONNECT'}
                        </Box>
                    </Button>
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sets" element={<CardList />} />
                <Route path="/cards/:id" element={<CardDetail />} />
            </Routes>
        </Router>
    );
};

export default App;