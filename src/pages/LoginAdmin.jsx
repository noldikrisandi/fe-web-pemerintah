import React, { useState } from 'react';
import {
  Box, Heading, Input, Button, FormControl, FormLabel, useToast, Text
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import apiConnection from '../api/apiconnection';

const LoginAdmin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnection.post('/admins/login', formData);
      const token = response.data.token;

      localStorage.setItem('admin_token', token);

      const adminResponse = await apiConnection.get('/admins', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const loggedInUser = adminResponse.data.find(user => user.email === formData.email);

      if (loggedInUser) {
        localStorage.setItem('idadmin', loggedInUser.id);
      }
      

      toast({ title: 'Login berhasil!', status: 'success' });
      navigate('/aspirasilist'); 
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
      <Heading as="h2" mb={6} textAlign="center">Login Admin</Heading>
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

export default LoginAdmin;
