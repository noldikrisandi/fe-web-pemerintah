import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import apiConnection from "../api/apiconnection";

const AdminControllerList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiConnection.get("/admincontrollers");
        console.log(response.data);
        setData(response.data);
      } catch (err) {
        setError("Gagal mengambil data.");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Box maxW="4xl" mx="auto" mt={10} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
      <Heading size="lg" mb={5}>Data Admin Controller</Heading>

      {loading && <Spinner />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID Admin</Th>
              <Th>ID Aspirasi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.idadmin}</Td>
                  <Td>{item.idaspirasi}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="2" textAlign="center">
                  Tidak ada data tersedia
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default AdminControllerList;
