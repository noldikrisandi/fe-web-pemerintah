import React, { useState } from 'react';
import {
  Box, Heading, Input, Button, FormControl, FormLabel, useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
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
      localStorage.setItem('token', response.data.token);
      toast({ title: 'Login berhasil!', status: 'success' });
      navigate('/dashboard'); // Ganti dengan halaman setelah login
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
    </Box>
  );
};

export default LoginUser;
