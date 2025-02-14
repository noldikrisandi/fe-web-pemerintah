import React from 'react';
import { Box, Container, Heading, Text, Button, useBreakpointValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' }); // Responsif ukuran tombol

  return (
    <Box as="section" bg="gray.800" color="white" py={20}>
      <Container maxW="lg" textAlign="center">
        <Heading as="h1" size="4xl" fontWeight="bold" color="red.500">
          404
        </Heading>
        <Text fontSize="xl" color="gray.300" mb={6}>
          Halaman yang Anda cari tidak ditemukan. Mungkin linknya salah atau halaman sudah tidak ada.
        </Text>
        <Link to="/">
          <Button
            colorScheme="teal"
            size={buttonSize}
            variant="solid"
            _hover={{ bg: 'teal.400' }}
          >
            Kembali ke Beranda
          </Button>
        </Link>
      </Container>
    </Box>
  );
};

export default NotFound;
