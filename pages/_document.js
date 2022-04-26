import { ColorModeScript } from '@chakra-ui/react';
import { Html, Head, Main, NextScript } from 'next/document';
import theme from '../components/theme';

const myDocument = () => {
  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default myDocument;
