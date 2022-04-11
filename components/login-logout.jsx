import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, Avatar, Box, Button } from '@chakra-ui/react';

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
        Log In
      </Button>
    )
  );
};

export const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <Button
      colorScheme={'green'}
      bg={'green.400'}
      rounded={'full'}
      fontSize="sm"
      px={3}
      _hover={{
        bg: 'green.500',
      }}
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Log Out
    </Button>
  );
};

export const AdmOnly = () => {
  const { user, isAuthenticated } = useAuth0();
  return isAuthenticated ? user.profile === 'administrator' : false;
};

export const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = process.env.AUTH0_DOMAIN;
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: 'read:current_user',
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
  }, [getAccessTokenSilently, user?.sub, user]);
  return (
    isAuthenticated && (
      <Accordion key={'c3'} bordered={false}>
        <AccordionItem>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </AccordionItem>
      </Accordion>
    )
  );
};

export default LoginButton;
