import { Auth0Provider } from '@auth0/auth0-react';
import Head from 'next/head';
import NoSSR from 'react-no-ssr';
import { ChakraProvider, VStack, Box } from '@chakra-ui/react';
import LargeWithAppLinksAndSocial from '../components/footer';
import MenuHeader from '../components/header';
import theme from '../components/theme';

function MyApp({ Component, pageProps }) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
  return (
    <ChakraProvider theme={theme}>
      <Auth0Provider
        domain={process.env.AUTH0_DOMAIN}
        clientId={process.env.AUTH0_CLIENT_ID}
        redirectUri={process.env.URL}
        audience={process.env.AUTH0_AUDIENCE}
        scope="read:current_user update:current_user_metadata"
        cacheLocation="localstorage"
      >
        <Head>
          <title>IOT - Gerenciamento de Dispositivos</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NoSSR>
          <VStack>
            <MenuHeader />
            <Box padding={'1rem'}>
              <Component {...pageProps} />
            </Box>
            <LargeWithAppLinksAndSocial />
          </VStack>
        </NoSSR>
      </Auth0Provider>
    </ChakraProvider>
  );
}
export default MyApp;
