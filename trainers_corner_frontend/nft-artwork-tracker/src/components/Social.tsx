import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { User } from '../types'; // Import User interface

const Social = () => {
    const [following] = useState<User[]>([
        { id: '1', name: 'PokeFan1' },
        { id: '2', name: 'CardMaster' },
        { id: '3', name: 'TrainerX' },
    ]);

    return (
        <Box sx={{ p: 2, color: '#F27405' }}>
            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem', mb: 2 }}>
                SOCIAL
            </Typography>
            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#03A678' }}>
                Following
            </Typography>
            {following.map((user) => (
                <Box key={user.id} sx={{ p: 1, bgcolor: '#014040', border: '2px solid #03A678', mb: 1 }}>
                    <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>
                        {user.name}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default Social;