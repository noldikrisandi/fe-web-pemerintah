import { useState, useEffect } from "react";
import {
  Box, Button, SimpleGrid, Text, Spinner, Image, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, VStack, HStack
} from "@chakra-ui/react";
import apiConnection from "../api/apiconnection";

const AspirasiSaya = () => {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState({ isOpen: false, url: "" });

  // Ambil ID user dari localStorage
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchMyAspirations = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiConnection.get(`/aspirations/user/${userId}`);
        const statusOrder = {
          "": 1,
          "Menunggu": 2,
          "Diproses": 3,
          "Pending": 4,
          "Selesai": 5,
          "Ditolak": 6
        };
        let sortedData = response.data.data.sort((a, b) => {
          return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        });
        setAspirations(sortedData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAspirations();
  }, [userId]);

  const openImageModal = (url) => {
    setImageModal({ isOpen: true, url });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, url: "" });
  };

  const getBorderColor = (status) => {
    switch (status) {
      case "Selesai":
        return "green.400";
      case "Diproses":
        return "blue.400";
      case "Ditolak":
        return "red.400";
      case "Pending":
        return "yellow.400";
      default:
        return "gray.300";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={5}>
      <VStack spacing={5} mb={6} align="center">
        <Text fontSize="xl" fontWeight="bold">Aspirasi Saya</Text>
      </VStack>

      {!userId ? (
        <Text textAlign="center" fontSize="lg" color="red.500">
          Anda belum login. Silakan login terlebih dahulu.
        </Text>
      ) : aspirations.length === 0 ? (
        <Text textAlign="center" fontSize="lg" color="gray.500">
          Belum ada aspirasi yang diajukan.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {aspirations.map((aspirasi) => (
            <Box
              key={aspirasi.id}
              p={5}
              borderWidth={2}
              borderRadius="lg"
              borderColor={getBorderColor(aspirasi.status)}
              boxShadow="md"
              _hover={{ boxShadow: "xl", transform: "scale(1.05)", transition: "all 0.3s ease" }}
              bg="white"
              transition="all 0.3s ease"
            >
              <Text fontWeight="bold" fontSize="lg" color="teal.500" mb={2}>
                Token: {aspirasi.id}
              </Text>
              <Text fontWeight="semibold" color="gray.700" mb={2}>
                {aspirasi.jenis}
              </Text>
              <Text color="gray.600" mb={2}>
                {aspirasi.keterangan}
              </Text>
              <Text color="gray.500" fontStyle="italic" mb={2}>
                {aspirasi.desa}, {aspirasi.kecamatan}
              </Text>
              <Text color="gray.600" fontWeight="bold" mb={2}>
                Status: {aspirasi.status || "Tanpa Status"}
              </Text>
              {aspirasi.keterangan_status && (
                <Text color="gray.600" mb={2}>
                  {aspirasi.keterangan_status}
                </Text>
              )}
              <HStack spacing={2} mt={4}>
                {aspirasi.url_foto && (
                  <Button colorScheme="blue" size="sm" onClick={() => openImageModal(aspirasi.url_foto)}>
                    Lihat Gambar
                  </Button>
                )}
                {aspirasi.url_proposal && (
                  <Button colorScheme="green" size="sm" as="a" href={aspirasi.url_proposal} target="_blank" rel="noopener noreferrer">
                    Lihat Proposal
                  </Button>
                )}
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={imageModal.isOpen} onClose={closeImageModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gambar Aspirasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={imageModal.url} alt="Aspirasi" w="100%" borderRadius="md" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AspirasiSaya;
