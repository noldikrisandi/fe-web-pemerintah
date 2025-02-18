import { useState, useEffect } from "react";
import {
  Box, Button, SimpleGrid, Text, Spinner, VStack
} from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import apiConnection from "../api/apiconnection";

const SemuaAspirasi = () => {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusStats, setStatusStats] = useState({});

  useEffect(() => {
    const fetchAspirations = async () => {
      try {
        const response = await apiConnection.get("/aspirations");
        const data = response.data.data;

        const groupedAspirations = {};
        const statuses = ["", "Menunggu", "Diproses", "Pending", "Selesai", "Ditolak"];

        statuses.forEach(status => {
          groupedAspirations[status] = data.filter(item => item.status === status).slice(0, 3);
        });

        setAspirations(Object.values(groupedAspirations).flat());
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAspirations();
  }, []);

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

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={5}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {aspirations.map((aspirasi) => (
          <Box
            key={aspirasi.id}
            p={5}
            borderWidth={2}
            borderColor={getStatusBorderColor(aspirasi.status)}
            borderRadius="lg"
            boxShadow="md"
            bg="white"
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
            <Text color="gray.500" mb={4}>
              {aspirasi.keterangan_status}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default SemuaAspirasi;
