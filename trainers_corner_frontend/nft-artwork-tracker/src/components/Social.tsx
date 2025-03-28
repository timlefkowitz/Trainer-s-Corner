import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { User } from '../types';

const Social = () => {
    const [following, setFollowing] = useState<User[]>([]);
    const [friendId, setFriendId] = useState<string>('');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        if (user) {
            fetch('/api/following', {
                headers: { 'X-User-ID': user.id },
            })
                .then(res => res.json())
                .then(data => setFollowing(data))
                .catch(err => console.error('Fetch following error:', err));
        }
    }, []);

    const handleAddFriend = async () => {
        if (!friendId.trim() || !user) return;
        try {
            const response = await fetch('/api/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': user.id,
                },
                body: JSON.stringify({ friend_id: friendId }),
            });
            if (response.ok) {
                const newFriend = await response.json();
                setFollowing([...following, newFriend]);
                setFriendId('');
            } else {
                console.error('Failed to add friend');
            }
        } catch (error) {
            console.error('Add friend error:', error);
        }
    };

    return (
        <Box sx={{ p: 2, color: '#F27405' }}>
            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem', mb: 2 }}>
                SOCIAL
            </Typography>
            {user ? (
                <>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            value={friendId}
                            onChange={(e) => setFriendId(e.target.value)}
                            placeholder="Enter friend ID"
                            InputProps={{ sx: { fontFamily: '"Press Start 2P", cursive', color: '#F27405', bgcolor: '#014040', border: '2px solid #03A678' } }}
                            sx={{ mr: 1 }}
                        />
                        <Button
                            onClick={handleAddFriend}
                            sx={{ fontFamily: '"Press Start 2P", cursive', color: '#F27405', bgcolor: '#014040', border: '2px solid #03A678', '&:hover': { bgcolor: '#02735E' } }}
                        >
                            Add Friend
                        </Button>
                    </Box>
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
                </>
            ) : (
                <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#03A678' }}>
                    Sign in to see friends
                </Typography>
            )}
        </Box>
    );
};

export default Social;