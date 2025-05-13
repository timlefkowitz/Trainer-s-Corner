import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography } from '@mui/material';
import '@fontsource/press-start-2p';

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

const Search = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [results, setResults] = useState<{ cards: Card[]; sets: Set[] }>({ cards: [], sets: [] });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();


    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setResults({ cards: [], sets: [] });
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const [cardsResponse, setsResponse] = await Promise.all([
                fetch(`/api/cards?search=${encodeURIComponent(searchTerm)}`),
                fetch(`/api/sets?search=${encodeURIComponent(searchTerm)}`),
            ]);
            if (!cardsResponse.ok || !setsResponse.ok) {
                throw new Error('Failed to fetch data');
            }
            const cardsData = await cardsResponse.json();
            const setsData = await setsResponse.json();
            console.log('Cards:', cardsData, 'Sets:', setsData);
            setResults({ cards: cardsData, sets: setsData });
        } catch (error) {
            console.error('Search error:', error);
            setError('Failed to load search results. Please try again.');
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
                InputProps={{ sx: { fontFamily: '"Press Start 2P", cursive', color: '#F27405', bgcolor: '#014040', border: '2px solid #03A678' } }}
            />
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography sx={{ color: 'red' }}>{error}</Typography>
            ) : results.cards.length === 0 && results.sets.length === 0 && searchTerm ? (
                <Typography>No results found for "{searchTerm}"</Typography>
            ) : (
                <Box sx={{ mt: 2 }}>
                    {/* Sets Section */}
                    {results.sets.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#03A678' }}>
                                Sets:
                            </Typography>
                            {results.sets.map((set) => (
                                <Typography key={set.name} sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>
                                    {set.name}
                                </Typography>
                            ))}
                        </Box>
                    )}
                    {/* Cards Section */}
                    {results.cards.length > 0 && (
                        <Box>
                            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#03A678' }}>
                                Cards:
                            </Typography>
                            {results.cards.map((card) => (
                                <Box
                                    key={card.id}
                                    onClick={() => navigate(`/cards/${card.id}`)}
                                    sx={{
                                        bgcolor: '#014040',
                                        border: '2px solid #03A678',
                                        borderRadius: '8px',
                                        p: 1,
                                        mb: 1,
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#02735E' },
                                    }}
                                >
                                    <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem' }}>
                                        {card.name}
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem', color: '#F27405' }}>
                                        Set: {card.set || 'N/A'}
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem', color: '#F27405' }}>
                                        Rarity: {card.rarity}
                                    </Typography>
                                    <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem', color: '#F27405' }}>
                                        Price: {card.price != null ? `$${(card.price / 100).toFixed(2)}` : 'N/A'}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Search;