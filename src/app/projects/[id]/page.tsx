"use client";
import { ArrowBackIcon, CalendarIcon, CheckIcon, StarIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

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
  const toast = useToast();
  const { isOpen: isContributeOpen, onOpen: onContributeOpen, onClose: onContributeClose } = useDisclosure();
  const projectId = parseInt(params.id as string);
  const isConnected = true; // Mock for UI
  const address = '0x1234567890abcdef1234567890abcdef12345678'; // Mock address
  const [contributeAmount, setContributeAmount] = useState('');

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Mock project data
  const project = {
    title: `Agricultural Project #${projectId}`,
    farmer: address,
    goal: 10000 * 1e6,
    amountRaised: 7500 * 1e6,
    deadline: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
    isOpen: true,
    createdAt: Math.floor(Date.now() / 1000) - 30 * 24 * 3600,
  };
  const usdcBalance = 1000 * 1e6; // Mock balance
  const userContribution = 500 * 1e6; // Mock contribution

  const formatUSDC = (value: number) => (value / 1e6).toFixed(2);

  // Calculate project status and progress
  const projectStatus = (() => {
    const now = Date.now() / 1000;
    const isExpired = Number(project.deadline) < now;
    const isFunded = project.amountRaised >= project.goal;
    if (isFunded) return { status: 'Funded', color: 'green' };
    if (isExpired) return { status: 'Expired', color: 'red' };
    if (project.isOpen) return { status: 'Active', color: 'blue' };
    return { status: 'Closed', color: 'gray' };
  })();

  const progress = Math.min((project.amountRaised / project.goal) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((Number(project.deadline) - Date.now() / 1000) / 86400));

  const handleContribute = () => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid contribution amount',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    toast({
      title: 'Contribution',
      description: `Contributed ${contributeAmount} USDC (mock)`,
      status: 'success',
      duration: 3000,
    });
    setContributeAmount('');
    onContributeClose();
  };

  return (
    <Box minH="100vh" bg={bg}>
      <Navbar />
      <Container maxW="6xl" py={8}>
        <VStack spacing={8}>
          <HStack w="full" justify="start">
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => router.back()}
            >
              Back to Projects
            </Button>
          </HStack>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
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
            <VStack spacing={6} align="start">
              <VStack spacing={3} align="start" w="full">
                <HStack justify="space-between" w="full">
                  <Badge colorScheme={projectStatus.color} size="lg" px={3} py={1}>
                    {projectStatus.status}
                  </Badge>
                  <HStack spacing={1} fontSize="sm" color="gray.500">
                    <CalendarIcon w={4} h={4} />
                    <Text>{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</Text>
                  </HStack>
                </HStack>
                <Heading fontSize="3xl" color="gray.800">
                  {project.title}
                </Heading>
                <HStack spacing={2} fontSize="md" color="gray.600">
                  <StarIcon w={4} h={4} />
                  <Text>Rwanda</Text>
                </HStack>
              </VStack>
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
                        {project.farmer.slice(0, 10)}...{project.farmer.slice(-8)}
                      </Text>
                      <Badge colorScheme="green" size="sm">
                        <CheckIcon w={2} h={2} mr={1} />
                        Verified by RootRise
                      </Badge>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
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
                ${formatUSDC(userContribution)}
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
                  Your USDC Balance: {formatUSDC(usdcBalance)} USDC
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
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onContributeClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleContribute}
              // isDisabled={
              //   !contributeAmount ||
              //   parseFloat(contributeAmount) <= 0 ||
              //   parseFloat(contributeAmount) > formatUSDC(usdcBalance)
              // }
            >
              Contribute
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Footer />
    </Box>
  );
}