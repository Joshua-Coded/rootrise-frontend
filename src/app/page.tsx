"use client";
import { useRouter } from "next/navigation";
import { FaChartLine, FaGlobeAfrica, FaHandshake, FaSeedling } from "react-icons/fa";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Card,
  CardBody,
  Badge,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';

export default function HomePage() {
  const router = useRouter();
  const isConnected = false; // Static placeholder for UI preview

  const bgGradient = useColorModeValue(
    'linear(to-br, green.50, blue.50)',
    'linear(to-br, green.900, blue.900)'
  );

  const features = [
    {
      icon: FaSeedling,
      title: 'Support Farmers',
      description: 'Directly fund Rwandan agricultural projects and see your impact in real-time.',
    },
    {
      icon: FaGlobeAfrica,
      title: 'Global Reach',
      description: 'Connect investors worldwide with local farmers for sustainable growth.',
    },
    {
      icon: FaHandshake,
      title: 'Transparent Trust',
      description: 'Secure platform ensures funds reach farmers when goals are met.',
    },
    {
      icon: FaChartLine,
      title: 'Track Impact',
      description: 'Monitor project progress and see the real-world impact of your contributions.',
    },
  ];

  return (
    <Box minH="100vh" bg={bgGradient}>
      <Navbar />
      <Container maxW="7xl" pt={20} pb={16}>
        <VStack spacing={8} textAlign="center">
          <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
            Agricultural Crowdfunding Platform
          </Badge>
          <Heading
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            fontWeight="bold"
            bgGradient="linear(to-r, green.600, blue.600)"
            bgClip="text"
            lineHeight="shorter"
          >
            Fintech for the
            <br />
            Thousand Hills
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            maxW="2xl"
            lineHeight="tall"
          >
            Empowering Rwanda&apos;s farmers through transparent crowdfunding.
            Connect global investors with local agricultural projects for sustainable growth.
          </Text>
          <HStack spacing={4} wrap="wrap" justify="center">
            <Button
              size="lg"
              colorScheme="brand"
              onClick={() => router.push('/projects')}
              px={8}
              py={6}
              fontSize="lg"
            >
              Explore Projects
            </Button>
            {!isConnected ? (
              <Button
                size="lg"
                colorScheme="brand"
                onClick={() => alert('Wallet connection disabled for UI preview')}
                px={8}
                py={6}
                fontSize="lg"
              >
                Connect Wallet
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                colorScheme="brand"
                onClick={() => router.push('/dashboard')}
                px={8}
                py={6}
                fontSize="lg"
              >
                Go to Dashboard
              </Button>
            )}
          </HStack>
        </VStack>
      </Container>

      <Container maxW="7xl" py={16}>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
          <Stat
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            textAlign="center"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <StatNumber fontSize="3xl" color="brand.500">
              10
            </StatNumber>
            <StatLabel fontSize="md" color="gray.600">
              Active Projects
            </StatLabel>
          </Stat>
          <Stat
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            textAlign="center"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <StatNumber fontSize="3xl" color="brand.500">
              $100,000
            </StatNumber>
            <StatLabel fontSize="md" color="gray.600">
              Total Funded
            </StatLabel>
          </Stat>
          <Stat
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            textAlign="center"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <StatNumber fontSize="3xl" color="brand.500">
              95.4%
            </StatNumber>
            <StatLabel fontSize="md" color="gray.600">
              Agriculture Without Credit
            </StatLabel>
            <StatHelpText fontSize="xs">
              World Bank, 2018
            </StatHelpText>
          </Stat>
          <Stat
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            textAlign="center"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <StatNumber fontSize="3xl" color="brand.500">
              $2.1B
            </StatNumber>
            <StatLabel fontSize="md" color="gray.600">
              Financing Gap
            </StatLabel>
            <StatHelpText fontSize="xs">
              Annual Deficit
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </Container>

      <Container maxW="7xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" color="gray.800">
              How RootRise Works
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Our platform creates a transparent bridge between global capital and local agricultural needs.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {features.map((feature, index) => (
              <Card
                key={index}
                bg="white"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                transition="all 0.3s"
                cursor="pointer"
              >
                <CardBody textAlign="center" p={8}>
                  <VStack spacing={4}>
                    <Box
                      bg="brand.100"
                      p={4}
                      borderRadius="full"
                      display="inline-flex"
                    >
                      <Icon as={feature.icon} w={8} h={8} color="brand.500" />
                    </Box>
                    <Heading fontSize="xl" color="gray.800">
                      {feature.title}
                    </Heading>
                    <Text color="gray.600" lineHeight="tall">
                      {feature.description}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      <Box bg="white" py={16}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <VStack spacing={6} align="start">
              <Badge colorScheme="red" fontSize="sm" px={3} py={1}>
                The Problem
              </Badge>
              <Heading fontSize="3xl" color="gray.800">
                The Trust Deficit in Agricultural Finance
              </Heading>
              <VStack spacing={4} align="start">
                <Text color="gray.600" fontSize="lg">
                  <strong>For Investors:</strong> No reliable mechanism to ensure funds reach their intended purpose.
                </Text>
                <Text color="gray.600" fontSize="lg">
                  <strong>For Farmers:</strong> Opaque, slow loan processes with high rejection rates.
                </Text>
                <Text color="gray.600" fontSize="lg">
                  <strong>For Everyone:</strong> Manual systems prone to inefficiency and fraud.
                </Text>
              </VStack>
              <Button
                colorScheme="brand"
                size="lg"
                onClick={() => router.push('/about')}
              >
                Learn More About Our Mission
              </Button>
            </VStack>
            <Box position="relative">
              <Image
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Rwandan farmer in field"
                borderRadius="xl"
                boxShadow="xl"
              />
              <Box
                position="absolute"
                top={4}
                right={4}
                bg="white"
                p={3}
                borderRadius="lg"
                boxShadow="lg"
              >
                <Text fontSize="sm" fontWeight="bold" color="brand.500">
                  Rwanda Agricultural Sector
                </Text>
                <Text fontSize="xs" color="gray.600">
                  25% of GDP, 70% of population
                </Text>
              </Box>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Container maxW="7xl" py={16}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
          <Box order={{ base: 2, lg: 1 }}>
            <Image
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Crowdfunding platform"
              borderRadius="xl"
              boxShadow="xl"
            />
          </Box>
          <VStack spacing={6} align="start" order={{ base: 1, lg: 2 }}>
            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
              Our Solution
            </Badge>
            <Heading fontSize="3xl" color="gray.800">
              Transparent Crowdfunding
            </Heading>
            <VStack spacing={4} align="start">
              <HStack align="start">
                <Box
                  w={2}
                  h={2}
                  bg="brand.500"
                  borderRadius="full"
                  mt={2}
                  flexShrink={0}
                />
                <Text color="gray.600" fontSize="lg">
                  <strong>Secure Funding:</strong> Funds are released when project goals are met.
                </Text>
              </HStack>
              <HStack align="start">
                <Box
                  w={2}
                  h={2}
                  bg="brand.500"
                  borderRadius="full"
                  mt={2}
                  flexShrink={0}
                />
                <Text color="gray.600" fontSize="lg">
                  <strong>Verified Projects:</strong> Approved projects ensure legitimacy and trust.
                </Text>
              </HStack>
              <HStack align="start">
                <Box
                  w={2}
                  h={2}
                  bg="brand.500"
                  borderRadius="full"
                  mt={2}
                  flexShrink={0}
                />
                <Text color="gray.600" fontSize="lg">
                  <strong>Stable Transactions:</strong> Reliable platform eliminates financial uncertainty.
                </Text>
              </HStack>
            </VStack>
            <Button
              colorScheme="brand"
              size="lg"
              onClick={() => router.push('/how-it-works')}
            >
              See How It Works
            </Button>
          </VStack>
        </SimpleGrid>
      </Container>

      <Box bg="brand.500" color="white" py={16}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading fontSize="3xl">
              Ready to Make an Impact?
            </Heading>
            <Text fontSize="lg" maxW="2xl">
              Join the movement to transform agricultural finance in Rwanda.
              Every contribution directly supports a farming family&apos;s future.
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                bg="white"
                color="brand.500"
                _hover={{ bg: 'gray.100' }}
                onClick={() => router.push('/projects')}
              >
                Browse Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => router.push('/farmers')}
              >
                Apply as Farmer
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}