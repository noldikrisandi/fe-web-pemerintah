import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
// import axios from "axios";
import apiConnection from '../api/apiconnection';

const generateAdminID = () => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14); // Format YYYYMMDDHHMMSS

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomStr = "";
  for (let i = 0; i < 4; i++) {
    randomStr += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return timestamp + randomStr;
};

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    id: generateAdminID(),
    email: "",
    password: "",
    answer: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    await apiConnection.post('/admins/register', formData);
      toast({
        title: "Registrasi berhasil!",
        description: `Admin ID: ${formData.id} telah terdaftar.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        id: generateAdminID(),
        email: "",
        password: "",
        answer: "",
      });
    } catch (error) {
      toast({
        title: "Registrasi gagal!",
        description: error.response?.data?.error || "Terjadi kesalahan.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
      <Heading size="lg" mb={5}>Registrasi Admin</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>ID Admin</FormLabel>
            <Input type="text" name="id" value={formData.id} isReadOnly />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Masukkan email" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Masukkan password" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Jawaban Keamanan</FormLabel>
            <Input type="text" name="answer" value={formData.answer} onChange={handleChange} placeholder="Masukkan jawaban keamanan" />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={loading}>
            Daftar
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AdminRegister;
