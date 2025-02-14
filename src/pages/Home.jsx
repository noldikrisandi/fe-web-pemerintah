import React from 'react';
import { Box, Container, Button, Heading, Text, Stack, VStack, useBreakpointValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Home = () => {
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' }); // Responsif button size

  return (
    <Box as="section" bg="teal.500" color="white" py={20}>
      <Container maxW="7xl" textAlign="center">
        <VStack spacing={6}>
          <Heading as="h1" size="2xl" fontWeight="bold">
            Selamat Datang di Website Aspirasi Masyarakat
          </Heading>
          <Text fontSize="lg" maxW="xl" mx="auto">
            Kami mendengarkan suara Anda! Bagikan aspirasi Anda tentang masalah di lingkungan sekitar dan bantu
            membangun komunitas yang lebih baik.
          </Text>
          
          <Stack direction={['column', 'row']} spacing={4} justify="center">
            <Link to="/form-aspirasi">
              <Button
                colorScheme="orange"
                size={buttonSize}
                variant="solid"
                _hover={{ bg: 'orange.400' }}
              >
                Kirim Aspirasi
              </Button>
            </Link>
            <Link to="/semua-aspirasi">
              <Button
                colorScheme="teal"
                size={buttonSize}
                variant="outline"
                _hover={{ borderColor: 'teal.400', color: 'teal.400' }}
              >
                Lihat Semua Aspirasi
              </Button>
            </Link>
          </Stack>
        </VStack>
      </Container>

      <Box bg="teal.600" py={8} mt={16}>
        <Container maxW="7xl" textAlign="center">
          <Text fontSize="xl">
            Bersama, kita bisa menciptakan perubahan yang berarti! Mari berbagi aspirasi dan berbicara untuk perubahan.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
