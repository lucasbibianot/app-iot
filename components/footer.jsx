import { ReactNode } from 'react';

import { Box, Container, Link, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import Logo from './logo';

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function LargeWithLogoLeft() {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.700', 'gray.200')} w="100%">
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' }} spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Logo color={useColorModeValue('gray.700', 'white')} />
            </Box>
            <Text fontSize={'sm'}>© 2022 - heißer</Text>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Produtos</ListHeader>
            <Link href={'#'}>Visão Geral</Link>
            <Link href={'#'}>Funcionalidades</Link>
            <Link href={'#'}>Créditos</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Suporte</ListHeader>
            <Link href={'#'}>Help Center</Link>
            <Link href={'#'}>Privacy Policy</Link>
            <Link href={'#'}>Status</Link>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
