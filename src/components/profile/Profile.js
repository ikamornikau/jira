import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Profile({notifyLogOut}) {
    const handleLogOut = () => {
        localStorage.removeItem('profile');
        notifyLogOut();
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Button variant="outlined" onClick={handleLogOut}>Log Out</Button>
        </Box>
    );
}
