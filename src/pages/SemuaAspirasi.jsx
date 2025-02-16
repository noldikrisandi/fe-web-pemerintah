import { useState, useEffect } from "react";
import {
  Box, Button, SimpleGrid, Text, Spinner, Image, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, VStack, HStack, Divider
} from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import apiConnection from "../api/apiconnection";

const SemuaAspirasi = () => {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState({ isOpen: false, url: "" });
  const [statusStats, setStatusStats] = useState({});

  useEffect(() => {
    const fetchAspirations = async () => {
      try {
        const response = await apiConnection.get("/aspirations");
        const data = response.data.data;

        const stats = {
          total: data.length,
          menunggu: data.filter((item) => item.status === "Menunggu").length,
          diproses: data.filter((item) => item.status === "Diproses").length,
          pending: data.filter((item) => item.status === "Pending").length,
          selesai: data.filter((item) => item.status === "Selesai").length,
          ditolak: data.filter((item) => item.status === "Ditolak").length,
          tanpaStatus: data.filter((item) => !item.status || item.status.trim() === "").length,
        };

        setStatusStats(stats);
        
        const statusOrder = ["", "Menunggu", "Diproses", "Pending", "Selesai", "Ditolak"];
        data.sort((a, b) => statusOrder.indexOf(a.status || "") - statusOrder.indexOf(b.status || ""));
        
        setAspirations(data);
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

  if (loading) {
    return <Spinner size="xl" />;
  }

  const getStatusBorderColor = (status) => {
    switch (status) {
      case "Menunggu": return "#FFC107";
      case "Diproses": return "#2196F3";
      case "Pending": return "#FF9800";
      case "Selesai": return "#4CAF50";
      case "Ditolak": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  const pieData = [
    { name: `Tanpa Status (${statusStats.tanpaStatus})`, value: statusStats.tanpaStatus, color: "#9E9E9E" },
    { name: `Menunggu (${statusStats.menunggu})`, value: statusStats.menunggu, color: "#FFC107" },
    { name: `Diproses (${statusStats.diproses})`, value: statusStats.diproses, color: "#2196F3" },
    { name: `Pending (${statusStats.pending})`, value: statusStats.pending, color: "#FF9800" },
    { name: `Selesai (${statusStats.selesai})`, value: statusStats.selesai, color: "#4CAF50" },
    { name: `Ditolak (${statusStats.ditolak})`, value: statusStats.ditolak, color: "#F44336" },
  ].filter((item) => item.value > 0);

  return (
    <Box p={5}>
      <VStack spacing={5} mb={6} align="center" p={5} bg="gray.100" borderRadius="lg">
        <Text fontSize="xl" fontWeight="bold">Total Aspirasi : {statusStats.total}</Text>
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend/>
        </PieChart>
      </VStack>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {aspirations.map((aspirasi) => (
          <Box
            key={aspirasi.id}
            p={5}
            borderWidth={2}
            borderColor={getStatusBorderColor(aspirasi.status)}
            borderRadius="lg"
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
              {aspirasi.Desa}, {aspirasi.kecamatan}
            </Text>
            <Text color="gray.600" fontWeight="bold" mb={2}>
              Status: {aspirasi.status || "Tanpa Status"}
            </Text>
            <Text color="gray.500" mb={4}>
              {aspirasi.keterangan_status}
            </Text>
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

export default SemuaAspirasi;
