"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Divider,
  SimpleGrid,
  useColorModeValue,
  useToast,
  Spinner,
  Select,
} from '@chakra-ui/react';

interface ProjectFormData {
  farmerAddress: string;
  title: string;
  description: string;
  goalAmount: string;
  duration: number;
  category: string;
  location: string;
}

const PROJECT_CATEGORIES = [
  'Crop Production',
  'Livestock',
  'Dairy Farming',
  'Poultry',
  'Aquaculture',
  'Horticulture',
  'Agro-processing',
  'Equipment Purchase',
  'Land Development',
  'Other',
];

export default function FarmerApplyPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const toast = useToast();
  
  const {
    useCreateProject,
    useGetOwner,
    useIsFarmerWhitelisted,
    useAddFarmer,
    isCorrectNetwork,
  } = useRootRiseContract();

  const { data: contractOwner } = useGetOwner();
  const { data: isFarmerWhitelisted } = useIsFarmerWhitelisted(address || '');
  const { createProject, isLoading: isCreatingProject } = useCreateProject();
  const { addFarmer, isLoading: isAddingFarmer } = useAddFarmer();

  const [step, setStep] = useState<'farmer-info' | 'project-details'>('farmer-info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ProjectFormData>({
    defaultValues: {
      farmerAddress: address || '',
      category: 'Crop Production',
      duration: 30,
    },
  });

  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  // Auto-fill farmer address when wallet connects
  React.useEffect(() => {
    if (address) {
      setValue('farmerAddress', address);
    }
  }, [address, setValue]);

  const handleWhitelistFarmer = async () => {
    if (!address) return;

    try {
      setIsSubmitting(true);
      await addFarmer(address);
      
      toast({
        title: 'Success!',
        description: 'Farmer has been whitelisted. You can now create projects.',
        status: 'success',
        duration: 5000,
      });
      
      // Refresh the page after a short delay to update whitelist status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Whitelist error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!isConnected || !isCorrectNetwork) {
      toast({
        title: 'Connection Required',
        description: 'Please connect your wallet and switch to Sepolia network',
        status: 'warning',
        duration: 5000,
      });
      return;
    }

    if (!isFarmerWhitelisted) {
      toast({
        title: 'Not Whitelisted',
        description: 'You need to be whitelisted as a farmer first',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Combine title and description for the project title
      const projectTitle = `${data.title} - ${data.description}`;

      const hash = await createProject(
        projectTitle,
        data.goalAmount,
        data.duration
      );

      if (hash) {
        toast({
          title: 'Project Created!',
          description: 'Your farming project has been submitted to the blockchain.',
          status: 'success',
          duration: 8000,
        });

        // Reset form and redirect after success
        reset();
        setTimeout(() => {
          router.push('/projects');
        }, 3000);
      }
    } catch (error) {
      console.error('Project creation error:', error);
    } finally {
      setIsSubmitting(false);
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
              Please connect your wallet to apply as a farmer and create projects
            </Text>
            <WalletConnect />
          </VStack>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <Box minH="100vh" bg={bg}>
        <Navbar />
        <Container maxW="4xl" py={20}>
          <Alert status="warning" borderRadius="xl">
            <AlertIcon />
            <Box>
              <AlertTitle>Wrong Network!</AlertTitle>
              <AlertDescription>
                Please switch to Sepolia testnet to create farming projects.
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bg}>
      <Navbar />
      
      <Container maxW="4xl" py={8}>
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" color="gray.800">
              Apply as Farmer
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Create agricultural projects and receive funding from investors worldwide.
              Join Rwanda's digital farming revolution.
            </Text>
          </VStack>

          {/* Farmer Status Card */}
          <Card w="full" bg={cardBg}>
            <CardHeader>
              <Heading size="md">Farmer Status</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="start">
                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold">Wallet Address:</Text>
                  <Text fontSize="sm" fontFamily="mono">
                    {address?.slice(0, 10)}...{address?.slice(-8)}
                  </Text>
                </HStack>
                
                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold">Farmer Status:</Text>
                  <Badge 
                    colorScheme={isFarmerWhitelisted ? 'green' : 'yellow'}
                    size="lg"
                  >
                    {isFarmerWhitelisted ? 'Verified Farmer' : 'Pending Verification'}
                  </Badge>
                </HStack>

                {isOwner && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">
                      You are the contract owner. You can whitelist farmers and create projects.
                    </Text>
                  </Alert>
                )}

                {!isFarmerWhitelisted && !isOwner && (
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Verification Required</AlertTitle>
                      <AlertDescription fontSize="sm">
                        You need to be whitelisted as a verified farmer before creating projects.
                        Contact the administrator or use the button below if you're authorized.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

                {!isFarmerWhitelisted && (isOwner || process.env.NODE_ENV === 'development') && (
                  <Button
                    colorScheme="green"
                    onClick={handleWhitelistFarmer}
                    isLoading={isAddingFarmer || isSubmitting}
                    loadingText="Whitelisting..."
                    size="sm"
                  >
                    Whitelist as Farmer
                  </Button>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Project Creation Form */}
          {isFarmerWhitelisted && (
            <Card w="full" bg={cardBg}>
              <CardHeader>
                <Heading size="md">Create New Project</Heading>
                <Text fontSize="sm" color="gray.600">
                  Submit your farming project for community funding
                </Text>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                      {/* Project Title */}
                      <FormControl isInvalid={!!errors.title}>
                        <FormLabel>Project Title</FormLabel>
                        <Input
                          {...register('title', { 
                            required: 'Project title is required',
                            minLength: { value: 5, message: 'Title must be at least 5 characters' },
                            maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                          })}
                          placeholder="e.g., Maize Production Expansion"
                        />
                        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                      </FormControl>

                      {/* Category */}
                      <FormControl isInvalid={!!errors.category}>
                        <FormLabel>Project Category</FormLabel>
                        <Select {...register('category', { required: 'Category is required' })}>
                          {PROJECT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
                      </FormControl>

                      {/* Funding Goal */}
                      <FormControl isInvalid={!!errors.goalAmount}>
                        <FormLabel>Funding Goal (USDC)</FormLabel>
                        <NumberInput min={100} max={100000}>
                          <NumberInputField
                            {...register('goalAmount', {
                              required: 'Funding goal is required',
                              min: { value: 100, message: 'Minimum goal is $100' },
                              max: { value: 100000, message: 'Maximum goal is $100,000' }
                            })}
                            placeholder="5000"
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>Enter amount in USD (minimum $100)</FormHelperText>
                        <FormErrorMessage>{errors.goalAmount?.message}</FormErrorMessage>
                      </FormControl>

                      {/* Duration */}
                      <FormControl isInvalid={!!errors.duration}>
                        <FormLabel>Project Duration (Days)</FormLabel>
                        <NumberInput min={7} max={365} defaultValue={30}>
                          <NumberInputField
                            {...register('duration', {
                              required: 'Duration is required',
                              min: { value: 7, message: 'Minimum duration is 7 days' },
                              max: { value: 365, message: 'Maximum duration is 365 days' }
                            })}
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>How long should the funding period last?</FormHelperText>
                        <FormErrorMessage>{errors.duration?.message}</FormErrorMessage>
                      </FormControl>

                      {/* Location */}
                      <FormControl isInvalid={!!errors.location}>
                        <FormLabel>Location</FormLabel>
                        <Input
                          {...register('location', { 
                            required: 'Location is required',
                            minLength: { value: 3, message: 'Location must be at least 3 characters' }
                          })}
                          placeholder="e.g., Kigali, Rwanda"
                        />
                        <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
                      </FormControl>

                      {/* Farmer Address (readonly) */}
                      <FormControl>
                        <FormLabel>Farmer Address</FormLabel>
                        <Input
                          {...register('farmerAddress')}
                          value={address}
                          isReadOnly
                          bg="gray.100"
                        />
                        <FormHelperText>Your connected wallet address</FormHelperText>
                      </FormControl>
                    </SimpleGrid>

                    {/* Project Description */}
                    <FormControl isInvalid={!!errors.description}>
                      <FormLabel>Project Description</FormLabel>
                      <Textarea
                        {...register('description', {
                          required: 'Project description is required',
                          minLength: { value: 50, message: 'Description must be at least 50 characters' },
                          maxLength: { value: 500, message: 'Description must be less than 500 characters' }
                        })}
                        placeholder="Describe your farming project, what you plan to do with the funding, expected outcomes, and how it will benefit the community..."
                        rows={6}
                      />
                      <FormHelperText>
                        Provide detailed information about your project ({watch('description')?.length || 0}/500 characters)
                      </FormHelperText>
                      <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                    </FormControl>

                    <Divider />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      isLoading={isSubmitting || isCreatingProject}
                      loadingText="Creating Project..."
                      disabled={!isFarmerWhitelisted}
                    >
                      Create Project
                    </Button>

                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      By creating a project, you agree to our terms of service and verify that all information provided is accurate.
                    </Text>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          )}

          {/* Information Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            <Card bg={cardBg}>
              <CardBody textAlign="center">
                <Heading size="sm" color="brand.500" mb={2}>
                  Get Verified
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Complete verification to become a trusted farmer on our platform
                </Text>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody textAlign="center">
                <Heading size="sm" color="brand.500" mb={2}>
                  Create Projects
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Submit detailed farming projects with funding goals and timelines
                </Text>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody textAlign="center">
                <Heading size="sm" color="brand.500" mb={2}>
                  Receive Funding
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Get direct funding from global investors interested in agriculture
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
}