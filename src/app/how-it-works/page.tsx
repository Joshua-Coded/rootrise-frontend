"use client";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import { 
  FaUser, 
  FaSeedling, 
  FaCoins, 
  FaCheck, 
  FaArrowRight,
  FaWallet,
  FaShieldAlt,
  FaChartLine,
  FaHandshake
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
  useColorModeValue,
  Divider,
  List,
  ListItem,
  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

const steps = [
  {
    title: 'Farmer Registration',
    description: 'Farmers apply and get verified on the platform',
    icon: FaUser,
    details: [
      'Submit application with project details',
      'Undergo verification process',
      'Get whitelisted by administrators',
      'Ready to create funding projects'
    ]
  },
  {
    title: 'Project Creation',
    description: 'Create detailed agricultural projects with funding goals',
    icon: FaSeedling,
    details: [
      'Define project scope and timeline',
      'Set realistic funding targets',
      'Provide detailed project description',
      'Submit for community review'
    ]
  },
  {
    title: 'Community Investment',
    description: 'Global investors discover and fund promising projects',
    icon: FaCoins,
    details: [
      'Browse verified agricultural projects',
      'Contribute using stable USDC tokens',
      'Track funding progress in real-time',
      'Join a community of agricultural supporters'
    ]
  },
  {
    title: 'Goal Achievement',
    description: 'Funds are released when projects reach their targets',
    icon: FaCheck,
    details: [
      'Smart contracts automatically track progress',
      'Funds held securely in escrow',
      'Automatic release when goal is met',
      'Transparent transaction history'
    ]
  }
];

const features = [
  {
    icon: FaWallet,
    title: 'Secure Wallet Integration',
    description: 'Connect MetaMask or other Web3 wallets to participate securely in the ecosystem.',
    benefits: ['Multi-signature security', 'Your keys, your control', 'Industry-standard encryption']
  },
  {
    icon: FaShieldAlt,
    title: 'Smart Contract Escrow',
    description: 'Funds are held safely in smart contracts until project goals are successfully met.',
    benefits: ['Automated fund release', 'No manual intervention', 'Transparent conditions']
  },
  {
    icon: FaChartLine,
    title: 'Real-time Tracking',
    description: 'Monitor project progress, funding status, and impact metrics in real-time.',
    benefits: ['Live funding updates', 'Project milestones', 'Impact measurements']
  },
  {
    icon: FaHandshake,
    title: 'Community Trust',
    description: 'Built on transparency with verified farmers and public transaction records.',
    benefits: ['Verified participants', 'Public blockchain records', 'Community governance']
  }
];

const faqs = [
  {
    question: 'How do I get started as an investor?',
    answer: 'Simply connect your MetaMask wallet, get some test USDC from our faucet, and browse available projects. You can contribute any amount above the minimum threshold.'
  },
  {
    question: 'What happens if a project doesn\'t reach its funding goal?',
    answer: 'If a project doesn\'t reach its funding goal within the specified timeframe, all contributors can claim a full refund through our smart contract system.'
  },
  {
    question: 'How are farmers verified?',
    answer: 'Farmers undergo a verification process by our administrators who check their credentials, project feasibility, and commitment to agricultural development.'
  },
  {
    question: 'What currencies can I use?',
    answer: 'Currently, we use USDC (USD Coin) stablecoin for all transactions to ensure price stability and reduce volatility risk for both farmers and investors.'
  },
  {
    question: 'How transparent are the transactions?',
    answer: 'All transactions are recorded on the Ethereum blockchain and are publicly verifiable. You can track every contribution and fund disbursement.'
  },
  {
    question: 'What fees does RootRise charge?',
    answer: 'RootRise operates with minimal fees. You only pay standard Ethereum network gas fees for transactions. No platform fees are currently charged.'
  }
];

export default function HowItWorksPage() {
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
            Platform Overview
          </Badge>
          <Heading
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight="bold"
            bgGradient="linear(to-r, green.600, blue.600)"
            bgClip="text"
            lineHeight="shorter"
          >
            How RootRise Works
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            maxW="3xl"
            lineHeight="tall"
          >
            Our platform creates a transparent bridge between global investors and Rwandan farmers, 
            enabling secure crowdfunding for agricultural projects through blockchain technology.
          </Text>
        </VStack>
      </Container>

      {/* Process Steps */}
      <Container maxW="7xl" py={16}>
        <VStack spacing={12}>
          <Heading fontSize="3xl" textAlign="center" color="gray.800">
            The RootRise Process
          </Heading>
          
          {/* Process Steps - Visual Timeline */}
          <Box w="full">
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
              {steps.map((step, index) => (
                <VStack key={index} spacing={4} position="relative">
                  {/* Step Circle */}
                  <Box
                    bg="brand.500"
                    color="white"
                    borderRadius="full"
                    w={16}
                    h={16}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    zIndex={2}
                  >
                    <Icon as={step.icon} w={8} h={8} />
                  </Box>
                  
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <Box
                      position="absolute"
                      top="32px"
                      left="50%"
                      w={{ base: 0, md: "calc(100% + 32px)" }}
                      h="2px"
                      bg="brand.200"
                      zIndex={1}
                      display={{ base: "none", md: "block" }}
                    />
                  )}
                  
                  {/* Step Content */}
                  <VStack spacing={2} textAlign="center">
                    <Badge colorScheme="brand" size="sm">
                      Step {index + 1}
                    </Badge>
                    <Heading fontSize="lg" color="gray.800">
                      {step.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      {step.description}
                    </Text>
                  </VStack>
                </VStack>
              ))}
            </SimpleGrid>
          </Box>

          {/* Detailed Steps */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {steps.map((step, index) => (
              <Card
                key={index}
                bg={cardBg}
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                transition="all 0.3s"
                h="full"
              >
                <CardBody p={6}>
                  <VStack spacing={4} align="start" h="full">
                    <HStack>
                      <Box
                        bg="brand.100"
                        p={3}
                        borderRadius="full"
                        display="inline-flex"
                      >
                        <Icon as={step.icon} w={6} h={6} color="brand.500" />
                      </Box>
                      <Badge colorScheme="brand" size="sm">
                        Step {index + 1}
                      </Badge>
                    </HStack>
                    
                    <Heading fontSize="lg" color="gray.800">
                      {step.title}
                    </Heading>
                    
                    <Text color="gray.600" fontSize="sm" mb={4}>
                      {step.description}
                    </Text>
                    
                    <List spacing={2} flex={1}>
                      {step.details.map((detail, detailIndex) => (
                        <ListItem key={detailIndex} fontSize="sm">
                          <ListIcon as={FaCheck} color="green.500" />
                          {detail}
                        </ListItem>
                      ))}
                    </List>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Key Features */}
      <Box bg="white" py={16}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading fontSize="3xl" color="gray.800">
                Platform Features
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Built with cutting-edge blockchain technology to ensure security, transparency, and trust.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {features.map((feature, index) => (
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
                        <Icon as={feature.icon} w={6} h={6} color="white" />
                      </Box>
                      <VStack spacing={3} align="start" flex={1}>
                        <Heading fontSize="xl" color="gray.800">
                          {feature.title}
                        </Heading>
                        <Text color="gray.600" lineHeight="tall">
                          {feature.description}
                        </Text>
                        <List spacing={1}>
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <ListItem key={benefitIndex} fontSize="sm" color="gray.500">
                              <ListIcon as={FaCheck} color="green.500" />
                              {benefit}
                            </ListItem>
                          ))}
                        </List>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxW="4xl" py={16}>
        <VStack spacing={8}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="3xl" color="gray.800">
              Frequently Asked Questions
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Everything you need to know about using RootRise
            </Text>
          </VStack>

          <Accordion allowToggle w="full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} border="1px" borderColor="gray.200" borderRadius="lg" mb={4}>
                <AccordionButton py={4} px={6} _hover={{ bg: 'gray.50' }}>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="semibold" color="gray.800">
                      {faq.question}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel py={4} px={6} bg="gray.50">
                  <Text color="gray.600" lineHeight="tall">
                    {faq.answer}
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      </Container>

      {/* Call to Action */}
      <Box bg="brand.500" color="white" py={16}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading fontSize="3xl">
              Ready to Get Started?
            </Heading>
            <Text fontSize="lg" maxW="2xl">
              Join thousands of investors and farmers building a more sustainable future through transparent agricultural finance.
            </Text>
            <HStack spacing={4} wrap="wrap" justify="center">
              <Button
                size="lg"
                bg="white"
                color="brand.500"
                _hover={{ bg: 'gray.100' }}
                onClick={() => router.push('/projects')}
                rightIcon={<FaArrowRight />}
              >
                Browse Projects
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
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}