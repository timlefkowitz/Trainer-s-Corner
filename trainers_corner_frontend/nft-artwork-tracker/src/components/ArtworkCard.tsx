import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface ArtworkCardProps {
    salePrice: string;
    saleDate: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ salePrice, saleDate }) => {
    return (
        <Card
            sx={{
                mt: 4,
                bgcolor: '#333',
                border: '2px solid #fff',
                borderRadius: 0,
                boxShadow: '0 1px 2px rgb(24 39 75 / 4%)', // Shadow box
            }}
        >
            <CardContent>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontFamily: '"Press Start 2P", cursive', color: '#fff', fontSize: '1rem' }}
                >
                    LAST TX
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ fontFamily: '"Press Start 2P", cursive', color: '#fff', fontSize: '0.75rem' }}
                >
                    PRICE: {salePrice}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ fontFamily: '"Press Start 2P", cursive', color: '#fff', fontSize: '0.75rem' }}
                >
                    DATE: {saleDate}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ArtworkCard;