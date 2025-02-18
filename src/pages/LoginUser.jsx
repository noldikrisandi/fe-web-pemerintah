import React, { useState } from 'react';
import {
  Box, Heading, Input, Button, FormControl, FormLabel, useToast, Text
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import apiConnection from '../api/apiconnection';

const LoginUser = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnection.post('/login', formData);
      const token = response.data.token;

      localStorage.setItem('user_token', token);

      const userResponse = await apiConnection.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const loggedInUser = userResponse.data.find(user => user.email === formData.email);

      if (loggedInUser) {
        localStorage.setItem('userName', loggedInUser.nama);
        localStorage.setItem('id', loggedInUser.id);
      }

      toast({ title: 'Login berhasil!', status: 'success' });
      navigate('/');
    } catch (err) {
      toast({
        title: 'Login gagal!',
        description: err.response?.data?.error || 'Periksa kembali email dan password Anda.',
        status: 'error',
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="md">
      <Heading as="h2" mb={6} textAlign="center">Login</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </FormControl>
        <Button colorScheme="blue" width="full" type="submit">Login</Button>
      </form>
      <Text color="gray.600" textAlign="center" mt={10} mb={3}>Silahkan Registrasi jika belum memiliki akun</Text>
      <Box textAlign="center" bold color="blue.500" _hover={{ color: 'blue.700', textDecoration: 'underline' }}>
        <Link to="/register">Register</Link>
      </Box>
    </Box>
  );
};

export default LoginUser;
