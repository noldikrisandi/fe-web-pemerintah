import { useState, useEffect } from "react";
import {
  Box, Button, SimpleGrid, Text, Spinner, Image, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, VStack, HStack, Input, Textarea
} from "@chakra-ui/react";
import apiConnection from "../api/apiconnection";

const AspirasiSaya = () => {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState({ isOpen: false, url: "" });
  const [editModal, setEditModal] = useState({ isOpen: false, aspiration: null });
  const [editedData, setEditedData] = useState({
    jenis: "", kecamatan: "", desa: "", keterangan: "", url_foto: "", url_aspirasi: ""
  });

  const [weeklyAspirationsCount, setWeeklyAspirationsCount] = useState(0); 

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

      const countResponse = await apiConnection.get(`/aspirations/count/${userId}`);
      console.log("Jumlah Aspirasi Response:", countResponse.data); 
      setWeeklyAspirationsCount(countResponse.data.total_aspirations); 

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

  const openEditModal = (aspirasi) => {
    setEditedData({
      jenis: aspirasi.jenis,
      kecamatan: aspirasi.kecamatan,
      desa: aspirasi.desa,
      keterangan: aspirasi.keterangan,
      url_foto: aspirasi.url_foto || "",
      url_aspirasi: aspirasi.url_proposal || ""
    });
    setEditModal({ isOpen: true, aspiration: aspirasi });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, aspiration: null });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const updatedAspiration = { ...editModal.aspiration, ...editedData };
      await apiConnection.put(`/aspirations/${editModal.aspiration.id}`, updatedAspiration);
     
      setAspirations((prev) =>
        prev.map((aspirasi) =>
          aspirasi.id === editModal.aspiration.id ? updatedAspiration : aspirasi
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Gagal mengedit aspirasi:", error);
    }
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

  const isEditableStatus = (status) => {
    return !["Selesai", "Ditolak", "Diproses"].includes(status);
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
      <Box p={5} boxShadow="md" borderRadius="md" bg="white" mb={7}>
      <VStack spacing={5} mb={6} align="center">
        <Text fontSize="2xl" fontWeight="bold" color="teal.500">
          Aspirasi Saya
        </Text>
        <Text fontSize="md" color="gray.600" textAlign="center">
          Silakan kirimkan aspirasi Anda terkait masalah yang ada di lingkungan Anda.
        </Text>
        <Text fontSize="md" color="gray.700" textAlign="center"> Anda telah mengirim {weeklyAspirationsCount} aspirasi dalam 7 hari ini</Text>
      </VStack>
    </Box>

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
                {isEditableStatus(aspirasi.status) && (
                  <Button colorScheme="orange" size="sm" onClick={() => openEditModal(aspirasi)}>
                    Edit
                  </Button>
                )}
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={editModal.isOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Aspirasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              name="jenis"
              value={editedData.jenis}
              onChange={handleEditChange}
              placeholder="Jenis Aspirasi"
              mb={3}
            />
            <Input
              name="kecamatan"
              value={editedData.kecamatan}
              onChange={handleEditChange}
              placeholder="Kecamatan"
              mb={3}
            />
            <Input
              name="desa"
              value={editedData.desa}
              onChange={handleEditChange}
              placeholder="Desa"
              mb={3}
            />
            <Textarea
              name="keterangan"
              value={editedData.keterangan}
              onChange={handleEditChange}
              placeholder="Keterangan"
              mb={3}
            />
            <Input
              name="url_foto"
              value={editedData.url_foto}
              onChange={handleEditChange}
              placeholder="URL Foto"
              mb={3}
            />
            <Input
              name="url_aspirasi"
              value={editedData.url_aspirasi}
              onChange={handleEditChange}
              placeholder="URL Aspirasi"
              mb={3}
            />
            <Button colorScheme="blue" onClick={handleEditSubmit}>Simpan</Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={imageModal.isOpen} onClose={closeImageModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lihat Gambar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={imageModal.url} alt="Aspirasi Image" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AspirasiSaya;
