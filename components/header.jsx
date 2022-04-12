import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  IconButton,
  useColorMode,
  Spacer,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Logo from './logo';
import { useAuth0 } from '@auth0/auth0-react';
import { LogoutButton, Profile } from './login-logout';

const Links = [
  { name: 'Principal', page: '/' },
  { name: 'Dashboard', page: '../restrito/dashboard' },
  { name: 'Operações', page: '../restrito/operacoes' },
];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={children.page}
  >
    {children.name}
  </Link>
);

export default function MenuHeader() {
  const { user, isAuthenticated } = useAuth0();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} w="100%">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={6} alignItems={'center'}>
            <Box>
              <Logo />
            </Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.page}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>

          {isAuthenticated && (
            <Flex alignItems={'right'}>
              <Profile />
              <Spacer w="3em" />
              <Menu>
                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                  <Avatar size={'md'} src={user.picture ? user.picture : 'https://joeschmoe.io/api/v1/random'} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={toggleColorMode}> Tema: {colorMode === 'light' ? 'Escuro' : 'Claro'} </MenuItem>
                  <MenuDivider />
                  <LogoutButton />
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
