"use client";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
  Icon,
  useToast,
} from '@chakra-ui/react';

export default function DashboardPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const {
    useGetTotalProjects,
    useGetProject,
    useGetContribution,
    useUSDCBalance,
    useUSDCAllowance,
    useIsFarmerWhitelisted,
    formatUSDC,
    useFaucet,
    useApproveUSDC,
    ROOTRISE_ADDRESS,
  } = useRootRiseContract();

  const { data: totalProjects } = useGetTotalProjects();
  const { data: usdcBalance } = useUSDCBalance(address || '');
  const { data: usdcAllowance } = useUSDCAllowance(address || '', ROOTRISE_ADDRESS);
  const { data: isFarmerWhitelisted } = useIsFarmerWhitelisted(address || '');
  const { claimFromFaucet, isLoading: isFaucetLoading } = useFaucet();
  const { approveUSDC, isLoading: isApproveLoading } = useApproveUSDC();

  const [userReadiness, setUserReadiness] = useState({
    hasUSDC: false,
    hasApproval: false,
    isReady: false,
  });

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Check user readiness for contributions
  useEffect(() => {
    const checkReadiness = () => {
      const hasUSDC = usdcBalance && usdcBalance > BigInt(0);
      const hasApproval = usdcAllowance && usdcAllowance >= BigInt(1000000); // 1 USDC minimum
      
      setUserReadiness({
        hasUSDC: !!hasUSDC,
        hasApproval: !!hasApproval,
        isReady: !!hasUSDC && !!hasApproval,
      });
    };

    checkReadiness();
  }, [usdcBalance, usdcAllowance]);

  // Generate array of project IDs to fetch (limit to 10 for performance)
  const projectIds = useMemo(() => {
    if (!totalProjects) return [];
    const maxProjects = Math.min(Number(totalProjects), 10);
    return Array.from({ length: maxProjects }, (_, i) => i);
  }, [totalProjects]);

  // Fetch projects with conditional hooks
  const project0 = useGetProject(0);
  const project1 = useGetProject(1);
  const project2 = useGetProject(2);
  const project3 = useGetProject(3);
  const project4 = useGetProject(4);

  // Fetch user contributions for these projects
  const contrib0 = useGetContribution(0, address || '');
  const contrib1 = useGetContribution(1, address || '');
  const contrib2 = useGetContribution(2, address || '');
  const contrib3 = useGetContribution(3, address || '');
  const contrib4 = useGetContribution(4, address || '');

  const projectQueries = [project0, project1, project2, project3, project4];
  const contributionQueries = [contrib0, contrib1, contrib2, contrib3, contrib4];

  const userContributions = useMemo(() => {
    const totalProjectsNum = Number(totalProjects || 0);
    const maxToCheck = Math.min(totalProjectsNum, 5);
    
    return contributionQueries
      .slice(0, maxToCheck)
      .map((query, index) => ({
        projectId: index,
        amount: query.data || BigInt(0),
        isLoading: query.isLoading,
      }))
      .filter(contrib => contrib.amount > BigInt(0));
  }, [contributionQueries, totalProjects]);

  const projects = useMemo(() => {
    const totalProjectsNum = Number(totalProjects || 0);
    const maxToCheck = Math.min(totalProjectsNum, 5);
    
    return projectQueries
      .slice(0, maxToCheck)
      .map((query, index) => ({
        id: index,
        ...query.data,
        isLoading: query.isLoading,
        isError: query.isError,
      }))
      .filter(project => project.farmer && !project.isError);
  }, [projectQueries, totalProjects]);

  const userProjects = useMemo(() => {
    return projects.filter(project => 
      project.farmer?.toLowerCase() === address?.toLowerCase()
    );
  }, [projects, address]);

  // Calculate user statistics with proper null checks
  const userStats = useMemo(() => {
    const totalContributed = userContributions.reduce(
      (sum, contrib) => sum + Number(contrib.amount), 
      0
    );
    
    const projectsSupported = userContributions.length;
    const projectsCreated = userProjects.length;
    
    const totalRaised = userProjects.reduce(
      (sum, project) => sum + Number(project.amountRaised || BigInt(0)), 
      0
    );

    return {
      totalContributed: totalContributed / 1e6, // Convert from 6 decimals
      projectsSupported,
      projectsCreated,
      totalRaised: totalRaised / 1e6,
    };
  }, [userContributions, userProjects]);

  // Handle getting USDC
  const handleGetUSDC = async () => {
    try {
      await claimFromFaucet(1000);
      toast({
        title: 'Success!',
        description: 'Claimed 1000 test USDC',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to claim USDC',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Handle USDC approval
  const handleApproveUSDC = async () => {
    try {
      await approveUSDC('999999'); // Approve a large amount
      toast({
        title: 'Success!',
        description: 'USDC spending approved',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve USDC',
        status: 'error',
        duration: 3000,
      });
    }
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
              Please connect your wallet to view your dashboard
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
          <VStack spacing={4} w="full">
            <Heading fontSize="3xl" color="gray.800">
              Your Dashboard
            </Heading>
            <Text color="gray.600" textAlign="center">
              Track your contributions, manage projects, and monitor your impact
            </Text>
          </VStack>

          {/* User Readiness Status */}
          <Card w="full" bg={cardBg} border={userReadiness.isReady ? "2px solid" : "1px solid"} borderColor={userReadiness.isReady ? "green.300" : "gray.200"}>
            <CardBody>
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" color="gray.600">
                      Wallet Address
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      {address?.slice(0, 10)}...{address?.slice(-8)}
                    </Text>
                    <HStack spacing={2}>
                      <Badge colorScheme="green">Connected</Badge>
                      {isFarmerWhitelisted && (
                        <Badge colorScheme="blue">Verified Farmer</Badge>
                      )}
                      {userReadiness.isReady && (
                        <Badge colorScheme="green">Ready to Contribute</Badge>
                      )}
                    </HStack>
                  </VStack>

                  <VStack align="end" spacing={2}>
                    <Text fontSize="sm" color="gray.600">
                      USDC Balance
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                      {usdcBalance ? formatUSDC(usdcBalance) : '0'} USDC
                    </Text>
                  </VStack>
                </HStack>

                {/* Setup Status */}
                <Box w="full" p={4} bg={userReadiness.isReady ? "green.50" : "orange.50"} borderRadius="md">
                  <VStack spacing={3}>
                    <HStack justify="center" spacing={2}>
                      <Icon 
                        as={userReadiness.isReady ? CheckIcon : WarningIcon} 
                        color={userReadiness.isReady ? "green.500" : "orange.500"} 
                      />
                      <Text fontWeight="bold" color={userReadiness.isReady ? "green.700" : "orange.700"}>
                        {userReadiness.isReady ? "You're Ready to Contribute!" : "Setup Required"}
                      </Text>
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      {/* USDC Balance Check */}
                      <HStack spacing={3} p={3} bg="white" borderRadius="md" border="1px solid" borderColor={userReadiness.hasUSDC ? "green.200" : "gray.200"}>
                        <Icon as={CheckIcon} color={userReadiness.hasUSDC ? "green.500" : "gray.400"} />
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontSize="sm" fontWeight="bold">
                            USDC Balance: {usdcBalance ? formatUSDC(usdcBalance) : '0'}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            Need test tokens to contribute
                          </Text>
                        </VStack>
                        {!userReadiness.hasUSDC && (
                          <Button
                            size="sm"
                            colorScheme="brand"
                            onClick={handleGetUSDC}
                            isLoading={isFaucetLoading}
                            loadingText="Getting..."
                          >
                            Get USDC
                          </Button>
                        )}
                      </HStack>

                      {/* Approval Check */}
                      <HStack spacing={3} p={3} bg="white" borderRadius="md" border="1px solid" borderColor={userReadiness.hasApproval ? "green.200" : "gray.200"}>
                        <Icon as={CheckIcon} color={userReadiness.hasApproval ? "green.500" : "gray.400"} />
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontSize="sm" fontWeight="bold">
                            USDC Approved: {usdcAllowance ? formatUSDC(usdcAllowance) : '0'}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            Approve spending to contribute
                          </Text>
                        </VStack>
                        {userReadiness.hasUSDC && !userReadiness.hasApproval && (
                          <Button
                            size="sm"
                            colorScheme="orange"
                            onClick={handleApproveUSDC}
                            isLoading={isApproveLoading}
                            loadingText="Approving..."
                          >
                            Approve
                          </Button>
                        )}
                      </HStack>
                    </SimpleGrid>

                    {userReadiness.isReady && (
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => router.push('/projects')}
                      >
                        🚀 Browse Projects & Contribute
                      </Button>
                    )}
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Statistics */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
            <Stat bg={cardBg} p={6} borderRadius="xl" textAlign="center">
              <StatNumber fontSize="2xl" color="brand.500">
                ${userStats.totalContributed.toFixed(2)}
              </StatNumber>
              <StatLabel>Total Contributed</StatLabel>
              <StatHelpText>As an investor</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={6} borderRadius="xl" textAlign="center">
              <StatNumber fontSize="2xl" color="blue.500">
                {userStats.projectsSupported}
              </StatNumber>
              <StatLabel>Projects Supported</StatLabel>
              <StatHelpText>As an investor</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={6} borderRadius="xl" textAlign="center">
              <StatNumber fontSize="2xl" color="green.500">
                {userStats.projectsCreated}
              </StatNumber>
              <StatLabel>Projects Created</StatLabel>
              <StatHelpText>As a farmer</StatHelpText>
            </Stat>

            <Stat bg={cardBg} p={6} borderRadius="xl" textAlign="center">
              <StatNumber fontSize="2xl" color="purple.500">
                ${userStats.totalRaised.toFixed(2)}
              </StatNumber>
              <StatLabel>Total Raised</StatLabel>
              <StatHelpText>For your projects</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Main Content Tabs */}
          <Card w="full" bg={cardBg}>
            <Tabs variant="line" colorScheme="brand">
              <TabList px={6} pt={4}>
                <Tab>My Contributions</Tab>
                <Tab>My Projects</Tab>
                <Tab>Quick Actions</Tab>
              </TabList>

              <TabPanels>
                {/* Contributions Tab */}
                <TabPanel>
                  <VStack spacing={4} align="start">
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Your Investment Portfolio
                    </Text>
                    
                    {userContributions.length === 0 ? (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <AlertDescription>
                          You haven't contributed to any projects yet. 
                          <Button
                            ml={2}
                            size="sm"
                            colorScheme="brand"
                            variant="link"
                            onClick={() => router.push('/projects')}
                          >
                            Browse projects
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <TableContainer w="full">
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Project</Th>
                              <Th>Your Contribution</Th>
                              <Th>Project Status</Th>
                              <Th>Progress</Th>
                              <Th>Action</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {userContributions.map((contribution) => {
                              const project = projects.find(p => p.id === contribution.projectId);
                              if (!project || !project.goal || !project.amountRaised) return null;

                              const progress = project.goal > BigInt(0) 
                                ? (Number(project.amountRaised) / Number(project.goal)) * 100 
                                : 0;
                              
                              const now = Date.now() / 1000;
                              const isExpired = project.deadline ? Number(project.deadline) < now : false;
                              const isFunded = project.amountRaised >= project.goal;
                              
                              let status = 'Active';
                              let statusColor = 'blue';
                              if (isFunded) {
                                status = 'Funded';
                                statusColor = 'green';
                              } else if (isExpired) {
                                status = 'Expired';
                                statusColor = 'red';
                              }

                              return (
                                <Tr key={contribution.projectId}>
                                  <Td>
                                    <VStack align="start" spacing={1}>
                                      <Text fontWeight="bold" fontSize="sm">
                                        {project.title || `Project #${contribution.projectId}`}
                                      </Text>
                                      <Text fontSize="xs" color="gray.500">
                                        Goal: ${formatUSDC(project.goal)}
                                      </Text>
                                    </VStack>
                                  </Td>
                                  <Td>
                                    <Text fontWeight="bold" color="brand.500">
                                      ${formatUSDC(contribution.amount)}
                                    </Text>
                                  </Td>
                                  <Td>
                                    <Badge colorScheme={statusColor}>
                                      {status}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <VStack align="start" spacing={1}>
                                      <Text fontSize="sm">{progress.toFixed(1)}%</Text>
                                      <Progress
                                        value={progress}
                                        size="sm"
                                        colorScheme="brand"
                                        w="100px"
                                      />
                                    </VStack>
                                  </Td>
                                  <Td>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      colorScheme="brand"
                                      onClick={() => router.push(`/projects/${contribution.projectId}`)}
                                    >
                                      View
                                    </Button>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    )}
                  </VStack>
                </TabPanel>

                {/* Projects Tab */}
                <TabPanel>
                  <VStack spacing={4} align="start">
                    <HStack justify="space-between" w="full">
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Your Farm Projects
                      </Text>
                      {isFarmerWhitelisted && (
                        <Button
                          size="sm"
                          colorScheme="brand"
                          onClick={() => router.push('/farmers/apply')}
                        >
                          Create New Project
                        </Button>
                      )}
                    </HStack>

                    {!isFarmerWhitelisted ? (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <AlertDescription>
                          You need to be a verified farmer to create projects.
                          <Button
                            ml={2}
                            size="sm"
                            colorScheme="brand"
                            variant="link"
                            onClick={() => router.push('/farmers/apply')}
                          >
                            Apply now
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ) : userProjects.length === 0 ? (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <AlertDescription>
                          You haven't created any projects yet.
                          <Button
                            ml={2}
                            size="sm"
                            colorScheme="brand"
                            variant="link"
                            onClick={() => router.push('/farmers/create-project')}
                          >
                            Create your first project
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                        {userProjects.map((project) => {
                          if (!project.goal || project.amountRaised === undefined) return null;

                          const progress = project.goal > BigInt(0) 
                            ? (Number(project.amountRaised) / Number(project.goal)) * 100 
                            : 0;
                          
                          const now = Date.now() / 1000;
                          const isExpired = project.deadline ? Number(project.deadline) < now : false;
                          const isFunded = project.amountRaised >= project.goal;
                          
                          let status = 'Active';
                          let statusColor = 'blue';
                          if (isFunded) {
                            status = 'Funded';
                            statusColor = 'green';
                          } else if (isExpired) {
                            status = 'Expired';
                            statusColor = 'red';
                          }

                          return (
                            <Card key={project.id} variant="outline">
                              <CardHeader pb={2}>
                                <HStack justify="space-between">
                                  <Badge colorScheme={statusColor}>
                                    {status}
                                  </Badge>
                                  <Text fontSize="sm" color="gray.500">
                                    Project #{project.id}
                                  </Text>
                                </HStack>
                              </CardHeader>
                              <CardBody pt={0}>
                                <VStack spacing={3} align="start">
                                  <Text fontWeight="bold" fontSize="md" noOfLines={2}>
                                    {project.title || `Project #${project.id}`}
                                  </Text>
                                  
                                  <Box w="full">
                                    <HStack justify="space-between" mb={1}>
                                      <Text fontSize="sm" color="gray.600">
                                        Progress
                                      </Text>
                                      <Text fontSize="sm" fontWeight="bold">
                                        {progress.toFixed(1)}%
                                      </Text>
                                    </HStack>
                                    <Progress
                                      value={progress}
                                      colorScheme="brand"
                                      borderRadius="full"
                                    />
                                    <HStack justify="space-between" mt={1}>
                                      <Text fontSize="sm" color="gray.600">
                                        ${formatUSDC(project.amountRaised)}
                                      </Text>
                                      <Text fontSize="sm" color="gray.600">
                                        ${formatUSDC(project.goal)}
                                      </Text>
                                    </HStack>
                                  </Box>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    colorScheme="brand"
                                    w="full"
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                  >
                                    View Details
                                  </Button>
                                </VStack>
                              </CardBody>
                            </Card>
                          );
                        })}
                      </SimpleGrid>
                    )}
                  </VStack>
                </TabPanel>

                {/* Quick Actions Tab */}
                <TabPanel>
                  <VStack spacing={6} align="start">
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Quick Actions
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      <Card variant="outline" _hover={{ bg: 'brand.50' }}>
                        <CardBody textAlign="center">
                          <VStack spacing={3}>
                            <Text fontSize="lg" fontWeight="bold">
                              Browse Projects
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Discover and support agricultural projects
                            </Text>
                            <Button
                              colorScheme="brand"
                              onClick={() => router.push('/projects')}
                              isDisabled={!userReadiness.isReady}
                            >
                              {userReadiness.isReady ? 'Explore Now' : 'Setup Required'}
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>

                      {isFarmerWhitelisted && (
                        <Card variant="outline" _hover={{ bg: 'blue.50' }}>
                          <CardBody textAlign="center">
                            <VStack spacing={3}>
                              <Text fontSize="lg" fontWeight="bold">
                                Create Project
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Start a new crowdfunding campaign
                              </Text>
                              <Button
                                colorScheme="blue"
                                onClick={() => router.push('/farmers/create-project')}
                              >
                                Create Now
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      )}

                      {!isFarmerWhitelisted && (
                        <Card variant="outline" _hover={{ bg: 'green.50' }}>
                          <CardBody textAlign="center">
                            <VStack spacing={3}>
                              <Text fontSize="lg" fontWeight="bold">
                                Become a Farmer
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Apply for farmer verification
                              </Text>
                              <Button
                                colorScheme="green"
                                onClick={() => router.push('/farmers/apply')}
                              >
                                Apply Now
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      )}

                      <Card variant="outline" _hover={{ bg: 'purple.50' }}>
                        <CardBody textAlign="center">
                          <VStack spacing={3}>
                            <Text fontSize="lg" fontWeight="bold">
                              Get Test USDC
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Claim test tokens for contributions
                            </Text>
                            <Button
                              colorScheme="purple"
                              onClick={handleGetUSDC}
                              isLoading={isFaucetLoading}
                              loadingText="Claiming..."
                            >
                              Claim 1,000 USDC
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>

          {/* Help Section */}
          <Card w="full" bg="brand.50" border="1px" borderColor="brand.200">
            <CardBody>
              <VStack spacing={3} textAlign="center">
                <Text fontSize="lg" fontWeight="bold" color="brand.800">
                  Need Help Getting Started?
                </Text>
                <Text color="brand.700">
                  Check out our guides and documentation to make the most of RootRise
                </Text>
                <HStack spacing={3}>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    variant="outline"
                    onClick={() => router.push('/how-it-works')}
                  >
                    How It Works
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    variant="outline"
                    onClick={() => router.push('/about')}
                  >
                    Learn More
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
}