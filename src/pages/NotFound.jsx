import React from 'react';
import { Box, Container, Heading, Text, Button, useBreakpointValue, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  return (
    <Box as="section" bg="gray.800" color="white" py={{ base: 16, md: 20 }} px={4}>
      <Container maxW="lg" textAlign="center">
        <VStack spacing={6}>
          <Heading as="h1" size="4xl" fontWeight="extrabold" color="red.500">
            404
          </Heading>
          <Text fontSize="xl" color="gray.300" maxW="lg" mx="auto">
            Halaman yang Anda cari tidak ditemukan. Mungkin linknya salah atau halaman sudah tidak ada.
          </Text>
          <Link to="/">
            <Button
              colorScheme="teal"
              size={buttonSize}
              variant="solid"
              _hover={{ bg: 'teal.400' }}
              px={{ base: 6, md: 8 }}
              py={6}
            >
              Kembali ke Beranda
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFound;
