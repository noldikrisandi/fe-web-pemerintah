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
      // Request login untuk mendapatkan token admin
      const response = await apiConnection.post('/admins', formData);
      const token = response.data.token;

      // Simpan token di localStorage
      localStorage.setItem('token', token);

      // Request admin data setelah login menggunakan email yang sama
      const adminResponse = await apiConnection.get('/admins', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Cari admin berdasarkan email yang sesuai
      const loggedInAdmin = adminResponse.data.find(admin => admin.email === formData.email);

      if (loggedInAdmin) {
        // Simpan nama admin di localStorage
        localStorage.setItem('adminName', loggedInAdmin.nama);
      }

      toast({ title: 'Login berhasil!', status: 'success' });
      navigate('/admin-dashboard'); // Ganti dengan halaman admin setelah login
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
      <Text color="gray.600" textAlign="center" mt={10} mb={3}>Silahkan registrasi jika belum memiliki akun admin</Text>
      <Box textAlign="center" bold color="blue.500" _hover={{ color: 'blue.700', textDecoration: 'underline' }}>
        <Link to="/admin-register">Register</Link>
      </Box>
    </Box>
  );
};

export default LoginAdmin;
