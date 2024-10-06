import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Link,
} from '@mui/material';

const URL = import.meta.env.VITE_LOCAL_URL;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });


  const images = ['one.jpg', 'two.jpg', 'three.jpg', 'four.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(intervalId); 
  }, [images.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${URL}/api/v1/auth/login`, formData);
      console.log('Login successful:', response.data);

      // Store the token and email in localStorage
      localStorage.setItem('token', response.data.token); 
      localStorage.setItem('email', formData.email);      

      // Redirect to the dashboard
      navigate('/dashboard');
      alert('Login successful');
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${images[currentImageIndex]})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ padding: '20px' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: '#d32f2f', 
              }}
            >
              Login
            </Button>
          </form>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/register" variant="body2">
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
