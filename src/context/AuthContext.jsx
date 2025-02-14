import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Box, Button, Input, FormControl, FormLabel, VStack, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Box p={8} maxW="md" borderWidth={1} borderRadius={8} boxShadow="lg" mx="auto" mt={10}>
      <Heading mb={6} textAlign="center">Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">Login</Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">Belum punya akun? <Link to="/register" style={{ color: 'blue' }}>Daftar</Link></Text>
    </Box>
  );
};

export const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password);
  };

  return (
    <Box p={8} maxW="md" borderWidth={1} borderRadius={8} boxShadow="lg" mx="auto" mt={10}>
      <Heading mb={6} textAlign="center">Register</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">Register</Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">Sudah punya akun? <Link to="/login" style={{ color: 'blue' }}>Login</Link></Text>
    </Box>
  );
};
