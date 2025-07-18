"use client";
import { CalendarIcon, SearchIcon, StarIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WalletConnect } from "@/components/WalletConnect";
import { useRootRiseContract } from "@/hooks/useRootRiseContract";

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
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react';

export default function ProjectsPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { useGetTotalProjects, useGetProject, formatUSDC } = useRootRiseContract();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: totalProjects, isLoading: isLoadingTotal } = useGetTotalProjects();

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Generate array of project IDs to fetch
  const projectIds = useMemo(() => {
    if (!totalProjects) return [];
    return Array.from({ length: Number(totalProjects) }, (_, i) => i);
  }, [totalProjects]);

  // Fetch all projects using conditional hooks
  const project0 = useGetProject(0);
  const project1 = useGetProject(1);
  const project2 = useGetProject(2);
  const project3 = useGetProject(3);
  const project4 = useGetProject(4);
  const project5 = useGetProject(5);
  const project6 = useGetProject(6);
  const project7 = useGetProject(7);
  const project8 = useGetProject(8);
  const project9 = useGetProject(9);

  // Collect all project queries (add more as needed)
  const projectQueries = [
    project0, project1, project2, project3, project4,
    project5, project6, project7, project8, project9
  ];

  const projects = useMemo(() => {
    const totalProjectsNum = Number(totalProjects || 0);
    return projectQueries
      .slice(0, totalProjectsNum) // Only use the queries we need
      .map((query, index) => ({
        id: index,
        ...query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        // Ensure required fields have default values
        amountRaised: query.data?.amountRaised || 0n,
        goal: query.data?.goal || 1n,
        isOpen: Boolean(query.data?.isOpen),
        deadline: query.data?.deadline || 0n,
        createdAt: query.data?.createdAt || 0n,
      }))
      .filter(project => project.farmer && !project.isError);
  }, [projectQueries, totalProjects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      // Search filter
      const matchesSearch = project.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Status filter
      const now = Date.now() / 1000;
      const isExpired = Number(project.deadline || 0) < now;
      const isFunded = (project.amountRaised || 0n) >= (project.goal || 0n);
      
      let matchesStatus = true;
      if (filterStatus === 'active') {
        matchesStatus = Boolean(project.isOpen) && !isExpired && !isFunded;
      } else if (filterStatus === 'funded') {
        matchesStatus = isFunded;
      } else if (filterStatus === 'expired') {
        matchesStatus = isExpired && !isFunded;
      }

      return matchesSearch && matchesStatus;
    });

    // Sort projects
    if (sortBy === 'newest') {
      filtered.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    } else if (sortBy === 'deadline') {
      filtered.sort((a, b) => Number(a.deadline || 0) - Number(b.deadline || 0));
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => {
        const progressA = Number(a.amountRaised || 0n) / Number(a.goal || 1n);
        const progressB = Number(b.amountRaised || 0n) / Number(b.goal || 1n);
        return progressB - progressA;
      });
    }

    return filtered;
  }, [projects, searchTerm, sortBy, filterStatus]);

  const getProjectStatus = (project: any) => {
    const now = Date.now() / 1000;
    const isExpired = Number(project.deadline || 0) < now;
    const isFunded = (project.amountRaised || 0n) >= (project.goal || 0n);
    
    if (isFunded) return { status: 'Funded', color: 'green' };
    if (isExpired) return { status: 'Expired', color: 'red' };
    if (Boolean(project.isOpen)) return { status: 'Active', color: 'blue' };
    return { status: 'Closed', color: 'gray' };
  };

  const getProgressPercentage = (raised: bigint | undefined, goal: bigint | undefined) => {
    const safeRaised = raised || 0n;
    const safeGoal = goal || 1n;
    
    if (safeGoal === 0n) return 0;
    return Math.min((Number(safeRaised) / Number(safeGoal)) * 100, 100);
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
            <WalletConnect />
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
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" color="gray.800">
              Agricultural Projects
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Discover and support verified farming projects across Rwanda. 
              Every contribution directly impacts a farmer's livelihood.
            </Text>
          </VStack>

          {/* Filters and Search */}
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

                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="deadline">Deadline Soon</option>
                  <option value="progress">Most Funded</option>
                </Select>

                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="funded">Funded</option>
                  <option value="expired">Expired</option>
                </Select>
              </SimpleGrid>

              <HStack spacing={4} w="full" justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  {isLoadingTotal ? 'Loading...' : `${filteredProjects.length} projects found`}
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

          {/* Projects Grid */}
          {isLoadingTotal ? (
            <VStack spacing={4} py={8}>
              <Spinner size="lg" color="brand.500" />
              <Text color="gray.600">Loading projects...</Text>
            </VStack>
          ) : filteredProjects.length === 0 ? (
            <Alert status="info" borderRadius="xl">
              <AlertIcon />
              <AlertDescription>
                {totalProjects === 0n 
                  ? "No projects have been created yet. Be the first farmer to apply!" 
                  : "No projects match your search criteria. Try adjusting your filters."
                }
              </AlertDescription>
            </Alert>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {filteredProjects.map((project) => {
                const status = getProjectStatus(project);
                const progress = getProgressPercentage(project.amountRaised || 0n, project.goal || 1n);
                const daysLeft = Math.max(0, Math.ceil((Number(project.deadline || 0) - Date.now() / 1000) / 86400));
                
                return (
                  <Card
                    key={project.id}
                    bg={cardBg}
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'xl',
                    }}
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
                            <Text>
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                            </Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </CardHeader>

                    <CardBody pt={0}>
                      <VStack spacing={4} align="start">
                        <VStack spacing={2} align="start" w="full">
                          <Heading fontSize="lg" noOfLines={2} color="gray.800">
                            {project.title || `Project #${project.id}`}
                          </Heading>
                          
                          <HStack spacing={1} fontSize="sm" color="gray.500">
                            <StarIcon w={3} h={3} />
                            <Text>Rwanda</Text>
                          </HStack>
                        </VStack>

                        {/* Progress Section */}
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
                              Raised: ${formatUSDC(project.amountRaised || 0n)}
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800">
                              Goal: ${formatUSDC(project.goal || 1n)}
                            </Text>
                          </HStack>
                        </Box>

                        {/* Farmer Info */}
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
                            {project.farmer?.slice(2, 4).toUpperCase()}
                          </Box>
                          <VStack spacing={0} align="start" flex={1}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800">
                              Verified Farmer
                            </Text>
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                              {project.farmer?.slice(0, 10)}...{project.farmer?.slice(-8)}
                            </Text>
                          </VStack>
                        </HStack>

                        {/* Action Button */}
                        <Button
                          colorScheme="brand"
                          size="sm"
                          w="full"
                          isDisabled={!Boolean(project.isOpen) || progress >= 100}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/projects/${project.id}`);
                          }}
                        >
                          {progress >= 100 
                            ? 'Fully Funded' 
                            : Boolean(project.isOpen)
                              ? 'Contribute Now' 
                              : 'View Details'
                          }
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}

          {/* Statistics */}
          <Box w="full" bg={cardBg} p={6} borderRadius="xl" boxShadow="sm">
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                  {totalProjects?.toString() || '0'}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Total Projects
                </Text>
              </VStack>
              
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {filteredProjects.filter(p => getProjectStatus(p).status === 'Funded').length}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Successfully Funded
                </Text>
              </VStack>
              
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {filteredProjects.filter(p => getProjectStatus(p).status === 'Active').length}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Currently Active
                </Text>
              </VStack>
              
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  ${filteredProjects.reduce((total, project) => 
                    total + parseFloat(formatUSDC(project.amountRaised || 0n)), 0
                  ).toLocaleString()}
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