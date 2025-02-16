import { useState } from "react";
import { Box, FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import apiConnection from "../api/apiconnection";

const AddAspiration = () => {
  const [jenis, setJenis] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [desa, setDesa] = useState("");
  const [status, setStatus] = useState("Menunggu");
  const [statusKeterangan, setStatusKeterangan] = useState("");
  const [urlFoto, setUrlFoto] = useState("");
  const [urlProposal, setUrlProposal] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  // Fungsi untuk generate ID otomatis
  const generateId = () => {
    const now = new Date();
    const timestamp =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0") +
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0");
    const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase();
    return timestamp + randomStr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate ID jika tidak ada ID yang diinput
    const newAspiration = {
      id: generateId(), // Pastikan ID selalu dihasilkan
      jenis,
      keterangan,
      kecamatan,
      desa,
      status,
      keterangan_status: statusKeterangan,
      url_foto: urlFoto,
      url_proposal: urlProposal,
    };

    try {
      const response = await apiConnection.post("/aspirations", newAspiration);

      if (response.status === 200) {
        toast({
          title: "Berhasil",
          description: "Aspirasi berhasil ditambahkan.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Alihkan ke halaman AspirasiList setelah sukses
        navigate("/aspirations");
      }
    } catch (error) {
      console.error("Gagal mengirim data:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengirim data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Jenis Aspirasi</FormLabel>
          <Input
            type="text"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Keterangan</FormLabel>
          <Input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Kecamatan</FormLabel>
          <Input
            type="text"
            value={kecamatan}
            onChange={(e) => setKecamatan(e.target.value)}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Desa</FormLabel>
          <Input
            type="text"
            value={desa}
            onChange={(e) => setDesa(e.target.value)}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Status</FormLabel>
          <Input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Keterangan Status</FormLabel>
          <Input
            type="text"
            value={statusKeterangan}
            onChange={(e) => setStatusKeterangan(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>URL Foto</FormLabel>
          <Input
            type="text"
            value={urlFoto}
            onChange={(e) => setUrlFoto(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>URL Proposal</FormLabel>
          <Input
            type="text"
            value={urlProposal}
            onChange={(e) => setUrlProposal(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" type="submit">
          Simpan
        </Button>
      </form>
    </Box>
  );
};

export default AddAspiration;
