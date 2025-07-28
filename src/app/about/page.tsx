"use client";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import { 
  FaGlobeAfrica, 
  FaSeedling, 
  FaUsers, 
  FaChartLine,
  FaHeart,
  FaLightbulb,
  FaHandshake,
  FaArrowRight,
  FaQuoteLeft
} from "react-icons/fa";

import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  Badge,
  Image,
  useColorModeValue,
  Divider,
  Avatar,
  Stack,
  Flex,
} from '@chakra-ui/react';

const stats = [
  {
    number: "70%",
    label: "of Rwanda's population works in agriculture",
    sublabel: "National Institute of Statistics Rwanda"
  },
  {
    number: "25%",
    label: "of Rwanda's GDP comes from agriculture",
    sublabel: "World Bank Data"
  },
  {
    number: "$2.1B",
    label: "annual agricultural financing gap in Africa",
    sublabel: "African Development Bank"
  },
  {
    number: "95.4%",
    label: "of farmers lack access to formal credit",
    sublabel: "World Bank Report 2018"
  }
];

const values = [
  {
    icon: FaHeart,
    title: "Empowerment",
    description: "We believe in empowering farmers with direct access to global capital, bypassing traditional barriers that have limited their growth potential."
  },
  {
    icon: FaLightbulb,
    title: "Innovation",
    description: "By leveraging blockchain technology, we're pioneering new ways to create transparent, efficient, and secure agricultural financing solutions."
  },
  {
    icon: FaHandshake,
    title: "Trust",
    description: "Building trust through transparency is at our core. Every transaction is verifiable, every project is tracked, and every outcome is measured."
  },
  {
    icon: FaGlobeAfrica,
    title: "Impact",
    description: "We measure success not just in funds raised, but in lives improved, communities strengthened, and sustainable farming practices adopted."
  }
];

const teamMembers = [
  {
    name: "Joshua Alana",
    role: "Founder & CEO",
    bio: "Software Engineer with expertise in blockchain development and financial markets. Managing $15K trading portfolio while building RootRise to bridge technology and agriculture.",
    avatar: "/images/team/joshua-alana.jpg",
    expertise: ["Blockchain Development", "Financial Markets", "Agricultural Technology"],
    fallbackAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Divine Ifechukwude",
    role: "Technical Innovation",
    bio: "Dedicated team of developers, designers, and agricultural experts working to build the future of farming finance in Rwanda and across Africa.",
    avatar: "/images/team/ebi.jpg", 
    expertise: ["Full-Stack Development", "Smart Contracts", "UX Design"],
    fallbackAvatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
  }
];

const milestones = [
  {
    year: "2025",
    title: "Platform Development",
    description: "Building and testing RootRise platform with core crowdfunding functionality on Ethereum testnet."
  },
  {
    year: "Sep 2025",
    title: "Official Launch",
    description: "RootRise platform launches publicly, connecting verified Rwandan farmers with global investors."
  },
  {
    year: "2026",
    title: "Community Growth",
    description: "Expanding to serve 100+ verified farmers and 1000+ global investors across Rwanda."
  },
  {
    year: "2027",
    title: "Regional Expansion", 
    description: "Scaling across East Africa with partnerships and localized farming programs."
  }
];

