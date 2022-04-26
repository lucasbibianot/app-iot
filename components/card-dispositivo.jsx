import { Heading, Box, Stack, Skeleton, Center, StackDivider } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Error from './error';
import MedidasDispositivo from './medidas-dispositivo';

export default function CardDispositivo({ dispositivo }) {
  const [series, setSeries] = useState([]);
  const [state, setState] = useState({ loading: true, error: false });
  const { loading, error } = state;

  useEffect(() => {
    setState({ ...state, loading: true });
    fetch(`/api/series/1d?topico=${dispositivo}&ultimo=true`)
      .then((res) => res.json())
      .then((j) => {
        setState({ ...state, loading: false });
        setSeries(j);
      })
      .catch((error) => {
        setState({ loading: false, error: true });
      });
  }, []);
  if (error) return <Error title="Erro" text={error} />;
  return (
    <Box
      maxW={'100%'}
      w={'full'}
      boxShadow={'2xl'}
      rounded={'md'}
      overflow={'hidden'}
    >
      <Box p={6}>
        <Center>
          <Stack spacing={0} align={'center'} mb={5}>
            <Skeleton isLoaded={!loading} paddingBottom="0.75rem">
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'} paddingBottom="0.75rem" align="center">
                {dispositivo}
              </Heading>
            </Skeleton>
            <StackDivider borderColor="gray.200" />
            <Skeleton isLoaded={!loading}>
              <MedidasDispositivo series={series} />
            </Skeleton>
          </Stack>
        </Center>
      </Box>
    </Box>
  );
}