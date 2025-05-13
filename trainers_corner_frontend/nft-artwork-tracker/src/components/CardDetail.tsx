import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import ArtworkCard from './ArtworkCard';
import '@fontsource/press-start-2p';

interface CardData {
    id: string;
    name: string;
    set: string;
    lastSalePrice: string;
    lastSaleDate: string;
    rarity: string;
    price: number;
    purchaseDate: string;
    currency: string;

}

const CardDetail = () => {
    const { id } = useParams<{ id: string }>(); // Captures charizard from /card/charizard
    const [card, setCard] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/cards/${id}`, {
                    headers: { 'X-User-ID': 'guest' }, // Match AuthMiddleware
                });
                console.log('Response status:',response.status);
                if (!response.ok) throw new Error(`Card not found: ${response.statusText}`);
                const data = await response.json();
                console.log('Fetched card:',data);
                setCard(data);
            } catch (err) {
                console.error('Fetch Error', err);
                // @ts-ignore
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCard();
    }, [id]);

    if (loading) return <CircularProgress sx={{ color: '#03A678', mt: 4 }} />;
    if (error) return <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>;
    if (!card) return <Typography sx={{ mt: 4 }}>No card found</Typography>;

    return (
        <Box sx={{ p: 2, bgcolor: '#02735E', minHeight: '100vh' }}>
            <Typography
                variant="h4"
                sx={{
                    fontFamily: '"Press Start 2P", cursive',
                    color: '#F27405',
                    mb: 2,
                }}
            >
                {card.name}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: '"Press Start 2P", cursive',
                    color: '#03A678',
                    mb: 2,
                }}
            >
                Set: {card.set}
            </Typography>
            <Typography
                sx={{
                    fontFamily: '"Press Start 2P", cursive',
                    color: '#03A678',
                    mb: 1,
                }}
            >
                Rarity: {card.rarity}
            </Typography>
            <Typography
                sx={{
                    fontFamily: '"Press Start 2P", cursive',
                    color: '#03A678',
                    mb: 2,
                }}
            >
                Price: {card.price != null ? `$${(card.price / 100).toFixed(2)}` : 'N/A'}
            </Typography>
            <ArtworkCard
                salePrice={card.lastSalePrice}
                saleDate={card.lastSaleDate}
            />
        </Box>
    );
};

export default CardDetail;