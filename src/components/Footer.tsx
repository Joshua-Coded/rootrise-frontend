"use client";
import { useRouter } from "next/navigation";
import { FaDiscord, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Link,
  IconButton,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

export function Footer() {
  const router = useRouter();
  
  const bg = useColorModeValue('gray.900', 'gray.800');
  const textColor = useColorModeValue('gray.300', 'gray.400');
  const linkColor = useColorModeValue('white', 'gray.100');

  const footerLinks = {
    platform: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Browse Projects', href: '/projects' },
      { label: 'For Farmers', href: '/farmers' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Mission', href: '/mission' },
      { label: 'Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Smart Contracts', href: '/contracts' },
      { label: 'Security', href: '/security' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Compliance', href: '/compliance' },
    ],
  };

  const socialLinks = [
    { icon: FaTwitter, href: 'https://twitter.com/rootrise', label: 'Twitter' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/rootrise', label: 'LinkedIn' },
    { icon: FaGithub, href: 'https://github.com/rootrise', label: 'GitHub' },
    { icon: FaDiscord, href: 'https://discord.gg/rootrise', label: 'Discord' },
  ];

  return (
    <Box bg={bg} color={textColor} mt={16}>
      <Container maxW="7xl" py={12}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={8}>
          {/* Brand Section */}
          <VStack align="start" spacing={4}>
            <HStack spacing={3}>
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
                  color={linkColor}
                  lineHeight="none"
                >
                  RootRise
                </Text>
                <Text fontSize="xs" color={textColor} lineHeight="none">
                  Agricultural Finance
                </Text>
              </VStack>
            </HStack>
            
            <Text fontSize="sm" maxW="250px" lineHeight="tall">
              Empowering Rwandan farmers through transparent, blockchain-based 
              crowdfunding. Building bridges between global capital and local impact.
            </Text>

            <HStack spacing={3}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  as="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  icon={<social.icon />}
                  size="sm"
                  variant="ghost"
                  color={textColor}
                  _hover={{
                    color: 'brand.400',
                    transform: 'translateY(-2px)',
                  }}
                  transition="all 0.2s"
                />
              ))}
            </HStack>
          </VStack>

          {/* Platform Links */}
          <VStack align="start" spacing={4}>
            <Text fontSize="md" fontWeight="bold" color={linkColor}>
              Platform
            </Text>
            <VStack align="start" spacing={2}>
              {footerLinks.platform.map((link) => (
                <Link
                  key={link.label}
                  fontSize="sm"
                  color={textColor}
                  _hover={{ color: 'brand.400', textDecoration: 'none' }}
                  transition="color 0.2s"
                  cursor="pointer"
                  onClick={() => router.push(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Company Links */}
          <VStack align="start" spacing={4}>
            <Text fontSize="md" fontWeight="bold" color={linkColor}>
              Company
            </Text>
            <VStack align="start" spacing={2}>
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  fontSize="sm"
                  color={textColor}
                  _hover={{ color: 'brand.400', textDecoration: 'none' }}
                  transition="color 0.2s"
                  cursor="pointer"
                  onClick={() => router.push(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Resources Links */}
          <VStack align="start" spacing={4}>
            <Text fontSize="md" fontWeight="bold" color={linkColor}>
              Resources
            </Text>
            <VStack align="start" spacing={2}>
              {footerLinks.resources.map((link) => (
                <Link
                  key={link.label}
                  fontSize="sm"
                  color={textColor}
                  _hover={{ color: 'brand.400', textDecoration: 'none' }}
                  transition="color 0.2s"
                  cursor="pointer"
                  onClick={() => router.push(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Legal Links */}
          <VStack align="start" spacing={4}>
            <Text fontSize="md" fontWeight="bold" color={linkColor}>
              Legal
            </Text>
            <VStack align="start" spacing={2}>
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  fontSize="sm"
                  color={textColor}
                  _hover={{ color: 'brand.400', textDecoration: 'none' }}
                  transition="color 0.2s"
                  cursor="pointer"
                  onClick={() => router.push(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          </VStack>
        </SimpleGrid>

        <Divider my={8} borderColor="gray.600" />

        {/* Bottom Section */}
        <HStack
          justify="space-between"
          wrap="wrap"
          spacing={4}
          fontSize="sm"
          color={textColor}
        >
          <VStack align="start" spacing={1}>
            <Text>
              © 2025 RootRise. All rights reserved.
            </Text>
            <Text fontSize="xs">
              Built with ❤️ for Rwanda's agricultural community
            </Text>
          </VStack>

          <VStack align="end" spacing={1}>
            <HStack spacing={4} wrap="wrap">
              <Text fontSize="xs">
                Smart Contracts on Ethereum
              </Text>
              <Text fontSize="xs" color="brand.400">
                Sepolia Testnet
              </Text>
            </HStack>
            <Text fontSize="xs">
              Powered by blockchain technology
            </Text>
          </VStack>
        </HStack>

        {/* Network Status */}
        <Box mt={6} p={4} bg="gray.800" borderRadius="md" border="1px" borderColor="gray.600">
          <HStack justify="space-between" wrap="wrap" spacing={4}>
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color={linkColor}>
                Network Information
              </Text>
              <Text fontSize="xs">
                Current Network: Sepolia Testnet (Chain ID: 11155111)
              </Text>
            </VStack>
            
            <VStack align="end" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color={linkColor}>
                Contract Status
              </Text>
              <HStack spacing={3}>
                <HStack spacing={1}>
                  <Box w={2} h={2} bg="green.400" borderRadius="full" />
                  <Text fontSize="xs">RootRise</Text>
                </HStack>
                <HStack spacing={1}>
                  <Box w={2} h={2} bg="green.400" borderRadius="full" />
                  <Text fontSize="xs">MockUSDC</Text>
                </HStack>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
}