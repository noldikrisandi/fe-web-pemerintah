import { useState, useEffect } from "react";
import {
  Box, Icon, Spinner, Text, VStack, Stack
} from "@chakra-ui/react";
import { FaEdit, FaList, FaUser } from "react-icons/fa";
import apiConnection from "../api/apiconnection";
import SemuaAspirasi from "./AspirasiForHome";

const Home = () => {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAspirations = async () => {
      try {
        const response = await apiConnection.get("/aspirations");
        const data = response.data.data;

        // urutkan status
        const statusOrder = ["", "Menunggu", "Diproses", "Pending", "Selesai", "Ditolak"];

        const groupedAspirations = {};
        statusOrder.forEach((status) => (groupedAspirations[status] = []));
        data.forEach((aspirasi) => {
          const status = aspirasi.status || "Tanpa Status";
          if (!groupedAspirations[status]) {
            groupedAspirations[status] = [];
          }
          if (groupedAspirations[status].length < 3) {
            groupedAspirations[status].push(aspirasi);
          }
        });

        const filteredAspirations = statusOrder
          .filter((status) => groupedAspirations[status].length > 0)
          .flatMap((status) => groupedAspirations[status]);

        setAspirations(filteredAspirations);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAspirations();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  const userName = localStorage.getItem('userName');

  return (
    <Box p={1} maxW="container.xl" mx="auto">
      
      <Box textAlign="center" mb={6} p={4} bg="blue.50" borderRadius="lg" boxShadow="md">
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="teal.600">
          Selamat datang, {userName ? userName : "Pengguna!"}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mt={2}>
          Terima kasih telah menggunakan Donggala APP. Mari berkontribusi dengan menyampaikan aspirasi Anda!
        </Text>
      </Box>

      <Box p={5} borderRadius="lg" boxShadow="md" bg="gray.50">
        <VStack spacing={4} align="start">
          <Text fontSize="lg" fontWeight="bold" color="teal.600">
            Panduan Penggunaan Donggala APP
          </Text>

          <Stack spacing={3} direction={{ base: "column", md: "row" }}>
            <Box display="flex" alignItems="center">
              <Icon as={FaEdit} color="blue.500" mr={2} />
              <Text fontSize="sm">
                Untuk memberikan aspirasi, pilih{" "}
                <Text as="span" fontWeight="bold" color="blue.600">
                  Form Aspirasi
                </Text>.
              </Text>
            </Box>

            <Box display="flex" alignItems="center">
              <Icon as={FaList} color="green.500" mr={2} />
              <Text fontSize="sm">
                Untuk melihat semua aspirasi, pilih{" "}
                <Text as="span" fontWeight="bold" color="green.600">
                  Semua Aspirasi
                </Text>.
              </Text>
            </Box>

            <Box display="flex" alignItems="center">
              <Icon as={FaList} color="yellow.500" mr={2} />
              <Text fontSize="sm">
                Untuk melihat aspirasi Anda, pilih{" "}
                <Text as="span" fontWeight="bold" color="yellow.600">
                  Aspirasi Saya
                </Text>.
              </Text>
            </Box>

            <Box display="flex" alignItems="center">
              <Icon as={FaUser} color="purple.500" mr={2} />
              <Text fontSize="sm">
                Untuk melihat profil, pilih{" "}
                <Text as="span" fontWeight="bold" color="purple.600">
                  Profil
                </Text>.
              </Text>
            </Box>
          </Stack>
        </VStack>
      </Box>

      <Box textAlign="center" p={3} bg="gray.50" borderRadius="md" boxShadow="sm" mt={6}>
        <Text fontSize="sm" color="gray.600">
          Di halaman ini, kami hanya menampilkan sebagian aspirasi yang telah diajukan oleh semua pengguna.
        </Text>
      </Box>

      <SemuaAspirasi aspirations={aspirations} />
    </Box>
  );
};

export default Home;
