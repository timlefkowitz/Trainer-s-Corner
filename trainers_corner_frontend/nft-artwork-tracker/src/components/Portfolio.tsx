import React from 'react';
import { Box, Typography } from '@mui/material';
import { Card, User } from '../types'; // Import for future use

interface PortfolioProps {
    user?: User; // Optional for now, required later when users are implemented
}

const Portfolio = ({ user }: PortfolioProps) => {
    // Placeholder for future state when users can add cards
    // const [portfolioCards, setPortfolioCards] = useState<Card[]>([]);

    return (
        <Box sx={{ p: 2, textAlign: 'center', color: '#F27405' }}>
            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem', mb: 2 }}>
                PORTFOLIO
            </Typography>
            {user ? (
                <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#03A678' }}>
                    {user.name}'s Portfolio (Coming Soon)
                </Typography>
            ) : (
                <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#03A678' }}>
                    Portfolio (Coming Soon)
                </Typography>
            )}
            {/* Future: List of cards */}
            {/* {portfolioCards.map((card) => (
                <Box key={card.id}>{card.name} - {card.set}</Box>
            ))} */}
        </Box>
    );
};

export default Portfolio;