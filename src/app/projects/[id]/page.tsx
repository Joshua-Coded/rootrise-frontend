"use client";
import { ArrowBackIcon, CalendarIcon, CheckIcon, StarIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useRootRiseContract } from "@/hooks/useRootRiseContract";

import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Progress,
  Badge,
  Image,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Input,
  InputGroup,
  InputRightAddon,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Avatar,
  useColorModeValue,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const { isOpen: isContributeOpen, onOpen: onContributeOpen, onClose: onContributeClose } = useDisclosure();

  const projectId = parseInt(params.id as string);
  
  const {
    useGetProject,
    useGetContribution,
    useUSDCBalance,
    useUSDCAllowance,
    useApproveUSDC,
    useContribute,
    formatUSDC,
    ROOTRISE_ADDRESS,
  } = useRootRiseContract();

  const [contributeAmount, setContributeAmount] = useState('');

  // Fetch project data
  const { data: project, isLoading: isLoadingProject } = useGetProject(projectId);
  const { data: userContribution } = useGetContribution(projectId, address || '');
  const { data: usdcBalance } = useUSDCBalance(address || '');
  const { data: usdcAllowance } = useUSDCAllowance(address || '', ROOTRISE_ADDRESS);

  // Contract functions
  const { approveUSDC, isLoading: isApproving } = useApproveUSDC();
  const { contribute, isLoading: isContributing } = useContribute();

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Calculate project status and progress
  const projectStatus = useMemo(() => {
    if (!project) return null;
    
    const now = Date.now() / 1000;
    const isExpired = Number(project.deadline) < now;
    const isFunded = project.amountRaised >= project.goal;
    
    if (isFunded) return { status: 'Funded', color: 'green' };
    if (isExpired) return { status: 'Expired', color: 'red' };
    if (project.isOpen) return { status: 'Active', color: 'blue' };
    return { status: 'Closed', color: 'gray' };
  }, [project]);

  const progress = useMemo(() => {
    if (!project || project.goal === 0n) return 0;
    return Math.min((Number(project.amountRaised) / Number(project.goal)) * 100, 100);
  }, [project]);

  const daysLeft = useMemo(() => {
    if (!project) return 0;
    return Math.max(0, Math.ceil((Number(project.deadline) - Date.now() / 1000) / 86400));
  }, [project]);

  const needsApproval = useMemo(() => {
    if (!contributeAmount || !usdcAllowance) return false;
    const amount = parseFloat(contributeAmount) * 1e6; // Convert to 6 decimals
    return Number(usdcAllowance) < amount;
  }, [contributeAmount, usdcAllowance]);

  const handleContribute = async () => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid contribution amount',
        status: 'error',
        duration: 3000,
      });
      return;
    }
  
    // Check if the connected wallet is the farmer (project creator)
    if (address && project?.farmer && address.toLowerCase() === project.farmer.toLowerCase()) {
      toast({
        title: 'Cannot Contribute',
        description: 'You cannot contribute to your own project',
        status: 'error',
        duration: 5000,
      });
      return;
    }
  
    // Check minimum contribution amount
    const contributionAmountNumber = parseFloat(contributeAmount);
    const MINIMUM_CONTRIBUTION = 1; // Adjust based on your contract
    
    if (contributionAmountNumber < MINIMUM_CONTRIBUTION) {
      toast({
        title: 'Contribution Too Small',
        description: `Minimum contribution is ${MINIMUM_CONTRIBUTION} USDC`,
        status: 'error',
        duration: 5000,
      });
      return;
    }
  
    // Check if user has enough USDC balance
    const userBalance = usdcBalance ? parseFloat(formatUSDC(usdcBalance)) : 0;
    
    if (contributionAmountNumber > userBalance) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ${contributionAmountNumber} USDC but only have ${userBalance} USDC`,
        status: 'error',
        duration: 5000,
      });
      return;
    }
  
    try {
      if (needsApproval) {
        await approveUSDC(contributeAmount);
        
        toast({
          title: 'Approval Successful',
          description: 'USDC spending approved. You can now contribute.',
          status: 'success',
          duration: 3000,
        });
        
        setTimeout(async () => {
          try {
            await contribute(projectId, contributeAmount);
            
            toast({
              title: 'Contribution Successful',
              description: `Successfully contributed ${contributeAmount} USDC to the project!`,
              status: 'success',
              duration: 5000,
            });
            
            setContributeAmount('');
            onContributeClose();
          } catch (error: any) {
            console.error('Contribution error:', error);
            
            let errorMessage = 'Failed to contribute. Please try again.';
            
            if (error.message?.includes('Farmer cannot contribute')) {
              errorMessage = 'You cannot contribute to your own project.';
            } else if (error.message?.includes('Contribution too small')) {
              errorMessage = `Contribution amount is below the minimum required.`;
            } else if (error.message?.includes('Project not active')) {
              errorMessage = 'This project is no longer accepting contributions.';
            } else if (error.message?.includes('Deadline passed')) {
              errorMessage = 'The contribution deadline has passed.';
            }
            
            toast({
              title: 'Contribution Failed',
              description: errorMessage,
              status: 'error',
              duration: 5000,
            });
          }
        }, 2000);
      } else {
        await contribute(projectId, contributeAmount);
        
        toast({
          title: 'Contribution Successful',
          description: `Successfully contributed ${contributeAmount} USDC to the project!`,
          status: 'success',
          duration: 5000,
        });
        
        setContributeAmount('');
        onContributeClose();
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
      
      let errorMessage = 'Transaction failed. Please try again.';
      
      if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas or token amount.';
      } else if (error.message?.includes('Farmer cannot contribute')) {
        errorMessage = 'You cannot contribute to your own project.';
      } else if (error.message?.includes('Contribution too small')) {
        errorMessage = 'Contribution amount is below the minimum required.';
      }
      
      toast({
        title: 'Transaction Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (isLoadingProject) {
    return (
      <Box minH="100vh" bg={bg}>
        <Navbar />
        <Container maxW="6xl" py={20}>
          <VStack spacing={4}>
            <Spinner size="lg" color="brand.500" />
            <Text color="gray.600">Loading project details...</Text>
          </VStack>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box minH="100vh" bg={bg}>
        <Navbar />
        <Container maxW="6xl" py={20}>
          <Alert status="error" borderRadius="xl">
            <AlertIcon />
            <AlertDescription>
              Project not found. It may not exist or may not be loaded yet.
            </AlertDescription>
          </Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bg}>
      <Navbar />
      
      <Container maxW="6xl" py={8}>
        <VStack spacing={8}>
          {/* Back Button */}
          <HStack w="full" justify="start">
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => router.back()}
            >
              Back to Projects
            </Button>
          </HStack>

          {/* Project Header */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
            {/* Project Image */}
            <Box>
              <Image
                src={`https://images.unsplash.com/photo-${1500595046743 + projectId}-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                alt={project.title}
                borderRadius="xl"
                w="full"
                h="400px"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/800x400/68D391/FFFFFF?text=Farm+Project"
              />
            </Box>

            {/* Project Info */}
            <VStack spacing={6} align="start">
              <VStack spacing={3} align="start" w="full">
                <HStack justify="space-between" w="full">
                  <Badge colorScheme={projectStatus?.color} size="lg" px={3} py={1}>
                    {projectStatus?.status}
                  </Badge>
                  <HStack spacing={1} fontSize="sm" color="gray.500">
                    <CalendarIcon w={4} h={4} />
                    <Text>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </Text>
                  </HStack>
                </HStack>

                <Heading fontSize="3xl" color="gray.800">
                  {project.title || `Agricultural Project #${projectId}`}
                </Heading>

                <HStack spacing={2} fontSize="md" color="gray.600">
                  <StarIcon w={4} h={4} />
                  <Text>Rwanda</Text>
                </HStack>
              </VStack>

              {/* Progress */}
              <Box w="full">
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    Funding Progress
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="brand.500">
                    {progress.toFixed(1)}%
                  </Text>
                </HStack>
                
                <Progress
                  value={progress}
                  colorScheme="brand"
                  borderRadius="full"
                  size="lg"
                  bg="gray.200"
                />
                
                <HStack justify="space-between" mt={3}>
                  <Text fontSize="lg" color="gray.600">
                    ${formatUSDC(project.amountRaised)} raised
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    ${formatUSDC(project.goal)} goal
                  </Text>
                </HStack>
              </Box>

              {/* Farmer Info */}
              <Card w="full" bg={cardBg}>
                <CardBody>
                  <HStack spacing={4}>
                    <Avatar
                      size="md"
                      name={project.farmer}
                      bg="brand.500"
                      color="white"
                    />
                    <VStack spacing={1} align="start" flex={1}>
                      <Text fontSize="md" fontWeight="bold" color="gray.800">
                        Verified Farmer
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {project.farmer?.slice(0, 10)}...{project.farmer?.slice(-8)}
                      </Text>
                      <Badge colorScheme="green" size="sm">
                        <CheckIcon w={2} h={2} mr={1} />
                        Verified by RootRise
                      </Badge>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>

              {/* Contribute Button */}
              {isConnected && project.isOpen && progress < 100 && daysLeft > 0 && (
                <Button
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  onClick={onContributeOpen}
                >
                  Contribute to This Project
                </Button>
              )}
            </VStack>
          </SimpleGrid>

          {/* Project Stats */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
            <Stat bg={cardBg} p={6} borderRadius="xl" textAlign="center">
              <StatNumber fontSize="2xl" color="brand.500">
                ${formatUSDC(project.amountRaised)}
              </StatNumber>
              <StatLabel>Amount Raised</StatLabel>
            </Stat>

            <Stat bg={cardBg} p={6} borderRadius="xl" textAlign="center">
              <StatNumber fontSize="2xl" color="blue.500">
                {daysLeft}
              </StatNumber>
              <StatLabel>Days Remaining</StatLabel>
            </Stat>

            <Stat bg={cardBg} p={6} borderRadius="xl" textAlign="center">
              <StatNumber fontSize="2xl" color="purple.500">
                {userContribution ? formatUSDC(userContribution) : '0'}
              </StatNumber>
              <StatLabel>Your Contribution</StatLabel>
            </Stat>

            <Stat bg={cardBg} p={6} borderRadius="xl" textAlign="center">
              <StatNumber fontSize="2xl" color="orange.500">
                {formatDistanceToNow(new Date(Number(project.createdAt) * 1000))}
              </StatNumber>
              <StatLabel>Created</StatLabel>
            </Stat>
          </SimpleGrid>

          {/* Project Description */}
          <Card w="full" bg={cardBg}>
            <CardHeader>
              <Heading fontSize="xl">Project Description</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <Text color="gray.600" lineHeight="tall">
                This agricultural project aims to improve farming productivity and support rural 
                communities in Rwanda. The farmer has been verified by our team and has demonstrated 
                a clear plan for utilizing the funds effectively.
                <br /><br />
                The project includes modern farming techniques, quality seeds, fertilizers, and 
                equipment necessary to increase crop yield and ensure food security. Your contribution 
                will directly impact the farmer's livelihood and the local community's well-being.
                <br /><br />
                All funds are held in a smart contract and will be automatically released to the 
                farmer once the funding goal is reached and the project deadline has passed.
              </Text>
            </CardBody>
          </Card>

          {/* Warning for non-connected users */}
          {!isConnected && (
            <Alert status="info" borderRadius="xl">
              <AlertIcon />
              <AlertDescription>
                Connect your wallet to contribute to this project and track your impact.
              </AlertDescription>
            </Alert>
          )}
        </VStack>
      </Container>

      {/* Contribute Modal */}
      <Modal isOpen={isContributeOpen} onClose={onContributeClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contribute to Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text color="gray.600" textAlign="center">
                Your contribution will be held securely in a smart contract and automatically 
                released to the farmer when the funding goal is met.
              </Text>

              <Box w="full">
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Your USDC Balance: {usdcBalance ? formatUSDC(usdcBalance) : '0'} USDC
                </Text>
                <InputGroup size="lg">
                  <Input
                    placeholder="0.00"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    type="number"
                    min="0"
                    step="0.01"
                  />
                  <InputRightAddon>USDC</InputRightAddon>
                </InputGroup>
              </Box>

              {needsApproval && (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    You need to approve USDC spending first, then contribute.
                  </AlertDescription>
                </Alert>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
  <Button variant="ghost" mr={3} onClick={onContributeClose}>
    Cancel
  </Button>
  <Button
    colorScheme="brand"
    onClick={handleContribute}
    isLoading={isApproving || isContributing}
    loadingText={needsApproval ? 'Approving...' : 'Contributing...'}
    disabled={
      !contributeAmount || 
      parseFloat(contributeAmount) <= 0 ||
      (usdcBalance ? parseFloat(contributeAmount) > parseFloat(formatUSDC(usdcBalance)) : false)
    }
  >
    {needsApproval ? 'Approve USDC' : 'Contribute'}
  </Button>
</ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </Box>
  );
}