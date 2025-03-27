import React, {useEffect, useState} from "react";
import {User} from "../types";
import {useLocation, useNavigate} from "react-router-dom";
import {ethers} from "ethers";
import {jwtDecode} from "jwt-decode";
import {Box, Button, Divider, Typography} from "@mui/material";
import {GoogleLogin} from "@react-oauth/google";
import Search from "./Search";

const Profile = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const steamId = params.get('steam_id');
        if (steamId && !user) {
            setUser({ id: steamId, name: `SteamUser_${steamId.slice(-4)}` });
        }
    }, [location]);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            setWalletAddress(accounts[0]);
        } catch (error) {
            console.error('Wallet connection failed:', error);
        }
    };

    const handleGoogleSuccess = (credentialResponse: any) => {
        const decoded = jwtDecode<{ sub: string; name: string; email: string }>(credentialResponse.credential);
        setUser({ id: decoded.sub, name: decoded.name, email: decoded.email });
    };

    const handleSteamLogin = () => {
        window.location.href = 'http://localhost:8080/auth/steam';
    };

    return (
        <Box sx={{ p: 2, color: '#F27405' }}>
            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem', mb: 2 }}>
                PROFILE
            </Typography>
            {user ? (
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
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.error('Google Login Failed')}
                />
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
            <Divider sx={{ my: 2, borderColor: '#03A678' }} />
            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem', color: '#03A678' }}>
                Settings (Coming Soon)
            </Typography>
        </Box>
    );
};

export default Profile;