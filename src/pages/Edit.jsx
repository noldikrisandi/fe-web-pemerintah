import { useState, useEffect } from "react";
import {
  Box, Button, SimpleGrid, Text, Spinner, useToast, Image, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, useDisclosure, AlertDialog,
  AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from "@chakra-ui/react";
import apiConnection from "../api/apiconnection";

const EditAspirasi = () => {
  const [aspirations, setAspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState({ isOpen: false, url: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAspiration, setSelectedAspiration] = useState(null);
  const [jenis, setJenis] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [desa, setDesa] = useState("");
  const [status, setStatus] = useState("");
  const [statusKeterangan, setStatusKeterangan] = useState("");
  const [urlFoto, setUrlFoto] = useState("");
  const [urlProposal, setUrlProposal] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
    setJenis(aspiration.jenis);
    setKeterangan(aspiration.keterangan || "");
    setKecamatan(aspiration.kecamatan);
    setDesa(aspiration.Desa);
    setStatus(aspiration.status);
    setStatusKeterangan(aspiration.keterangan_status || "");
    setUrlFoto(aspiration.url_foto);
    setUrlProposal(aspiration.url_proposal || "");
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAspiration(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedAspiration) return;

    try {
      await apiConnection.put(`/aspirations/${selectedAspiration.id}`, {
        jenis,
        keterangan,
        kecamatan,
        Desa: desa,
        status,
        keterangan_status: statusKeterangan,
        url_foto: urlFoto,
        url_proposal: urlProposal,
      });

      setAspirations((prev) =>
        prev.map((asp) =>
          asp.id === selectedAspiration.id
            ? { ...asp, jenis, keterangan, kecamatan, Desa: desa, status, keterangan_status: statusKeterangan, url_foto: urlFoto, url_proposal: urlProposal }
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
        description: "Aspirasi berhasil diperbarui.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      closeEditModal();
    } catch (error) {
      console.error("Gagal memperbarui aspirasi:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await apiConnection.delete(`/aspirations/${deleteId}`);
      setAspirations((prev) => prev.filter((aspiration) => aspiration.id !== deleteId));

      toast({
        title: "Berhasil",
        description: "Aspirasi berhasil dihapus.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsDeleteOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Gagal menghapus aspirasi:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setDeleteId(null);
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
            borderWidth={1}
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

            {/* Edit and Delete Buttons */}
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => openEditModal(aspirasi)}
              width="full"
              mt={2}
              variant="outline"
            >
              Edit
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
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => openDeleteDialog(aspirasi.id)}
              width="full"
              mt={2}
              variant="outline"
            >
              Hapus
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

      {/* Modal Edit Aspirasi */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Aspirasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleUpdate}>
              <FormControl mb={4}>
                <FormLabel>Jenis</FormLabel>
                <Input
                  type="text"
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
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
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Desa</FormLabel>
                <Input
                  type="text"
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                />
              </FormControl>
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
              <Button colorScheme="teal" type="submit" width="full" mt={4}>
                Update
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Alert Dialog Hapus Aspirasi */}
      <AlertDialog isOpen={isDeleteOpen} onClose={closeDeleteDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Aspirasi
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus aspirasi ini?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="red" onClick={handleDelete}>
                Hapus
              </Button>
              <Button onClick={closeDeleteDialog} ml={3}>
                Batal
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default EditAspirasi;
