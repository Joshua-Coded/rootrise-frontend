"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
} from '@chakra-ui/react';

interface GovernmentFormData {
  officialAddress: string;
  officialName: string;
  officialRole: string;
}

export default function GovernmentApplicationPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const toast = useToast();

  const {
    useGetOwner,
    useAddGovernmentOfficial,
    isCorrectNetwork,
  } = useRootRiseContract();

  const { data: contractOwner } = useGetOwner();
  const { addGovernmentOfficial, isLoading: isAddingOfficial } = useAddGovernmentOfficial();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GovernmentFormData>();

  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  const onSubmit = async (data: GovernmentFormData) => {
    if (!isConnected || !isCorrectNetwork) {
      toast({
        title: 'Connection Required',
        description: 'Please connect your wallet and switch to Sepolia network',
        status: 'warning',
        duration: 5000,
      });
      return;
    }

    if (!isOwner) {
      toast({
        title: 'Unauthorized',
        description: 'Only the contract owner can add government officials',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const hash = await addGovernmentOfficial(data.officialAddress as `0x${string}`);

      if (hash) {
        toast({
          title: 'Success!',
          description: `Government official ${data.officialName} has been added.`,
          status: 'success',
          duration: 8000,
        });
        reset();
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error('Government official addition error:', error);
      toast({
        title: 'Error',
        description: 'Failed to add government official',
        status: 'error',
        duration: 5000,
      });
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
              Please connect your wallet to manage government applications
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
                Please switch to Sepolia testnet to manage government applications.
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
              Manage Government Officials
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Add and verify government officials to oversee agricultural projects.
            </Text>
          </VStack>

          {/* Owner Status Card */}
          <Card w="full" bg={cardBg}>
            <CardHeader>
              <Heading size="md">Your Status</Heading>
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
                  <Text fontWeight="bold">Owner Status:</Text>
                  <Badge 
                    colorScheme={isOwner ? 'green' : 'yellow'}
                    size="lg"
                  >
                    {isOwner ? 'Contract Owner' : 'Not Owner'}
                  </Badge>
                </HStack>

                {!isOwner && (
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Unauthorized Access</AlertTitle>
                      <AlertDescription fontSize="sm">
                        Only the contract owner can add government officials.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Government Official Form */}
          {isOwner && (
            <Card w="full" bg={cardBg}>
              <CardHeader>
                <Heading size="md">Add Government Official</Heading>
                <Text fontSize="sm" color="gray.600">
                  Register a new government official to oversee projects
                </Text>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                      {/* Official Address */}
                      <FormControl isInvalid={!!errors.officialAddress}>
                        <FormLabel>Official Wallet Address</FormLabel>
                        <Input
                          {...register('officialAddress', {
                            required: 'Wallet address is required',
                            pattern: {
                              value: /^0x[a-fA-F0-9]{40}$/,
                              message: 'Invalid Ethereum address',
                            },
                          })}
                          placeholder="e.g., 0x1234...abcd"
                        />
                        <FormErrorMessage>{errors.officialAddress?.message}</FormErrorMessage>
                      </FormControl>

                      {/* Official Name */}
                      <FormControl isInvalid={!!errors.officialName}>
                        <FormLabel>Official Name</FormLabel>
                        <Input
                          {...register('officialName', {
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' },
                          })}
                          placeholder="e.g., John Doe"
                        />
                        <FormErrorMessage>{errors.officialName?.message}</FormErrorMessage>
                      </FormControl>

                      {/* Official Role */}
                      <FormControl isInvalid={!!errors.officialRole}>
                        <FormLabel>Official Role</FormLabel>
                        <Input
                          {...register('officialRole', {
                            required: 'Role is required',
                            minLength: { value: 3, message: 'Role must be at least 3 characters' },
                          })}
                          placeholder="e.g., Agricultural Officer"
                        />
                        <FormErrorMessage>{errors.officialRole?.message}</FormErrorMessage>
                      </FormControl>
                    </SimpleGrid>

                    <Divider />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      isLoading={isSubmitting || isAddingOfficial}
                      loadingText="Adding Official..."
                    >
                      Add Government Official
                    </Button>

                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Ensure the provided information is accurate and verified.
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
                  Verify Officials
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Add trusted government officials to the platform
                </Text>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody textAlign="center">
                <Heading size="sm" color="brand.500" mb={2}>
                  Oversight Role
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Enable officials to monitor and approve projects
                </Text>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody textAlign="center">
                <Heading size="sm" color="brand.500" mb={2}>
                  Secure Access
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Only the contract owner can perform these actions
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