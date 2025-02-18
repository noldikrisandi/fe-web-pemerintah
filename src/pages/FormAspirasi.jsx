import { useState, useEffect } from "react";
import {
  Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast, Text
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
  "Balaesang": [
    "Kampung Baru Sibayu", "Labean", "Lombonga", "Malino", "Tanjung Batu",
    "Siney", "Balaesang", "Baluase", "Sombori", "Sigi", "Poreang"
  ],
  "Balaesang Tanjung": [
    "Kamonji", "Ketong", "Malei", "Manimbaya", "Sibaju", "Tonggo",
    "Makmur", "Tanjung Makmur", "Tanjung Satu", "Tanjung Dua"
  ],
  "Banawa": [
    "Loli Dondo", "Loli Oge", "Loli Pesua", "Loli Saluran", "Banawa",
    "Tanjung Banawa", "Seke", "Loli Selatan", "Banawa Barat", "Banawa Timur"
  ],
  "Banawa Selatan": [
    "Banawa Selatan", "Banawa Selatan Barat", "Banawa Selatan Timur", "Banawa Selatan Utara",
    "Banawa Selatan Laut", "Banawa Selatan Daya"
  ],
  "Banawa Tengah": [
    "Banawa Tengah", "Banawa Tengah Barat", "Banawa Tengah Timur", "Banawa Tengah Utara",
    "Banawa Tengah Selatan", "Banawa Tengah Laut", "Banawa Tengah Daya"
  ],
  "Dampelas": [
    "Kambayang", "Talaga", "Sabang", "Sioyong", "Karya Mukti", "Parisan Agung",
    "Mukti Agung", "Budi Mukti", "Pani'i", "Ponggerang", "Malonas", "Rerang",
    "Lembah Mukti"
  ],
  "Labuan": [
    "Labuan", "Labuan Barat", "Labuan Timur", "Labuan Utara", "Labuan Selatan",
    "Labuan Tengah", "Labuan Barat Laut", "Labuan Timur Laut", "Labuan Utara Laut",
    "Labuan Selatan Laut", "Labuan Tengah Laut"
  ],
  "Pinembani": [
    "Gimpubia", "Gumpang", "Gumpang Barat", "Gumpang Timur", "Gumpang Utara", "Pulai",
    "Tano", "Pasei", "Sawer"
  ],
  "Rio Pakava": [
    "Tampo", "Limbo", "Paci", "Lumban", "Matakara", "Bulan", "Sero", "Pakon", "Jambo",
    "Sionbualu"
  ],
  "Sindue": [
    "Puskesmas Sindue", "Sindue Dodo", "Lowe", "Lau", "Sinombu", "Siotapina"
  ],
  "Sindue Tobata": [
    "Sindue", "Tobata", "Palanto", "Bumbung", "Bulu", "Uji", "Tona", "Lumpe", "Ponu",
    "Cilele"
  ],
  "Sindue Tombusabora": [
    "Tombusabora", "Moa", "Asra", "Lumpung", "Sere", "Alang-alang", "Lembang"
  ],
  "Sirenja": [
    "Sirenja", "Sere", "Badu", "Bunde", "Sawal", "Momboy"
  ],
  "Sojol": [
    "Sojol", "Banyu", "Seru", "Pombo", "Pondoke", "Labuan"
  ],
  "Sojol Utara": [
    "Banggai", "Santan", "Lebui", "Palawa", "Tatu", "Sijuli"
  ],
  "Tanantovea": [
    "Tovea", "Paku", "Ulu Tovea", "Sirombu", "Sodiki", "Dungga", "Rokan"
  ]
};


const FormAspirasi = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    Jenis: "",
    kecamatan: "",
    desa: "",
    keterangan: "",
    url_foto: "",
    url_proposal: "",
    id_pengirim: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("id"); 
    console.log("User ID from localStorage:", storedUserId);  
    setFormData((prev) => ({
      ...prev,
      id: generateId(),
      id_pengirim: storedUserId || "", 
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "kecamatan" && { desa: "" }), 
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      
      const response = await apiConnection.post("/aspirations", formData);
  
      toast({
        title: "Sukses!",
        description: "Aspirasi berhasil dikirim.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/aspirasisaya");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Terjadi kesalahan. Coba lagi nanti.";
      if (errorMessage.includes("Anda hanya dapat mengirim 2 aspirasi")) {
        toast({
          title: "Batas Aspirasi Tercapai",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Gagal mengirim aspirasi!",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  
  
  
  
  

  return (
    <Box maxW="500px" mx="auto" p={4} borderWidth={1} borderRadius="lg">
      <Box
        p={4}
        borderRadius="md"
        boxShadow="md"
        textAlign="center"
        mb={6}
      >
        <VStack spacing={2}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="teal.800"
            letterSpacing="wider"
          >
            Anda hanya bisa memberikan 2 Aspirasi dalam satu minggu
          </Text>
          <Text color="gray.600" fontSize="sm">
            Harap perhatikan batasan ini untuk menjaga kualitas aspirasi yang diterima.
          </Text>
        </VStack>
      </Box>
      <form onSubmit={handleSubmit} autoComplete="off">
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Token Aspirasi</FormLabel>
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
              <option value="Pendidikan">Pendidikan</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Keamanan">Keamanan</option>
              <option value="Transportasi">Transportasi</option>
              <option value="Perumahan">Perumahan</option>
              <option value="Ketenagakerjaan">Ketenagakerjaan</option>
              <option value="Pemberdayaan Masyarakat">Pemberdayaan Masyarakat</option>
              <option value="Hukum">Hukum</option>
              <option value="Teknologi">Teknologi</option>
              <option value="Budaya">Budaya</option>
              <option value="UMKM">UMKM</option>
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
              name="desa" 
              value={formData.desa} 
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
