import { useState, useEffect } from "react";
import {
  Box, Button, SimpleGrid, Text, Spinner, useToast, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Select, Input, Image
} from "@chakra-ui/react";
import apiConnection from "../api/apiconnection";

const AspirasiList = () => {
  const [aspirations, setAspirations] = useState([]);
  const [filteredAspirations, setFilteredAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState({ isOpen: false, url: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAspiration, setSelectedAspiration] = useState(null);
  const [status, setStatus] = useState("");
  const [statusKeterangan, setStatusKeterangan] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchAspirations = async () => {
      try {
        const response = await apiConnection.get("/aspirations");
        const sortedAspirations = response.data.data.map((aspirasi) => {
          if (!aspirasi.status) {
            aspirasi.status = "Belum Dikerjakan";
          }
          return aspirasi;
        }).sort((a, b) => {
          const order = ["", "Belum Dikerjakan", "Diproses", "Pending", "Selesai"];
          const indexA = order.indexOf(a.status) !== -1 ? order.indexOf(a.status) : order.length;
          const indexB = order.indexOf(b.status) !== -1 ? order.indexOf(b.status) : order.length;
          return indexA - indexB;
        });
        setAspirations(sortedAspirations);
        setFilteredAspirations(sortedAspirations);
      } catch (error) {
        console.error("Error fetching aspirations:", error);
        toast({
          title: "Error",
          description: "There was an issue fetching aspirations. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAspirations();
  }, []);

  const openImageModal = (url) => setImageModal({ isOpen: true, url });
  const closeImageModal = () => setImageModal({ isOpen: false, url: "" });

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
          const order = ["", "Belum Dikerjakan", "Diproses", "Pending", "Selesai"];
          const indexA = order.indexOf(a.status) !== -1 ? order.indexOf(a.status) : order.length;
          const indexB = order.indexOf(b.status) !== -1 ? order.indexOf(b.status) : order.length;
          return indexA - indexB;
        })
      );

      toast({
        title: "Success",
        description: "Status updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      closeEditModal();
    } catch (error) {
      console.error("Error updating aspiration status:", error);
      toast({
        title: "Failed",
        description: "There was an error updating the status. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatus(e.target.value);
    filterAspirations(e.target.value, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterAspirations(status, e.target.value);
  };

  const filterAspirations = (status, searchQuery) => {
    let filtered = [...aspirations];

    if (status) {
      filtered = filtered.filter((asp) => asp.status === status);
    }

    if (searchQuery) {
      filtered = filtered.filter((asp) =>
        asp.jenis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asp.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asp.desa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asp.kecamatan.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAspirations(filtered);
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  const getBoxColor = (status) => {
    switch (status) {
      case "Belum Dikerjakan":
        return "gray.500";
      case "Ditolak":
        return "red.500";
      case "Selesai":
        return "green.500";
      case "Pending":
        return "yellow.500";
      case "Diproses":
        return "blue.500";
      default:
        return "white";
    }
  };

  return (
    <Box p={5}>
      <FormControl mb={4}>
        <FormLabel>Status</FormLabel>
        <Select value={status} onChange={handleStatusFilterChange}>
          <option value="">Semua</option>
          <option value="Belum Dikerjakan">Belum Dikerjakan</option>
          <option value="Diproses">Diproses</option>
          <option value="Pending">Pending</option>
          <option value="Selesai">Selesai</option>
          <option value="Ditolak">Ditolak</option>
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Pencarian</FormLabel>
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Cari berdasarkan jenis, keterangan, desa, atau kecamatan"
        />
      </FormControl>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {filteredAspirations.map((aspirasi) => (
          <Box
            key={aspirasi.id}
            p={5}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="md"
            _hover={{ boxShadow: "xl", transform: "scale(1.05)", transition: "all 0.3s ease" }}
            bg="white"
            borderColor={getBoxColor(aspirasi.status)}
            transition="all 0.3s ease"
          >
            <Text  color={getBoxColor(aspirasi.status)} fontWeight="bold" fontSize="xl" mb={2}>
              {aspirasi.status}
            </Text>
            <Text fontWeight="bold" fontSize="lg" color={getBoxColor(aspirasi.status)} mb={2}>
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

            {aspirasi.url_proposal && (
              <Button
                colorScheme="purple"
                size="sm"
                onClick={() => window.open(aspirasi.url_proposal, "_blank")}
                width="full"
                variant="outline"
                mt={2}
              >
                Lihat Proposal
              </Button>
            )}

            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => openEditModal(aspirasi)}
              width="full"
              variant="outline"
              mt={2}
            >
              Edit Status
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      {/* modal edit*/}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Status Aspirasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                <option value="Diproses">Diproses</option>
                <option value="Pending">Pending</option>
                <option value="Selesai">Selesai</option>
                <option value="Ditolak">Ditolak</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Keterangan</FormLabel>
              <Input
                value={statusKeterangan}
                onChange={(e) => setStatusKeterangan(e.target.value)}
                placeholder="Keterangan tambahan"
              />
            </FormControl>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleUpdateStatus}
              width="full"
            >
              Update Status
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* modal untuk lihat gambar*/}
      <Modal isOpen={imageModal.isOpen} onClose={closeImageModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lihat Gambar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={imageModal.url} alt="Aspiration Image" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AspirasiList;
