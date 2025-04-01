import React from 'react';
import {Box, Button, Typography} from '@mui/material';

const Home = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography
            variant="h4"
            sx={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: { xs: '1.5rem', sm: '2.5rem', md: '3rem' },
                color: '#FF3864',
                textShadow: '2px 2px #03A678',
                letterSpacing: '2px',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' },
                },
            }}
        >
            TRAINERS CORNER
        </Typography>
        <Typography
            sx={{
                mt: 2,
                fontFamily: '"Press Start 2P", cursive',
                fontSize: { xs: '0.8rem', sm: '1rem' },
                color: '#FFD700',
                textAlign: 'center',
                lineHeight: 1.5,
            }}
        >
            Unleash Your Collection! <br />
            Hunt Epic Cards & Conquer the Sets!
        </Typography>
        <Button
            variant="contained"
            sx={{
                mt: 3,
                fontFamily: '"Press Start 2P", cursive',
                backgroundColor: '#03A678',
                color: '#FFD700',
                '&:hover': { backgroundColor: '#FF3864' },
            }}
        >
            Start Collecting
        </Button>
    </Box>
);

export default Home;