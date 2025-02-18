import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Text,
  Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Input, FormControl, FormLabel, FormErrorMessage,
  useDisclosure
} from '@chakra-ui/react';
import apiConnection from '../api/apiconnection';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ id: '', email: '', nama: '', nik: '', nokk: '', wa: '', status: '' });
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    let tempErrors = {};
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      tempErrors.email = 'Email harus valid';
    }
    if (!/^[0-9]{16}$/.test(formData.nik)) {
      tempErrors.nik = 'NIK harus berisi 16 digit angka';
    }
    if (!/^[0-9]{16}$/.test(formData.nokk)) {
      tempErrors.nokk = 'Nomor Kartu Keluarga harus berisi 16 digit angka';
    }
    if (!/^((\+62|08)[0-9]{9,})$/.test(formData.wa)) {
      tempErrors.wa = 'Nomor WA harus valid dan diawali +62 atau 08';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedUser) {
        await apiConnection.put(`/users/${selectedUser.id}`, formData);
        toast({ title: 'User berhasil diperbarui!', status: 'success' });
      }
      fetchUsers();
      onClose();
    } catch (err) {
      toast({
        title: 'Terjadi kesalahan!',
        description: err.response?.data?.error || 'Gagal menyimpan user.',
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

  return (
    <Box maxW="7xl" mx="auto" p={4}>
      <Heading as="h1" mb={6} textAlign="center">
        Daftar Pengguna
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Email</Th>
            <Th>Nama</Th>
            <Th>NIK</Th>
            <Th>Nomor Kartu Keluarga</Th>
            <Th>Nomor WA Aktif</Th>
            <Th>Status User</Th>
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
              <Td>{user.status}</Td>
              <Td>
                <Button colorScheme="yellow" size="sm" mr={2} onClick={() => { setSelectedUser(user); setFormData(user); onOpen(); }}>Edit</Button>
                <Button colorScheme="red" size="sm" onClick={() => handleDelete(user.id)}>Hapus</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalBody>
            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input name="email" value={formData.email} onChange={handleChange} />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={errors.nama}>
              <FormLabel>Nama</FormLabel>
              <Input name="nama" value={formData.nama} onChange={handleChange} />
            </FormControl>
            <FormControl mt={2} isInvalid={errors.nik}>
              <FormLabel>NIK</FormLabel>
              <Input name="nik" value={formData.nik} onChange={handleChange} />
              <FormErrorMessage>{errors.nik}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={errors.nokk}>
              <FormLabel>Nomor Kartu Keluarga</FormLabel>
              <Input name="nokk" value={formData.nokk} onChange={handleChange} />
              <FormErrorMessage>{errors.nokk}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={errors.wa}>
              <FormLabel>Nomor WA Aktif</FormLabel>
              <Input name="wa" value={formData.wa} onChange={handleChange} />
              <FormErrorMessage>{errors.wa}</FormErrorMessage>
            </FormControl>
            <FormControl mt={2} isInvalid={errors.status}>
              <FormLabel>Status</FormLabel>
              <Input name="status" value={formData.status} onChange={handleChange} />
              <FormErrorMessage>{errors.status}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>Simpan</Button>
            <Button onClick={onClose}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Users;
