import { useState, useEffect } from "react";
import { 
  Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import apiConnection from '../api/apiconnection';

const generateId = () => {
  const now = new Date();
  const timestamp = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0");
  const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase();
  return timestamp + randomStr;
};

const kecamatanDonggala = [
  "Balaesang", "Balaesang Tanjung", "Banawa", "Banawa Selatan", "Banawa Tengah", 
  "Dampelas", "Labuan", "Pinembani", "Rio Pakava", "Sindue", "Sindue Tobata", 
  "Sindue Tombusabora", "Sirenja", "Sojol", "Sojol Utara", "Tanantovea"
];

const desaDonggala = {
  "Balaesang": ["Kampung Baru Sibayu", "Labean", "Lombonga", "Malino"],
  "Balaesang Tanjung": ["Kamonji", "Ketong", "Malei", "Manimbaya"],
  "Banawa": ["Loli Dondo", "Loli Oge", "Loli Pesua", "Loli Saluran"],
};

const FormAspirasi = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    Jenis: "",
    kecamatan: "",
    Desa: "",
    keterangan: "",
    url_foto: "",
    url_proposal: "",
    id_pengirim: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("id"); // Ambil ID dari localStorage
    setFormData((prev) => ({
      ...prev,
      id: generateId(),
      id_pengirim: storedUserId || "", // Pastikan ID Pengirim diisi dari localStorage
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "kecamatan" && { Desa: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Jenis || !formData.kecamatan || !formData.Desa || !formData.keterangan) {
      toast({
        title: "Gagal!",
        description: "Harap isi semua bidang yang diperlukan.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validasi URL Foto dan URL Proposal
    if (formData.url_foto && !/^https?:\/\/[^\s]+$/.test(formData.url_foto)) {
      toast({
        title: "URL Foto tidak valid",
        description: "Pastikan URL Foto diawali dengan http:// atau https://",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.url_proposal && !/^https?:\/\/[^\s]+$/.test(formData.url_proposal)) {
      toast({
        title: "URL Proposal tidak valid",
        description: "Pastikan URL Proposal diawali dengan http:// atau https://",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await apiConnection.post("/aspirations", formData);
      toast({
        title: "Sukses!",
        description: "Aspirasi berhasil dikirim.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/semuaaspirasi");
    } catch (err) {
      console.error("Error saat mengirim data:", err);
      toast({
        title: "Gagal mengirim aspirasi!",
        description: err.response?.data?.error || "Terjadi kesalahan. Coba lagi nanti.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="500px" mx="auto" p={4} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit} autoComplete="off">
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>ID Aspirasi</FormLabel>
            <Input name="id" value={formData.id} isReadOnly />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Jenis Aspirasi</FormLabel>
            <Select name="Jenis" value={formData.Jenis} onChange={handleChange}>
              <option value="">Pilih Jenis Aspirasi</option>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="Lingkungan">Lingkungan</option>
              <option value="Sosial">Sosial</option>
              <option value="Lainnya">Lainnya</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Kecamatan</FormLabel>
            <Select name="kecamatan" value={formData.kecamatan} onChange={handleChange}>
              <option value="">Pilih Kecamatan</option>
              {kecamatanDonggala.map((kec) => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Desa/Kelurahan</FormLabel>
            <Select 
              name="Desa" 
              value={formData.Desa} 
              onChange={handleChange} 
              disabled={!formData.kecamatan}
            >
              <option value="">Pilih Desa/Kelurahan</option>
              {desaDonggala[formData.kecamatan]?.map((desa) => (
                <option key={desa} value={desa}>{desa}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Keterangan</FormLabel>
            <Textarea name="keterangan" value={formData.keterangan} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>URL Foto</FormLabel>
            <Input name="url_foto" type="url" value={formData.url_foto} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>URL Proposal</FormLabel>
            <Input name="url_proposal" type="url" value={formData.url_proposal} onChange={handleChange} />
          </FormControl>

          <FormControl hidden>
            <FormLabel>ID Pengirim</FormLabel>
            <Input name="id_pengirim" value={formData.id_pengirim} isReadOnly />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">Kirim Aspirasi</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default FormAspirasi;