export default function AboutPage() {
  const router = useRouter();

  const bgGradient = useColorModeValue(
    'linear(to-br, green.50, blue.50)',
    'linear(to-br, green.900, blue.900)'
  );

  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgGradient}>
      <Navbar />
      
      <Container maxW="7xl" pt={20} pb={16}>
        <VStack spacing={8} textAlign="center">
          <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
            Our Mission
          </Badge>
          <Heading
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight="bold"
            bgGradient="linear(to-r, green.600, blue.600)"
            bgClip="text"
            lineHeight="shorter"
          >
            Transforming Agriculture
            <br />
            Through Technology
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            maxW="3xl"
            lineHeight="tall"
          >
            RootRise is democratizing agricultural finance in Rwanda by connecting farmers directly with global investors through transparent, blockchain-based crowdfunding. We're building bridges where walls once stood.
          </Text>
        </VStack>
      </Container>

      {/* Problem Statement */}
      <Container maxW="7xl" py={16}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
          <VStack spacing={6} align="start">
            <Badge colorScheme="red" fontSize="sm" px={3} py={1}>
              The Challenge We're Solving
            </Badge>
            <Heading fontSize="3xl" color="gray.800">
              Breaking Down Barriers in Agricultural Finance
            </Heading>
            <Text color="gray.600" fontSize="lg" lineHeight="tall">
              Despite agriculture being the backbone of Rwanda's economy, farmers face significant challenges accessing capital. Traditional banking systems are often inaccessible, loan processes are opaque, and interest rates can be prohibitive.
            </Text>
            <Text color="gray.600" fontSize="lg" lineHeight="tall">
              Meanwhile, global investors interested in supporting sustainable agriculture lack transparent mechanisms to directly fund farming projects and track their impact.
            </Text>
            <Box bg="orange.50" p={4} borderRadius="lg" border="1px" borderColor="orange.200">
              <HStack>
                <Icon as={FaQuoteLeft} color="orange.500" />
                <Text fontStyle="italic" color="orange.700">
                  "The agricultural sector accounts for 25% of Rwanda's GDP, yet 95.4% of farmers lack access to formal credit systems."
                </Text>
              </HStack>
            </Box>
          </VStack>
          <Box position="relative">
            <Image
              src="/images/rwanda-farmers.png" 
              alt="Rwandan farmers working in agricultural fields"
              borderRadius="xl"
              boxShadow="xl"
              fallbackSrc="https://images.unsplash.com/photo-1594736797933-d0d3cf3f3bb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            <Box
              position="absolute"
              bottom={4}
              right={4}
              bg="white"
              p={3}
              borderRadius="lg"
              boxShadow="lg"
            >
              <Text fontSize="sm" fontWeight="bold" color="brand.500">
                Rwanda's Agricultural Community
              </Text>
              <Text fontSize="xs" color="gray.600">
                Supporting local farmers across all provinces
              </Text>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Statistics */}
      <Box bg="white" py={16}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize="3xl" color="gray.800">
                The Numbers Tell the Story
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Understanding the scale of agricultural finance challenges in Rwanda and across Africa.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {stats.map((stat, index) => (
                <Card key={index} bg="gray.50" textAlign="center" _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s">
                  <CardBody p={8}>
                    <VStack spacing={3}>
                      <Text fontSize="4xl" fontWeight="bold" color="brand.500">
                        {stat.number}
                      </Text>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800">
                        {stat.label}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {stat.sublabel}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Our Solution */}
      <Container maxW="7xl" py={16}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
          <Box order={{ base: 2, lg: 1 }}>
            <Image
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Blockchain technology"
              borderRadius="xl"
              boxShadow="xl"
            />
          </Box>
          <VStack spacing={6} align="start" order={{ base: 1, lg: 2 }}>
            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
              Our Solution
            </Badge>
            <Heading fontSize="3xl" color="gray.800">
              Blockchain-Powered Transparency
            </Heading>
            <Text color="gray.600" fontSize="lg" lineHeight="tall">
              RootRise leverages Ethereum blockchain technology to create a transparent, secure, and efficient crowdfunding platform specifically designed for agricultural projects.
            </Text>
            <VStack spacing={4} align="start" w="full">
              <HStack>
                <Icon as={FaSeedling} color="green.500" />
                <Text color="gray.600">Direct farmer-to-investor connections</Text>
              </HStack>
              <HStack>
                <Icon as={FaChartLine} color="green.500" />
                <Text color="gray.600">Real-time project tracking and transparency</Text>
              </HStack>
              <HStack>
                <Icon as={FaUsers} color="green.500" />
                <Text color="gray.600">Community-driven verification and support</Text>
              </HStack>
              <HStack>
                <Icon as={FaGlobeAfrica} color="green.500" />
                <Text color="gray.600">Global accessibility with local impact</Text>
              </HStack>
            </VStack>
          </VStack>
        </SimpleGrid>
      </Container>

      {/* Our Values */}
      <Box bg="white" py={16}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize="3xl" color="gray.800">
                Our Core Values
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                The principles that guide our mission to transform agricultural finance.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {values.map((value, index) => (
                <Card key={index} bg="gray.50" border="none">
                  <CardBody p={8}>
                    <HStack spacing={4} align="start">
                      <Box
                        bg="brand.500"
                        p={4}
                        borderRadius="xl"
                        display="inline-flex"
                        flexShrink={0}
                      >
                        <Icon as={value.icon} w={6} h={6} color="white" />
                      </Box>
                      <VStack spacing={3} align="start" flex={1}>
                        <Heading fontSize="xl" color="gray.800">
                          {value.title}
                        </Heading>
                        <Text color="gray.600" lineHeight="tall">
                          {value.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxW="7xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="3xl" color="gray.800">
              Meet Our Team
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Passionate individuals dedicated to transforming agricultural finance in Rwanda.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12}>
            {teamMembers.map((member, index) => (
              <Card key={index} bg={cardBg} textAlign="center">
                <CardBody p={8}>
                  <VStack spacing={6}>
                    <Box position="relative">
                      <Avatar 
                        size="2xl" 
                        src={member.avatar} 
                        name={member.name}
                        bg="brand.100"
                      />
                      {/* Fallback image if custom image fails */}
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        borderRadius="full"
                        w="128px"
                        h="128px"
                        position="absolute"
                        top={0}
                        objectFit="cover"
                        fallbackSrc={member.fallbackAvatar}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </Box>
                    <VStack spacing={2}>
                      <Heading fontSize="xl" color="gray.800">
                        {member.name}
                      </Heading>
                      <Text color="brand.500" fontWeight="semibold">
                        {member.role}
                      </Text>
                    </VStack>
                    <Text color="gray.600" lineHeight="tall" textAlign="center">
                      {member.bio}
                    </Text>
                    <Flex wrap="wrap" justify="center" gap={2}>
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} colorScheme="brand" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Roadmap */}
      <Box bg="white" py={16}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize="3xl" color="gray.800">
                Our Journey Forward
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Building the future of agricultural finance, one milestone at a time.
              </Text>
            </VStack>

            <VStack spacing={8} w="full" maxW="4xl">
              {milestones.map((milestone, index) => (
                <Flex key={index} w="full" position="relative">
                  {/* Timeline Line */}
                  {index < milestones.length - 1 && (
                    <Box
                      position="absolute"
                      left="25px"
                      top="60px"
                      w="2px"
                      h="80px"
                      bg="brand.200"
                      zIndex={0}
                    />
                  )}
                  
                  {/* Year Circle */}
                  <Box
                    bg="brand.500"
                    color="white"
                    borderRadius="full"
                    w={12}
                    h={12}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="sm"
                    flexShrink={0}
                    zIndex={1}
                  >
                    {milestone.year}
                  </Box>
                  
                  {/* Content */}
                  <Box ml={6} flex={1}>
                    <Heading fontSize="lg" color="gray.800" mb={2}>
                      {milestone.title}
                    </Heading>
                    <Text color="gray.600" lineHeight="tall">
                      {milestone.description}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box bg="brand.500" color="white" py={16}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading fontSize="3xl">
              Join Us in Transforming Agriculture
            </Heading>
            <Text fontSize="lg" maxW="2xl">
              Whether you're a farmer looking for funding or an investor seeking impact, RootRise provides the tools and community to drive meaningful change in Rwanda's agricultural sector.
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Button
                size="lg"
                bg="white"
                color="brand.500"
                _hover={{ bg: 'gray.100' }}
                onClick={() => router.push('/projects')}
                rightIcon={<FaArrowRight />}
              >
                Explore Projects
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
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => router.push('/how-it-works')}
              >
                Learn How It Works
              </Button>
            </Stack>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}