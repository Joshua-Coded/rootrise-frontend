"use client";
import React, { useState } from "react";
import { v2 as cloudinary } from "cloudinary";
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
  Select,
} from "@chakra-ui/react";

interface ProjectFormData {
  title: string;
  description: string;
  goalAmount: string;
  duration: number;
  category: string;
  location: string;
  document: FileList; // Added for file upload
}

const PROJECT_CATEGORIES = [
  "Crop Production",
  "Livestock",
  "Dairy Farming",
  "Poultry",
  "Aquaculture",
  "Horticulture",
  "Agro-processing",
  "Equipment Purchase",
  "Land Development",
  "Other",
];

export default function FarmerApplyPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const {
    useCreateProject,
    useGetOwner,
    useIsFarmerApproved,
    useAddFarmer,
    useSubmitFarmerApplication,
    isCorrectNetwork,
  } = useRootRiseContract();

  const { data: contractOwner } = useGetOwner();
  const { data: isFarmerWhitelisted } = useIsFarmerApproved(address || "");
  const { createProject, isLoading: isCreatingProject } = useCreateProject();
  const { addFarmer, isLoading: isAddingFarmer } = useAddFarmer();
  const { submitApplication, isLoading: isSubmittingApplication } = useSubmitFarmerApplication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ProjectFormData>({
    defaultValues: {
      category: "Crop Production",
      duration: 30,
    },
  });

  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  const handleWhitelistFarmer = async () => {
    if (!address) return;

    try {
      setIsSubmitting(true);
      const hash = await addFarmer(address);
      if (hash) {
        toast({
          title: "Success!",
          description: "Farmer has been whitelisted. You can now create projects.",
          status: "success",
          duration: 5000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Whitelist error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadProgress(0);
      const timestamp = Math.round(Date.now() / 1000);

      // Fetch signature from API route
      const response = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp }),
      });
      const { signature, timestamp: responseTimestamp } = await response.json();

      if (!signature) {
        throw new Error("Failed to get Cloudinary signature");
      }

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("timestamp", responseTimestamp.toString());
      formData.append("signature", signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await uploadResponse.json();
      if (result.secure_url) {
        setCloudinaryUrl(result.secure_url);
        toast({
          title: "File Uploaded",
          description: "Your document has been uploaded successfully.",
          status: "success",
          duration: 3000,
        });
        return result.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return null;
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!isConnected || !isCorrectNetwork) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet and switch to Sepolia network",
        status: "warning",
        duration: 5000,
      });
      return;
    }

    if (!isFarmerWhitelisted) {
      // Handle farmer application if not whitelisted
      if (!data.document || data.document.length === 0) {
        toast({
          title: "Document Required",
          description: "Please upload a document to apply as a farmer",
          status: "error",
          duration: 5000,
        });
        return;
      }

      const file = data.document[0];
      const documentUrl = await handleFileUpload(file);
      if (!documentUrl) return;

      try {
        setIsSubmitting(true);
        const hash = await submitApplication(documentUrl, ""); // mobileMoneyAccount is optional
        if (hash) {
          toast({
            title: "Application Submitted",
            description: "Your farmer application has been submitted for review.",
            status: "success",
            duration: 5000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error("Application submission error:", error);
        return;
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Create project if whitelisted
    try {
      setIsSubmitting(true);
      const projectTitle = `${data.title} - ${data.description.substring(0, 50)}`;
      const hash = await createProject(projectTitle, data.goalAmount, data.duration, "");
      if (hash) {
        toast({
          title: "Project Created!",
          description: "Your farming project has been submitted to the blockchain.",
          status: "success",
          duration: 8000,
        });
        reset();
        setTimeout(() => {
          router.push("/projects");
        }, 3000);
      }
    } catch (error) {
      console.error("Project creation error:", error);
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
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" color="gray.800">
              Apply as Farmer
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Create agricultural projects and receive funding from investors worldwide.
              Join Rwanda's digital farming revolution.
            </Text>
          </VStack>

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
                  <Badge colorScheme={isFarmerWhitelisted ? "green" : "yellow"} size="lg">
                    {isFarmerWhitelisted ? "Verified Farmer" : "Pending Verification"}
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
                {!isFarmerWhitelisted && (
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Verification Required</AlertTitle>
                      <AlertDescription fontSize="sm">
                        Please upload a document to apply as a farmer. Your application will be reviewed.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
                {!isFarmerWhitelisted && (isOwner || process.env.NODE_ENV === "development") && (
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

          <Card w="full" bg={cardBg}>
            <CardHeader>
              <Heading size="md">{isFarmerWhitelisted ? "Create New Project" : "Farmer Application"}</Heading>
              <Text fontSize="sm" color="gray.600">
                {isFarmerWhitelisted
                  ? "Submit your farming project for community funding"
                  : "Apply to become a verified farmer"}
              </Text>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                    {!isFarmerWhitelisted && (
                      <FormControl isInvalid={!!errors.document}>
                        <FormLabel>Upload Document</FormLabel>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          {...register("document", {
                            required: !isFarmerWhitelisted ? "Document is required for farmer application" : false,
                          })}
                        />
                        <FormHelperText>Upload a PDF, JPG, or PNG (max 5MB)</FormHelperText>
                        <FormErrorMessage>{errors.document?.message}</FormErrorMessage>
                      </FormControl>
                    )}
                    {isFarmerWhitelisted && (
                      <>
                        <FormControl isInvalid={!!errors.title}>
                          <FormLabel>Project Title</FormLabel>
                          <Input
                            {...register("title", {
                              required: "Project title is required",
                              minLength: { value: 5, message: "Title must be at least 5 characters" },
                              maxLength: { value: 100, message: "Title must be less than 100 characters" },
                            })}
                            placeholder="e.g., Maize Production Expansion"
                          />
                          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.category}>
                          <FormLabel>Project Category</FormLabel>
                          <Select {...register("category", { required: "Category is required" })}>
                            {PROJECT_CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.goalAmount}>
                          <FormLabel>Funding Goal (USDC)</FormLabel>
                          <NumberInput min={100} max={100000}>
                            <NumberInputField
                              {...register("goalAmount", {
                                required: "Funding goal is required",
                                min: { value: 100, message: "Minimum goal is $100" },
                                max: { value: 100000, message: "Maximum goal is $100,000" },
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
                        <FormControl isInvalid={!!errors.duration}>
                          <FormLabel>Project Duration (Days)</FormLabel>
                          <NumberInput min={7} max={365} defaultValue={30}>
                            <NumberInputField
                              {...register("duration", {
                                required: "Duration is required",
                                min: { value: 7, message: "Minimum duration is 7 days" },
                                max: { value: 365, message: "Maximum duration is 365 days" },
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
                        <FormControl isInvalid={!!errors.location}>
                          <FormLabel>Location</FormLabel>
                          <Input
                            {...register("location", {
                              required: "Location is required",
                              minLength: { value: 3, message: "Location must be at least 3 characters" },
                            })}
                            placeholder="e.g., Kigali, Rwanda"
                          />
                          <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl>
                          <FormLabel>Your Farmer Address</FormLabel>
                          <Input value={address || ""} isReadOnly bg="gray.100" />
                          <FormHelperText>Your connected wallet address</FormHelperText>
                        </FormControl>
                      </>
                    )}
                  </SimpleGrid>
                  <FormControl isInvalid={!!errors.description}>
                    <FormLabel>{isFarmerWhitelisted ? "Project Description" : "Application Description"}</FormLabel>
                    <Textarea
                      {...register("description", {
                        required: "Description is required",
                        minLength: { value: 50, message: "Description must be at least 50 characters" },
                        maxLength: { value: 500, message: "Description must be less than 500 characters" },
                      })}
                      placeholder={
                        isFarmerWhitelisted
                          ? "Describe your farming project, what you plan to do with the funding, expected outcomes, and how it will benefit the community..."
                          : "Describe why you should be approved as a farmer, including your experience and goals..."
                      }
                      rows={6}
                    />
                    <FormHelperText>
                      Provide detailed information ({watch("description")?.length || 0}/500 characters)
                    </FormHelperText>
                    <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                  </FormControl>
                  <Divider />
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    isLoading={isSubmitting || isCreatingProject || isSubmittingApplication}
                    loadingText={isFarmerWhitelisted ? "Creating Project..." : "Submitting Application..."}
                  >
                    {isFarmerWhitelisted ? "Create Project" : "Submit Application"}
                  </Button>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    By submitting, you agree to our terms of service and verify that all information provided is accurate.
                  </Text>
                </VStack>
              </form>
            </CardBody>
          </Card>

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