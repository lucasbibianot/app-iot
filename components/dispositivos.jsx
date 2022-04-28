import { Spinner, Text, Stack, StackDivider, Wrap, WrapItem } from '@chakra-ui/react';
import useSWR from 'swr';
import Error from './error';
import CardDispositivo from './card-dispositivo';
import base64 from '../lib/hash-utils';
import { useRouter } from 'next/router';

const Dispositivos = (props) => {
  const router = useRouter();
  const fetcher = (url) => {
    return fetch(url).then((res) => res.json());
  };
  const { data, error } = useSWR('/api/topics/1d', fetcher);
  if (error) return <Error title="Erro" text={error} />;
  if (!data)
    return (
      <Stack
        direction={'column'}
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="center"
        marginTop={'10rem'}
      >
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        <Text>Aguarde, estamos localizando os seus dispositivos</Text>
      </Stack>
    );

  const devices = data.map((item) => ({ topico: item, hash: base64.urlEncode(item) }));
  return (
    <Wrap>
      {devices.map((item) => (
        <WrapItem key={item.hash} padding={'1rem'}>
          <CardDispositivo dispositivo={item.topico} hash={item.hash} />
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default Dispositivos;
