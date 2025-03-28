import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Divider, Avatar, TextField } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { ethers } from 'ethers';
import { User } from '../types';

const Profile = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [metadataInput, setMetadataInput] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const steamId = params.get('steam_id');
        if (steamId && !user) {
            const newUser = { id: steamId, name: `SteamUser_${steamId.slice(-4)}` };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        }
    }, [location, user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            setMetadataInput(user.metadata ? JSON.stringify(user.metadata, null, 2) : '{}');
        }
    }, [user]);

    const connectWallet = async () => { /* unchanged */ };

    const handleGoogleSuccess = (credentialResponse: any) => { /* unchanged */ };

    const handleSteamLogin = () => { /* unchanged */ };

    const handleMetadataSave = async () => {
        if (!user) return;
        try {
            const metadata = JSON.parse(metadataInput);
            const updatedUser = { ...user, metadata };
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': user.id,
                },
                body: JSON.stringify(updatedUser),
            });
            if (response.ok) {
                setUser(updatedUser);
            } else {
                console.error('Failed to update metadata');
            }
        } catch (error) {
            console.error('Metadata save error:', error);
        }
    };

    return (
        <Box sx={{ p: 2, color: '#F27405' }}>
            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem', mb: 2 }}>
                PROFILE
            </Typography>
            {user ? (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={user.profilePicture}
                            alt={user.name}
                            sx={{ width: 56, height: 56, mr: 2, border: '2px solid #03A678' }}
                        />
                        <Box>
                            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem' }}>
                                Name: {user.name}
                            </Typography>
                            {user.email && (
                                <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#03A678' }}>
                                    Email: {user.email}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#03A678' }}>
                            Metadata
                        </Typography>
                        <TextField
                            multiline
                            rows={4}
                            value={metadataInput}
                            onChange={(e) => setMetadataInput(e.target.value)}
                            InputProps={{ sx: { fontFamily: '"Press Start 2P", cursive', color: '#F27405', bgcolor: '#014040', border: '2px solid #03A678' } }}
                            sx={{ width: '100%', mb: 1 }}
                        />
                        <Button
                            onClick={handleMetadataSave}
                            sx={{ fontFamily: '"Press Start 2P", cursive', color: '#F27405', bgcolor: '#014040', border: '2px solid #03A678', '&:hover': { bgcolor: '#02735E' } }}
                        >
                            Save Metadata
                        </Button>
                    </Box>
                </>
            ) : (
                <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#03A678' }}>
                    Not signed in
                </Typography>
            )}
            {walletAddress && (
                <Typography sx={{ mt: 1, fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>
                    Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Typography>
            )}
            <Box sx={{ mt: 2 }}>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.error('Google Login Failed')} />
                <Button onClick={handleSteamLogin} sx={{ mt: 1, fontFamily: '"Press Start 2P", cursive', color: '#F27405', bgcolor: '#014040', border: '2px solid #03A678', '&:hover': { bgcolor: '#02735E' } }}>
                    Login with Steam
                </Button>
                {!walletAddress && (
                    <Button onClick={connectWallet} sx={{ mt: 1, fontFamily: '"Press Start 2P", cursive', color: '#F27405', bgcolor: '#014040', border: '2px solid #03A678', '&:hover': { bgcolor: '#02735E' } }}>
                        Connect Wallet
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Profile;