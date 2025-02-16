import React, { useState } from 'react';
import {
  Box, Heading, Input, Button, FormControl, FormLabel, useToast, Checkbox, FormErrorMessage,
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
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${year}${month}${date}${hours}${minutes}${seconds}${randomStr}`;
};

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    id: generateId(),
    email: '',
    password: '',
    confirmPassword: '',
    nama: '',
    nik: '',
    nokk: '',
    wa: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isNikValid, setIsNikValid] = useState(true);
  const [isNokkValid, setIsNokkValid] = useState(true);
  const [isWaValid, setIsWaValid] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      if (name === 'confirmPassword') {
        setIsPasswordMatch(newData.password === value);
      }
      if (name === 'password') {
        setIsPasswordMatch(value === newData.confirmPassword);
      }
      if (name === 'nik') {
        setIsNikValid(/^[0-9]{16}$/.test(value));
      }
      if (name === 'nokk') {
        setIsNokkValid(/^[0-9]{16}$/.test(value));
      }
      if (name === 'wa') {
        setIsWaValid(/^\+?62\d{9,13}$|^08\d{8,11}$/.test(value));
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNikValid || !isNokkValid || !isWaValid) {
      toast({ title: 'Harap periksa kembali data yang dimasukkan.', status: 'error' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Password tidak cocok!', status: 'error' });
      return;
    }
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
        <FormControl mb={4} hidden>
          <FormLabel>ID (Otomatis)</FormLabel>
          <Input type="text" name="id" value={formData.id} isReadOnly />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4} isInvalid={!isPasswordMatch}>
          <FormLabel>Konfirmasi Password</FormLabel>
          <Input 
            type={showPassword ? "text" : "password"} 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            borderColor={!isPasswordMatch ? "red.500" : "gray.200"}
            required 
          />
          {!isPasswordMatch && <FormErrorMessage>Password tidak cocok.</FormErrorMessage>}
        </FormControl>
        <FormControl mb={4}>
          <Checkbox onChange={() => setShowPassword(!showPassword)}>Perlihatkan Password</Checkbox>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Nama</FormLabel>
          <Input type="text" name="nama" value={formData.nama} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={4} isInvalid={!isNikValid}>
          <FormLabel>NIK</FormLabel>
          <Input type="text" name="nik" value={formData.nik} onChange={handleChange} required />
          {!isNikValid && <FormErrorMessage>NIK harus berisi 16 digit angka.</FormErrorMessage>}
        </FormControl>
        <FormControl mb={4} isInvalid={!isNokkValid}>
          <FormLabel>Nomer Kartu Keluarga</FormLabel>
          <Input type="text" name="nokk" value={formData.nokk} onChange={handleChange} required />
          {!isNokkValid && <FormErrorMessage>Nomer Kartu Keluarga harus berisi 16 digit angka.</FormErrorMessage>}
        </FormControl>
        <FormControl mb={4} isInvalid={!isWaValid}>
          <FormLabel>Nomer WA Aktif</FormLabel>
          <Input type="text" name="wa" value={formData.wa} onChange={handleChange} required />
          {!isWaValid && <FormErrorMessage>Masukkan nomor WA yang valid dengan format +62 atau 08.</FormErrorMessage>}
        </FormControl>
        <Button colorScheme="blue" width="full" type="submit">Register</Button>
      </form>
    </Box>
  );
};

export default RegisterUser;
