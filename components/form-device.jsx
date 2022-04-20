import { Stack, Skeleton, Container, Box, SkeletonCircle, SkeletonText, VStack } from '@chakra-ui/react';
import useSWR from 'swr';
import Error from '../components/error';
import CardDispositivo from './card-dispositivo';
('../components/card-dispositivo');

const MyForm = (props) => {
  const fetcher = (url) => {
    return fetch(url).then((res) => res.json());
  };
  const { data, error } = useSWR('/api/topics/1d', fetcher);
  if (error) return <Error title="Erro" text={error} />;
  if (!data)
    return (
      <Container>
        <Box padding="6" boxShadow="lg">
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </Box>
      </Container>
    );

  const getInitialProps = async ({ req }) => {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
    return { userAgent };
  };
  return (
    <>
      <Container>
        {data.map((item) => (
          <VStack key={item}>
            <CardDispositivo title={item} />
          </VStack>
        ))}
      </Container>
    </>
  );
};

export default MyForm;
