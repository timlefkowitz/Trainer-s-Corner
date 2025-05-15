import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Paper,} from '@mui/material';
import ArtworkCard from './ArtworkCard';
import '@fontsource/press-start-2p';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

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
    image_url: string;
    stage: string;
    card_type: string;
    hp: number;
    attack1:string;
    attack2: string;
    weakness: string;
    resistance: string;
    cardNumber: number;
    retreatCost: number;
    inventoryUngraded: InventoryEntry[];
    inventoryGraded: InventoryEntry[];
}

interface InventoryEntry {
    quantity: number;
    conditionOrGrade: string;
    price: number;
}

const CardDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [card, setCard] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isWatchlisted, setIsWatchlisted] = useState(false);

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

    const handleWatchlistToggle = () => {
        setIsWatchlisted(!isWatchlisted);
        // TODO: Implement API call to add/remove from watchlist
        console.log(`Card ${id} ${isWatchlisted ? 'removed from' : 'added to'} watchlist`);
    };

    // Mock chart data for last sold and previous sales
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // Mock months
        datasets: [
            {
                label: 'Sale Price ($)',
                data: [50, 45, 60, 55, parseFloat(card?.lastSalePrice || '0')], // Mock data + last sale
                borderColor: '#F27405',
                backgroundColor: 'rgba(242, 116, 5, 0.2)',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Recent Sales History' },
        },
    };

    if (loading) return <CircularProgress sx={{ color: '#03A678', mt: 4 }} />;
    if (error) return <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>;
    if (!card) return <Typography sx={{ mt: 4 }}>No card found</Typography>;


    return (
        <Box sx={{ p: 3, bgcolor: '#02735E', minHeight: '100vh', color: '#03A678' }}>
            {/* Title */}
            <Typography variant="h4" sx={{ fontFamily: '"Press Start 2P", cursive', color: '#F27405', mb: 3 }}>
                {card.name}
            </Typography>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Left Column: Image, Watchlist, Price */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, boxShadow: 3 }}>
                        <img
                            src={card.image_url || 'https://via.placeholder.com/300x420'}
                            alt={card.name}
                            style={{ width: '100%', borderRadius: 8, maxHeight: 420 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleWatchlistToggle}
                            sx={{
                                mt: 2,
                                width: '100%',
                                bgcolor: isWatchlisted ? '#F27405' : '#03A678',
                                '&:hover': { bgcolor: isWatchlisted ? '#d65e04' : '#028f60' },
                            }}
                        >
                            {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        </Button>
                        <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
                            Current Price: {card.price != null ? `$${card.price.toFixed(2)}` : 'N/A'}
                        </Typography>
                    </Box>
                </Grid>

                {/* Right Column: Set, Chart, Details */}
                <Grid item xs={12} md={8}>
                    {/* Set */}
                    <Typography sx={{ mb: 2, fontFamily: '"Press Start 2P", cursive' }}>
                        Set: {card.set || 'N/A'}
                    </Typography>

                    {/* Chart */}
                    <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
                        <Line data={chartData} options={chartOptions} />
                    </Paper>

                    {/* Details Section */}
                    <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#02735E' }}>
                            Card Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography>Card Type: {card.card_type || 'N/A'}</Typography>
                                <Typography>HP: {card.hp || 'N/A'}</Typography>
                                <Typography>Stage: {card.stage || 'N/A'}</Typography>
                                <Typography>Attack 1: {card.attack1 || 'N/A'}</Typography>
                                <Typography>Attack 2: {card.attack2 || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Weakness: {card.weakness || 'N/A'}</Typography>
                                <Typography>Resistance: {card.resistance || 'N/A'}</Typography>
                                <Typography>Retreat Cost: {card.retreatCost || 'N/A'}</Typography>
                                <Typography>Rarity: {card.rarity || 'N/A'}</Typography>
                                <Typography>Card Number: {card.cardNumber || 'N/A'}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Inventory Section */}
                    <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#02735E' }}>
                            Inventory
                        </Typography>
                        <Typography variant="subtitle1">Ungraded Inventory</Typography>
                        <Table sx={{ mb: 2 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Condition</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {card.inventoryGraded && card.inventoryGraded.length > 0 ? (
                                    card.inventoryGraded.map((entry, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{entry.quantity}</TableCell>
                                            <TableCell>{entry.conditionOrGrade}</TableCell>
                                            <TableCell>${entry.price.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3}>No graded inventory available.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                        <Typography variant="subtitle1">Graded Inventory</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Grade</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {card.inventoryUngraded && card.inventoryUngraded.length > 0 ? (
                                    card.inventoryUngraded.map((entry, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{entry.quantity}</TableCell>
                                            <TableCell>{entry.conditionOrGrade}</TableCell>
                                            <TableCell>${entry.price.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3}>No ungraded inventory available.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>

                    {/* Marketplace Section */}
                    <Paper sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#02735E' }}>
                            Marketplace Listings
                        </Typography>
                        <Typography>Coming soon: View and purchase {card.name} listings.</Typography>
                        {/* TODO: Implement marketplace API */}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};


export default CardDetail;