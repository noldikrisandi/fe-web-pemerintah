import { useState, useEffect } from "react";
import {
  Box, Button, SimpleGrid, Text, Spinner, useToast, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Select, Input, useDisclosure, Image
} from "@chakra-ui/react";
import apiConnection from "../api/apiconnection";

const AspirasiList = () => {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState({ isOpen: false, url: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAspiration, setSelectedAspiration] = useState(null);
  const [status, setStatus] = useState("");
  const [statusKeterangan, setStatusKeterangan] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchAspirations = async () => {
      try {
        const response = await apiConnection.get("/aspirations");
        const sortedAspirations = response.data.data.sort((a, b) => {
          const order = ["", "Menunggu", "Diproses", "Pending", "Selesai"];
          const indexA = order.indexOf(a.status) !== -1 ? order.indexOf(a.status) : order.length;
          const indexB = order.indexOf(b.status) !== -1 ? order.indexOf(b.status) : order.length;
          return indexA - indexB;
        });
        setAspirations(sortedAspirations);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAspirations();
  }, []);

  const openImageModal = (url) => {
    setImageModal({ isOpen: true, url });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, url: "" });
  };

  const openEditModal = (aspiration) => {
    setSelectedAspiration(aspiration);
    setStatus(aspiration.status);
    setStatusKeterangan(aspiration.keterangan_status || "");
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAspiration(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!selectedAspiration) return;

    try {
      await apiConnection.put(`/aspirations/${selectedAspiration.id}`, {
        status,
        keterangan_status: statusKeterangan,
      });

      setAspirations((prev) =>
        prev.map((asp) =>
          asp.id === selectedAspiration.id
            ? { ...asp, status, keterangan_status: statusKeterangan }
            : asp
        ).sort((a, b) => {
          const order = ["", "Menunggu", "Diproses", "Pending", "Selesai"];
          const indexA = order.indexOf(a.status) !== -1 ? order.indexOf(a.status) : order.length;
          const indexB = order.indexOf(b.status) !== -1 ? order.indexOf(b.status) : order.length;
          return indexA - indexB;
        })
      );

      toast({
        title: "Berhasil",
        description: "Status aspirasi berhasil diperbarui.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      closeEditModal();
    } catch (error) {
      console.error("Gagal memperbarui status aspirasi:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  const getBoxColor = (status) => {
    switch (status) {
      case "Ditolak":
        return "red.200"; // Merah jika ditolak
      case "Selesai":
        return "green.200"; // Hijau jika selesai
      case "Pending":
        return "blue.200"; // Biru jika pending
      case "Diproses":
        return "yellow.200"; // Kuning jika diproses
      default:
        return "white"; // Putih jika menunggu
    }
  };

  return (
    <Box p={5}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {aspirations.map((aspirasi) => (
          <Box
          key={aspirasi.id}
          p={5}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="md"
          _hover={{ boxShadow: "xl", transform: "scale(1.05)", transition: "all 0.3s ease" }}
          bg="white"
          borderColor={
            aspirasi.status === "Ditolak"
              ? "red.500"
              : aspirasi.status === "Selesai"
              ? "green.500"
              : aspirasi.status === "Pending"
              ? "blue.500"
              : aspirasi.status === "Diproses"
              ? "yellow.500"
              : "gray.200"  // Menunggu tetap dengan border abu-abu
          }
          transition="all 0.3s ease"
        >
          <Text
            fontWeight="bold"
            fontSize="lg"
            color={
              aspirasi.status === "Ditolak"
                ? "red.500"
                : aspirasi.status === "Selesai"
                ? "green.500"
                : aspirasi.status === "Pending"
                ? "blue.500"
                : aspirasi.status === "Diproses"
                ? "yellow.500"
                : "gray.600"  // Menunggu tetap dengan warna teks abu-abu
            }
            mb={2}
          >
            Token: {aspirasi.id}
          </Text>
          <Text fontWeight="semibold" color="gray.700" mb={2}>
            {aspirasi.jenis}
          </Text>
          <Text color="gray.600" mb={2}>
            {aspirasi.keterangan}
          </Text>
          <Text color="gray.500" fontStyle="italic" mb={2}>
            {aspirasi.Desa}, {aspirasi.kecamatan}
          </Text>
          <Text color="gray.600" fontWeight="bold" mb={2}>
            Status: {aspirasi.status}
          </Text>
          <Text color="gray.500" mb={4}>
            {aspirasi.keterangan_status}
          </Text>
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => openImageModal(aspirasi.url_foto)}
            width="full"
            variant="outline"
          >
            Lihat Gambar
          </Button>
        
          {/* Lihat Proposal Button */}
          {aspirasi.url_proposal && (
            <Button
              colorScheme="purple"
              size="sm"
              onClick={() => window.open(aspirasi.url_proposal, "_blank")}
              width="full"
              mt={2}
              variant="outline"
            >
              Lihat Proposal
            </Button>
          )}
        
          {/* Edit Status and Keterangan Status */}
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => openEditModal(aspirasi)}
            width="full"
            mt={2}
            variant="outline"
          >
            Edit Status
          </Button>
        </Box>
        
        ))}
      </SimpleGrid>

      {/* Modal Lihat Gambar */}
      <Modal isOpen={imageModal.isOpen} onClose={closeImageModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lihat Gambar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={imageModal.url} alt="Foto Aspirasi" />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal Edit Status dan Keterangan Status */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Status dan Keterangan Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleUpdateStatus}>
              <FormControl mb={4}>
                <FormLabel>Status</FormLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Pending">Pending</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Ditolak">Ditolak</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Keterangan Status</FormLabel>
                <Input
                  type="text"
                  value={statusKeterangan}
                  onChange={(e) => setStatusKeterangan(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="teal" type="submit" width="full" mt={4}>
                Update Status
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AspirasiList;
