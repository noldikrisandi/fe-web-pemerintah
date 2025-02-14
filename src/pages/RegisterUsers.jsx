import React, { useState } from 'react';
import {
  Box, Heading, Input, Button, FormControl, FormLabel, useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import apiConnection from '../api/apiconnection';

const generateId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 karakter random
  return `${year}${month}${date}${hours}${minutes}${seconds}${randomStr}`;
};

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    id: generateId(),
    email: '',
    password: '',
    nama: '',
    nik: '',
    nokk: '',
    wa: '',
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiConnection.post('/register', formData);
      toast({ title: 'Registrasi berhasil!', status: 'success' });
      navigate('/login');
    } catch (err) {
      toast({
        title: 'Registrasi gagal!',
        description: err.response?.data?.error || 'Silakan periksa kembali data yang Anda masukkan.',
        status: 'error',
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="md">
      <Heading as="h2" mb={6} textAlign="center">Register</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>ID (Otomatis)</FormLabel>
          <Input type="text" name="id" value={formData.id} isReadOnly />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Nama</FormLabel>
          <Input type="text" name="nama" value={formData.nama} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>NIK</FormLabel>
          <Input type="text" name="nik" value={formData.nik} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>NOKK</FormLabel>
          <Input type="text" name="nokk" value={formData.nokk} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>WA</FormLabel>
          <Input type="text" name="wa" value={formData.wa} onChange={handleChange} required />
        </FormControl>
        <Button colorScheme="blue" width="full" type="submit">Register</Button>
      </form>
    </Box>
  );
};

export default RegisterUser;
