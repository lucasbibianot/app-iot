import { RepeatClockIcon } from '@chakra-ui/icons';
import { Heading, Box, Stack, Skeleton, Center, StackDivider, useToast, Switch, Text, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Error from './error';
import MedidasDispositivo from './medidas-dispositivo';

export default function CardDispositivo({ dispositivo }) {
  const [series, setSeries] = useState([]);
  const [modoOperacao, setModoOperacao] = useState('a');
  const [state, setState] = useState({ loading: true, error: false });
  const { loading, error } = state;
  const toast = useToast();

  const mensagemMQtt = ({ valor, topic_subscribe, medida, modo }) => {
    setState({ ...state, loading: true });
    fetch(`/api/mqtt/publish`, {
      method: 'POST',
      body: JSON.stringify({
        topico: topic_subscribe,
        msg: {
          device: medida,
          value: valor,
          modo: modo,
        },
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((data) => {
        setState({ ...state, loading: false });
        setModoOperacao(modo);
        toast({
          title: 'Comando executado com sucesso.',
          description: `Comando executado com sucesso em ${topic_subscribe}:${medida}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => console.log(error));
  };

  const reboot = () => {
    mensagemMQtt({
      valor: 0,
      topic_subscribe: dispositivo,
      medida: 'reboot',
      modo: 'a',
    });
  };
  const handlerModoOperacao = () => {
    const op = modoOperacao === 'a' ? 'm' : 'a';
    mensagemMQtt({
      valor: 0,
      topic_subscribe: dispositivo,
      medida: '',
      modo: op,
    });
  };

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
    <Box maxW={'100%'} w={'full'} boxShadow={'2xl'} rounded={'md'} overflow={'hidden'}>
      <Box p={6}>
        <Center>
          <Stack spacing={0} align={'center'} mb={5}>
            <Skeleton isLoaded={!loading}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'} paddingBottom="0.75rem" align="center">
                {dispositivo}
              </Heading>
            </Skeleton>
            <Skeleton paddingBottom="0.75rem" isLoaded={!loading}>
              <Stack direction={'row'} align="center">
                <Text fontWeight={'sm'}>Operação Manual?</Text>
                <Switch id="email-alerts" onChange={handlerModoOperacao} />
                <Button leftIcon={<RepeatClockIcon />} colorScheme="red" variant="solid" size={'sm'} onClick={reboot}>
                  Reiniciar
                </Button>
              </Stack>
            </Skeleton>
            <StackDivider borderColor="gray.200" />
            <Skeleton isLoaded={!loading}>
              <MedidasDispositivo series={series} mensagemMQtt={mensagemMQtt} />
            </Skeleton>
          </Stack>
        </Center>
      </Box>
    </Box>
  );
}
