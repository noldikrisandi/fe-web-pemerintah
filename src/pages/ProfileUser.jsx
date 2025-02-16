import { useEffect, useState } from "react";
import {
  Box, Text, VStack, Heading, Spinner, Alert, AlertIcon, Input, Button, FormControl, FormLabel, useToast, Divider, Icon
} from "@chakra-ui/react";
import { FaUserEdit, FaSave } from "react-icons/fa";
import apiConnection from "../api/apiconnection";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nama: "", email: "", wa: "" });
  const toast = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) {
        setError("User ID tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiConnection.get(`/users/${userId}`);
        setUser(response.data);
        setFormData({
          nama: response.data.nama,
          email: response.data.email,
          wa: response.data.wa
        });
      } catch (err) {
        setError("Gagal mengambil data profil. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await apiConnection.put(`/users/${user.id}`, formData);
      setUser({ ...user, ...formData });
      localStorage.setItem("userName", formData.nama);
      setIsEditing(false);
      toast({
        title: "Profil diperbarui!",
        description: "Data Anda telah berhasil diperbarui.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Gagal memperbarui!",
        description: "Terjadi kesalahan saat memperbarui data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW={{ base: "90%", md: "500px" }} mx="auto" p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <Heading size="lg" mb={4} textAlign="center" color="teal.600">Profil Pengguna</Heading>
      <Divider mb={4} />

      {loading && <Spinner size="xl" color="teal.500" mx="auto" display="block" />} 
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {user && (
        <VStack spacing={4} align="start">
          <Text fontSize="sm" color="gray.600">ID: {user.id}</Text>

          <FormControl>
            <FormLabel fontWeight="bold">Nama</FormLabel>
            <Input 
              name="nama" 
              value={formData.nama} 
              onChange={handleChange} 
              isReadOnly={!isEditing} 
              bg={isEditing ? "white" : "gray.100"}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">Email</FormLabel>
            <Input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              isReadOnly={!isEditing} 
              bg={isEditing ? "white" : "gray.100"}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">WhatsApp</FormLabel>
            <Input 
              name="wa" 
              value={formData.wa} 
              onChange={handleChange} 
              isReadOnly={!isEditing} 
              bg={isEditing ? "white" : "gray.100"}
            />
          </FormControl>

          {isEditing ? (
            <Button leftIcon={<FaSave />} colorScheme="blue" onClick={handleUpdate} width="full">
              Simpan Perubahan
            </Button>
          ) : (
            <Button leftIcon={<FaUserEdit />} colorScheme="teal" onClick={() => setIsEditing(true)} width="full">
              Edit Profil
            </Button>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default Profile;
