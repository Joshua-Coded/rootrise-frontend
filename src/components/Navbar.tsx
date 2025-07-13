"use client";
import { HamburgerIcon } from "@chakra-ui/icons";
import { usePathname, useRouter } from "next/navigation";

import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isConnected = true; // Mock for UI preview

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
    ...(isConnected ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <Box
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(10px)"
      opacity={0.9}
    >
      <Container maxW="7xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <HStack
            spacing={3}
            cursor="pointer"
            onClick={() => router.push('/')}
            _hover={{ opacity: 0.8 }}
            transition="opacity 0.2s"
          >
            <Box
              w={10}
              h={10}
              bg="brand.500"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="bold"
              fontSize="lg"
            >
              R
            </Box>
            <VStack spacing={0} align="start">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="brand.500"
                lineHeight="none"
              >
                RootRise
              </Text>
              <Text fontSize="xs" color="gray.500" lineHeight="none">
                Agricultural Finance
              </Text>
            </VStack>
          </HStack>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                color={isActive(item.href) ? 'brand.500' : 'gray.600'}
                fontWeight={isActive(item.href) ? 'bold' : 'medium'}
                _hover={{ color: 'brand.500', bg: 'brand.50' }}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </Button>
            ))}
          </HStack>

          {/* Right Side */}
          <HStack spacing={4}>
            {/* Wallet Connect */}
            <Box display={{ base: 'none', md: 'block' }}>
              <Button
                size="sm"
                colorScheme="brand"
                onClick={() => alert('Wallet connection disabled for UI preview')}
              >
                {isConnected ? 'Connected' : 'Connect Wallet'}
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              variant="ghost"
              aria-label="Open menu"
              icon={<HamburgerIcon />}
            />
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bg="brand.500"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
              >
                R
              </Box>
              <Text fontSize="lg" fontWeight="bold" color="brand.500">
                RootRise
              </Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? 'solid' : 'ghost'}
                  colorScheme={isActive(item.href) ? 'brand' : undefined}
                  justifyContent="flex-start"
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Wallet Connect Mobile */}
              <Box pt={4}>
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={() => {
                    alert('Wallet connection disabled for UI preview');
                    onClose();
                  }}
                >
                  {isConnected ? 'Connected' : 'Connect Wallet'}
                </Button>
              </Box>

              {/* Quick Actions */}
              {isConnected && (
                <VStack spacing={3} pt={6} align="stretch">
                  <Text fontSize="sm" color="gray.600" fontWeight="bold">
                    Quick Actions:
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="brand"
                    onClick={() => {
                      router.push('/projects');
                      onClose();
                    }}
                  >
                    Browse Projects
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => {
                      router.push('/dashboard');
                      onClose();
                    }}
                  >
                    My Dashboard
                  </Button>
                </VStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}