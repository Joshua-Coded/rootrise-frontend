"use client";
import { CalendarIcon, SearchIcon, StarIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

// import { formatDistanceToNow } from "date-fns";

import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Badge,
  Image,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';

export default function ProjectsPage() {
  const router = useRouter();
  const isConnected = true; // Mock for UI preview
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Mock project data
  const projects = [
    {
      id: 0,
      title: 'Coffee Farm Expansion',
      farmer: '0x1234567890abcdef1234567890abcdef12345678',
      goal: 10000 * 1e6,
      amountRaised: 7500 * 1e6,
      deadline: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
      createdAt: Math.floor(Date.now() / 1000) - 30 * 24 * 3600,
      isOpen: true,
    },
    {
      id: 1,
      title: 'Organic Vegetable Farm',
      farmer: '0xabcdef1234567890abcdef1234567890abcdef12',
      goal: 5000 * 1e6,
      amountRaised: 2000 * 1e6,
      deadline: Math.floor(Date.now() / 1000) + 3 * 24 * 3600,
      createdAt: Math.floor(Date.now() / 1000) - 15 * 24 * 3600,
      isOpen: true,
    },
    {
      id: 2,
      title: 'Avocado Orchard Project',
      farmer: '0x1234567890abcdef1234567890abcdef12345678',
      goal: 8000 * 1e6,
      amountRaised: 8000 * 1e6,
      deadline: Math.floor(Date.now() / 1000) - 5 * 24 * 3600,
      createdAt: Math.floor(Date.now() / 1000) - 45 * 24 * 3600,
      isOpen: false,
    },
  ];

  const formatUSDC = (value: number) => (value / 1e6).toFixed(2);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch = project.title
        ? project.title.toLowerCase().includes(searchTerm.toLowerCase())
        : false;

      const now = Date.now() / 1000;
      const isExpired = project.deadline ? Number(project.deadline) < now : false;
      const isFunded = project.amountRaised >= project.goal;

      let matchesStatus = true;
      if (filterStatus === 'active') {
        matchesStatus = project.isOpen && !isExpired && !isFunded;
      } else if (filterStatus === 'funded') {
        matchesStatus = isFunded;
      } else if (filterStatus === 'expired') {
        matchesStatus = isExpired && !isFunded;
      }

      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'newest') {
      filtered.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    } else if (sortBy === 'deadline') {
      filtered.sort((a, b) => Number(a.deadline) - Number(b.deadline));
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => {
        const progressA = a.amountRaised / a.goal;
        const progressB = b.amountRaised / b.goal;
        return progressB - progressA;
      });
    }

    return filtered;
  }, [projects, searchTerm, sortBy, filterStatus]);

  const getProjectStatus = (project: any) => {
    const now = Date.now() / 1000;
    const isExpired = project.deadline ? Number(project.deadline) < now : false;
    const isFunded = project.amountRaised >= project.goal;

    if (isFunded) return { status: 'Funded', color: 'green' };
    if (isExpired) return { status: 'Expired', color: 'red' };
    if (project.isOpen) return { status: 'Active', color: 'blue' };
    return { status: 'Closed', color: 'gray' };
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    if (!raised || !goal) return 0;
    return Math.min((raised / goal) * 100, 100);
  };

  if (!isConnected) {
    return (
      <Box minH="100vh" bg={bg}>
        <Navbar />
        <Container maxW="4xl" py={20}>
          <VStack spacing={8}>
            <Heading textAlign="center" color="gray.800">
              Connect Your Wallet
            </Heading>
            <Text textAlign="center" color="gray.600" fontSize="lg">
              Please connect your wallet to browse and contribute to agricultural projects
            </Text>
            <Button
              size="lg"
              colorScheme="brand"
              onClick={() => alert('Wallet connection disabled for UI preview')}
            >
              Connect Wallet
            </Button>
          </VStack>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bg}>
      <Navbar />
      <Container maxW="7xl" py={8}>
        <VStack spacing={8}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" color="gray.800">
              Agricultural Projects
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Discover and support verified farming projects across Rwanda.
              Every contribution directly impacts a farmer's livelihood.
            </Text>
          </VStack>

          <Box w="full" bg={cardBg} p={6} borderRadius="xl" boxShadow="sm">
            <VStack spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="deadline">Deadline Soon</option>
                  <option value="progress">Most Funded</option>
                </Select>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="funded">Funded</option>
                  <option value="expired">Expired</option>
                </Select>
              </SimpleGrid>
              <HStack spacing={4} w="full" justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  {filteredProjects.length} projects found
                </Text>
                <Button
                  size="sm"
                  colorScheme="brand"
                  variant="outline"
                  onClick={() => router.push('/farmers/apply')}
                >
                  Apply as Farmer
                </Button>
              </HStack>
            </VStack>
          </Box>

          {filteredProjects.length === 0 ? (
            <Alert status="info" borderRadius="xl">
              <AlertIcon />
              <AlertDescription>
                {projects.length === 0
                  ? 'No projects have been created yet. Be the first farmer to apply!'
                  : 'No projects match your search criteria. Try adjusting your filters.'}
              </AlertDescription>
            </Alert>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {filteredProjects.map((project) => {
                const status = getProjectStatus(project);
                const progress = getProgressPercentage(project.amountRaised, project.goal);
                const daysLeft = project.deadline
                  ? Math.max(0, Math.ceil((Number(project.deadline) - Date.now() / 1000) / 86400))
                  : 0;

                return (
                  <Card
                    key={project.id}
                    bg={cardBg}
                    _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                    transition="all 0.3s"
                    cursor="pointer"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    <CardHeader pb={2}>
                      <VStack spacing={3} align="start">
                        <Image
                          src={`https://images.unsplash.com/photo-${1500595046743 + project.id}-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                          alt={project.title}
                          borderRadius="md"
                          w="full"
                          h="200px"
                          objectFit="cover"
                          fallbackSrc="https://via.placeholder.com/800x200/68D391/FFFFFF?text=Farm+Project"
                        />
                        <HStack justify="space-between" w="full">
                          <Badge colorScheme={status.color} size="sm">
                            {status.status}
                          </Badge>
                          <HStack spacing={1} fontSize="xs" color="gray.500">
                            <CalendarIcon w={3} h={3} />
                            <Text>{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack spacing={4} align="start">
                        <VStack spacing={2} align="start" w="full">
                          <Heading fontSize="lg" noOfLines={2} color="gray.800">
                            {project.title}
                          </Heading>
                          <HStack spacing={1} fontSize="sm" color="gray.500">
                            <StarIcon w={3} h={3} />
                            <Text>Rwanda</Text>
                          </HStack>
                        </VStack>
                        <Box w="full">
                          <HStack justify="space-between" mb={2}>
                            <Text fontSize="sm" color="gray.600">
                              Progress
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color="brand.500">
                              {progress.toFixed(1)}%
                            </Text>
                          </HStack>
                          <Progress
                            value={progress}
                            colorScheme="brand"
                            borderRadius="full"
                            size="sm"
                            bg="gray.100"
                          />
                          <HStack justify="space-between" mt={2}>
                            <Text fontSize="sm" color="gray.600">
                              Raised: ${formatUSDC(project.amountRaised)}
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800">
                              Goal: ${formatUSDC(project.goal)}
                            </Text>
                          </HStack>
                        </Box>
                        <HStack spacing={3} w="full">
                          <Box
                            w={8}
                            h={8}
                            bg="brand.100"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="sm"
                            fontWeight="bold"
                            color="brand.600"
                          >
                            {project.farmer.slice(2, 4).toUpperCase()}
                          </Box>
                          <VStack spacing={0} align="start" flex={1}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800">
                              Verified Farmer
                            </Text>
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                              {project.farmer.slice(0, 10)}...{project.farmer.slice(-8)}
                            </Text>
                          </VStack>
                        </HStack>
                        <Button
                          colorScheme="brand"
                          size="sm"
                          w="full"
                          isDisabled={!project.isOpen || progress >= 100}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/projects/${project.id}`);
                          }}
                        >
                          {progress >= 100
                            ? 'Fully Funded'
                            : project.isOpen
                              ? 'Contribute Now'
                              : 'View Details'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}

          {filteredProjects.length > 0 && (
            <Button
              variant="outline"
              colorScheme="brand"
              size="lg"
              onClick={() => alert('Pagination would be implemented here')}
            >
              Load More Projects
            </Button>
          )}

          <Box w="full" bg={cardBg} p={6} borderRadius="xl" boxShadow="sm">
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                  {projects.length}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Total Projects
                </Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {filteredProjects.filter((p) => getProjectStatus(p).status === 'Funded').length}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Successfully Funded
                </Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {filteredProjects.filter((p) => getProjectStatus(p).status === 'Active').length}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Currently Active
                </Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  $
                  {filteredProjects
                    .reduce((total, project) => total + project.amountRaised / 1e6, 0)
                    .toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Total Raised
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
}