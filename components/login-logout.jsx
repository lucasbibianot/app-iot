import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, MenuItem, Stack, Text } from '@chakra-ui/react';

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    !isAuthenticated && (
      <Button
        colorScheme={'green'}
        bg={'green.400'}
        rounded={'full'}
        px={6}
        _hover={{
          bg: 'green.500',
        }}
        onClick={() => loginWithRedirect()}
      >
        Entrar
      </Button>
    )
  );
};

export const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <MenuItem size={'sm'} onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Sair
    </MenuItem>
  );
};

export const AdmOnly = () => {
  const { user, isAuthenticated } = useAuth0();
  return isAuthenticated ? user.profile === 'administrator' : false;
};

export const Profile = ({ display }) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = process.env.AUTH0_DOMAIN;

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: 'read:current_user',
          },
        });

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user_metadata } = await metadataResponse.json();

        setUserMetadata(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);
  return (
    isAuthenticated && (
      <>
        <Stack spacing={0.5} margin={'0.10rem'} display={display}>
          <Text fontSize={'0.7rem'}>{user.name}</Text>
          <Text fontSize={'0.6rem'}>{user.email}</Text>
        </Stack>
        <Stack spacing={0.5} margin={'0.10rem'} display={{ md: 'none' }}>
          <Text fontSize={'0.5rem'}>{user.name}</Text>
        </Stack>
      </>
    )
  );
};

export default LoginButton;
