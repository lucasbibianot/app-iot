import { Spinner, GridItem, Text, Stack, StackDivider, Center, Grid } from '@chakra-ui/react';
import useSWR from 'swr';
import Error from './error';
import CardDispositivo from './card-dispositivo';
('../components/card-dispositivo');

const Dispositivos = (props) => {
  const fetcher = (url) => {
    return fetch(url).then((res) => res.json());
  };
  const { data, error } = useSWR('/api/topics/1d', fetcher);
  if (error) return <Error title="Erro" text={error} />;
  if (!data)
    return (
      <Stack direction={'column'} divider={<StackDivider borderColor="gray.200" />} spacing={4} align="center">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        <Text>Aguarde, estamos localizando os seus dispositivos</Text>
      </Stack>
    );
  return (
    <Grid templateColumns="repeat(2, 1fr)" id="gridDispositivos" gap={6} h="300px">
      {data.map((item) => (
        <GridItem w="100%" h="10" key={item}>
          <CardDispositivo dispositivo={item} />
        </GridItem>
      ))}
    </Grid>
  );
};

export default Dispositivos;
