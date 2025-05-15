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
    const [stats, setStats] = useState({
        totalCards: 120,
        totalGraded: 35,
        totalSealed: 10,
        totalValue: 1325.50,
        breakdown: {
            cards: 75,
            graded: 30,
            sealed: 15,
            value: 900.25,
        }
    });

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

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            setWalletAddress(accounts[0]);
        } else {
            alert('MetaMask not found');
        }
    };

    const handleGoogleSuccess = (credentialResponse: any) => { /* unchanged */ };

    const handleSteamLogin = () => {
        window.location.href = '/api/auth/steam';
    };

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
                    {/* Profile Picture & Info */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Avatar
                            src={user.profilePicture}
                            alt={user.name}
                            sx={{ width: 100, height: 100, mb: 1, border: '3px solid #03A678' }}
                        />
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#F27405' }}>
                            {user.name}
                        </Typography>
                        {user.email && (
                            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.75rem', color: '#03A678' }}>
                                {user.email}
                            </Typography>
                        )}
                    </Box>

                    {/* Total Summary */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', mb: 3 }}>
                        {[
                            { label: 'Total Cards', value: stats.totalCards },
                            { label: 'Total Graded', value: stats.totalGraded },
                            { label: 'Total Sealed', value: stats.totalSealed },
                            { label: 'Total Value', value: `$${stats.totalValue.toFixed(2)}` }
                        ].map(({ label, value }) => (
                            <Box key={label} sx={{ textAlign: 'center', p: 1, minWidth: 120 }}>
                                <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem', color: '#03A678' }}>
                                    {label}
                                </Typography>
                                <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#F27405' }}>
                                    {value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Breakdown */}
                    <Divider sx={{ my: 2, borderColor: '#03A678' }} />
                    <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#03A678', mb: 1 }}>
                        Breakdown
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', mb: 3 }}>
                        {[
                            { label: 'Cards', value: stats.breakdown.cards },
                            { label: 'Graded', value: stats.breakdown.graded },
                            { label: 'Sealed', value: stats.breakdown.sealed },
                            { label: 'Value', value: `$${stats.breakdown.value.toFixed(2)}` }
                        ].map(({ label, value }) => (
                            <Box key={label} sx={{ textAlign: 'center', p: 1, minWidth: 120 }}>
                                <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem', color: '#03A678' }}>
                                    {label}
                                </Typography>
                                <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#F27405' }}>
                                    {value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Metadata Editor */}
                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#03A678' }}>
                            Metadata
                        </Typography>
                        <TextField
                            multiline
                            rows={4}
                            value={metadataInput}
                            onChange={(e) => setMetadataInput(e.target.value)}
                            InputProps={{
                                sx: {
                                    fontFamily: '"Press Start 2P", cursive',
                                    color: '#F27405',
                                    bgcolor: '#014040',
                                    border: '2px solid #03A678',
                                },
                            }}
                            sx={{ width: '100%', mb: 1 }}
                        />
                        <Button
                            onClick={handleMetadataSave}
                            sx={{
                                fontFamily: '"Press Start 2P", cursive',
                                color: '#F27405',
                                bgcolor: '#014040',
                                border: '2px solid #03A678',
                                '&:hover': { bgcolor: '#02735E' },
                            }}
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

            {/* Wallet & Auth */}
            {walletAddress && (
                <Typography sx={{ mt: 1, fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>
                    Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Typography>
            )}
            <Box sx={{ mt: 2 }}>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.error('Google Login Failed')} />
                <Button
                    onClick={handleSteamLogin}
                    sx={{
                        mt: 1,
                        fontFamily: '"Press Start 2P", cursive',
                        color: '#F27405',
                        bgcolor: '#014040',
                        border: '2px solid #03A678',
                        '&:hover': { bgcolor: '#02735E' },
                    }}
                >
                    Login with Steam
                </Button>
                {!walletAddress && (
                    <Button
                        onClick={connectWallet}
                        sx={{
                            mt: 1,
                            fontFamily: '"Press Start 2P", cursive',
                            color: '#F27405',
                            bgcolor: '#014040',
                            border: '2px solid #03A678',
                            '&:hover': { bgcolor: '#02735E' },
                        }}
                    >
                        Connect Wallet
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Profile;
