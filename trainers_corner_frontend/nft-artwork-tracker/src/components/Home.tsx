import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => (
    <Box sx={{ p: 2, textAlign: 'center', color: '#F27405' }}>
        <Typography variant="h4" sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            TRAINERS CORNER
        </Typography>
        <Typography sx={{ mt: 2, fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#03A678' }}>
            Welcome! Explore cards and sets.
        </Typography>
    </Box>
);

export default Home;