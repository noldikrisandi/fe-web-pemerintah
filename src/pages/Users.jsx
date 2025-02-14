import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Text,
  Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Input, FormControl, FormLabel, useDisclosure
} from '@chakra-ui/react';
import apiConnection from '../api/apiconnection';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ id: '', email: '', nama: '', nik: '', nokk: '', wa: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiConnection.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mengambil data.');
      toast({
        title: 'Gagal memuat data.',
        description: err.response?.data?.error || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.id || !formData.email || !formData.nama || !formData.nik || !formData.nokk || !formData.wa) {
      toast({
        title: 'Gagal!',
        description: 'Semua field harus diisi!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedUser) {
        await apiConnection.put(`/users/${selectedUser.id}`, formData);
        toast({ title: 'User berhasil diperbarui!', status: 'success' });
      } else {
        await apiConnection.post('/users', formData);
        toast({ title: 'User berhasil ditambahkan!', status: 'success' });
      }
      fetchUsers();
      onClose();
    } catch (err) {
      console.error('Error:', err.response?.data);
      toast({
        title: 'Terjadi kesalahan!',
        description: err.response?.data?.error || 'Gagal menambahkan user.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await apiConnection.delete(`/users/${id}`);
        toast({ title: 'User berhasil dihapus!', status: 'success' });
        fetchUsers();
      } catch (err) {
        toast({ title: 'Gagal menghapus user!', description: err.response?.data?.error || err.message, status: 'error' });
      }
    }
  };

  const openModal = (user = null) => {
    setSelectedUser(user);
    setFormData(user ? { ...user } : { id: '', email: '', nama: '', nik: '', nokk: '', wa: '' });
    onOpen();
  };

  if (loading) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner size="xl" />
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={4}>
        <Text color="red.500">Terjadi kesalahan: {error}</Text>
      </Box>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" p={4}>
      <Heading as="h1" mb={6} textAlign="center">
        Daftar Pengguna
      </Heading>
      <Button colorScheme="blue" mb={4} onClick={() => openModal()}>Tambah User</Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Email</Th>
            <Th>Nama</Th>
            <Th>NIK</Th>
            <Th>NOKK</Th>
            <Th>WA</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.email}</Td>
              <Td>{user.nama}</Td>
              <Td>{user.nik}</Td>
              <Td>{user.nokk}</Td>
              <Td>{user.wa}</Td>
              <Td>
                <Button colorScheme="yellow" size="sm" mr={2} onClick={() => openModal(user)}>Edit</Button>
                <Button colorScheme="red" size="sm" onClick={() => handleDelete(user.id)}>Hapus</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal Tambah/Edit User */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedUser ? 'Edit User' : 'Tambah User'}</ModalHeader>
          <ModalBody>
            {!selectedUser && (
              <FormControl>
                <FormLabel>ID</FormLabel>
                <Input name="id" value={formData.id} onChange={handleChange} />
              </FormControl>
            )}
            <FormControl mt={2}>
              <FormLabel>Email</FormLabel>
              <Input name="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>Nama</FormLabel>
              <Input name="nama" value={formData.nama} onChange={handleChange} />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>NIK</FormLabel>
              <Input name="nik" value={formData.nik} onChange={handleChange} />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>NOKK</FormLabel>
              <Input name="nokk" value={formData.nokk} onChange={handleChange} />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>WA</FormLabel>
              <Input name="wa" value={formData.wa} onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {selectedUser ? 'Simpan Perubahan' : 'Tambah'}
            </Button>
            <Button onClick={onClose}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Users;
