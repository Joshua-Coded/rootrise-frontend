"use client";
import { Container, Heading, VStack } from "@chakra-ui/react";
import { Navbar } from "@/components/Navbar";
import { OneTimeApproval } from "@/components/OneTimeApproval";

// Create: app/approve/page.tsx


export default function ApprovePage() {
  return (
    <>
      <Navbar />
      <Container maxW="md" py={10}>
        <VStack spacing={6}>
          <Heading size="lg">Setup USDC Spending</Heading>
          <OneTimeApproval />
        </VStack>
      </Container>
    </>
  );
}