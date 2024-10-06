import { useEffect, useState } from 'react'; 
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaFileAlt, FaListAlt } from 'react-icons/fa'; 
import { VscAccount } from 'react-icons/vsc'; 
import { AiOutlineLogout } from 'react-icons/ai'; 
import { RiAccountCircleLine } from 'react-icons/ri'; 
import axios from 'axios'; 

const Header = () => {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Fetch token from local storage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Decode the token to get user info
      const user = JSON.parse(atob(storedToken.split('.')[1]));
      setUserName(user.name); // Set the user's name from the token
    }
  }, []);

  // Fetch and format the email
  const email = localStorage.getItem('email');
  const displayName = email ? email.split('@')[0] : 'User Profile'; // Get the part before '@'

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email'); // Clear the email from local storage on logout
    setToken(null);
    setUserName('');
    handleCloseMenu(); 
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1 }}>
          CV Builder Home
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/dashboard" startIcon={<FaTachometerAlt />}>
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/templates" startIcon={<FaFileAlt />}>
            Templates
          </Button>
          <Button color="inherit" component={Link} to="/all-cvs" startIcon={<FaListAlt />}>
            All CVs
          </Button>
        </Box>

        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          {token ? (
            <>
              <Button color="inherit" onClick={handleMenuOpen} startIcon={<RiAccountCircleLine />}>
                {displayName || 'User Profile'} 
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem component={Link} to="/user-profile" onClick={handleCloseMenu}>
                  <RiAccountCircleLine style={{ marginRight: '8px' }} /> User Profile
                </MenuItem>
                <MenuItem component={Link} to="/cv-builder" onClick={handleCloseMenu}>
                  <FaFileAlt style={{ marginRight: '8px' }} /> CV Builder
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <AiOutlineLogout style={{ marginRight: '8px' }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" startIcon={<RiAccountCircleLine />}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" startIcon={<VscAccount />}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
