import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Stack,
  Link,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login");
  };

  return (
    <Box as="header" bg="teal.500" p={4}>
      <Flex justify="space-between" align="center">
       
        <Box color="white" fontWeight="bold" fontSize="xl">
          Donggala APP
        </Box>

        
        <Flex display={{ base: "none", md: "flex" }} gap={4} align="center">
          <Link color="white" href="/">Beranda</Link>
          <Link color="white" href="/inputaspirasi">Form Aspirasi</Link>
          <Link color="white" href="/semuaaspirasi">Semua Aspirasi</Link>
          <Link color="white" href="/aspirasisaya">Aspirasi Saya</Link>
          <Link color="white" href="/profil">Profil</Link>
          <Button colorScheme="red" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>

        {/* humburger untuk mobile */}
        <IconButton
          aria-label="Open Menu"
          icon={<HamburgerIcon />}
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
          color="white"
        />
      </Flex>

      <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Pilih Menu</DrawerHeader>

          <DrawerBody>
            <Stack spacing={4}>
              <Link color="teal.500" href="/">Beranda</Link>
              <Link color="teal.500" href="/inputaspirasi">Form Aspirasi</Link>
              <Link color="teal.500" href="/semuaaspirasi">Semua Aspirasi</Link>
              <Link color="white" href="/aspirasisaya">Aspirasi Saya</Link>
              <Link color="teal.500" href="/profil">Profil</Link>
              <Button colorScheme="red" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
