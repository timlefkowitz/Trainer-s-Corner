import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Set {
    name: string;
}

const Marketplace = () => {
    const [sets, setSets] = useState<Set[]>([]);
    const [selectedSet, setSelectedSet] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSets = async () => {
            try {
                const response = await fetch('/api/sets');
                const data = await response.json();
                setSets(data);
            } catch (error) {
                console.error('Error fetching sets:', error);
            }
        };
        fetchSets();
    }, []);

    const handleSetsClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleSetSelect = (setName: string) => {
        setSelectedSet(setName);
        setAnchorEl(null);
        navigate(`/sets/${setName}`);
    };
    const handleClose = () => setAnchorEl(null);

    return (
        <Box sx={{ p: 2, color: '#F27405' }}>
            <Typography sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem', mb: 2 }}>
                MARKETPLACE
            </Typography>
            <Button
                sx={{
                    fontFamily: '"Press Start 2P", cursive',
                    color: '#F27405',
                    bgcolor: '#014040',
                    border: '2px solid #03A678',
                    '&:hover': { bgcolor: '#02735E' },
                }}
                onClick={handleSetsClick}
            >
                PICK A SET
                <ArrowDropDownIcon />
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{ sx: { bgcolor: '#014040', border: '2px solid #03A678', color: '#F27405', fontFamily: '"Press Start 2P", cursive' } }}
            >
                {sets.length === 0 ? (
                    <MenuItem>Loading...</MenuItem>
                ) : (
                    sets.map((set) => (
                        <MenuItem key={set.name} onClick={() => handleSetSelect(set.name)}>
                            {set.name}
                        </MenuItem>
                    ))
                )}
            </Menu>
            {selectedSet && (
                <Typography sx={{ mt: 2, fontFamily: '"Press Start 2P", cursive', color: '#03A678' }}>
                    Selected: {selectedSet}
                </Typography>
            )}
        </Box>
    );
};

export default Marketplace;