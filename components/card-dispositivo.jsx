import { RepeatClockIcon } from '@chakra-ui/icons';
import {
  Heading,
  Box,
  Stack,
  Skeleton,
  Center,
  StackDivider,
  useToast,
  Switch,
  Text,
  Button,
  useInterval,
  Tag,
  Tooltip,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Error from './error';
import MedidasDispositivo from './medidas-dispositivo';
import TimeAgo from 'timeago-react';
import pt_BR from 'timeago.js/lib/lang/pt_BR';
import * as timeago from 'timeago.js';
import { FaChartBar } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { Links } from './header';
import moment from 'moment';
import CustomCard from './custom-card';

export default function CardDispositivo({ dispositivo, hash }) {
  timeago.register('pt_BR', pt_BR);
  const router = useRouter();
  const [interval, setInterval] = useState(0);
  const [series, setSeries] = useState([]);
  const [primeiroRegistro, setPrimeiroRegistro] = useState({ online: false, time: new Date(), modo_operacao: 'a' });
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
          title: 'Comando enviado com sucesso.',
          description: `Comando enviado com sucesso para ${topic_subscribe}:${medida}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => console.log(error));
  };

  const reboot = () => {
    mensagemMQtt({
      valor: 1,
      topic_subscribe: primeiroRegistro.topic_subscribe,
      medida: 'reboot',
      modo: 'a',
    });
  };
  const handlerModoOperacao = () => {
    const op = primeiroRegistro.modo_operacao === 'a' ? 'm' : 'a';
    mensagemMQtt({
      valor: 0,
      topic_subscribe: primeiroRegistro.topic_subscribe,
      medida: '',
      modo: op,
    });
  };

  const setMedidas = () => {
    setState({ ...state, loading: true });
    fetch(`/api/series/1d?topico=${dispositivo}&ultimo=true`)
      .then((res) => res.json())
      .then((j) => {
        setState({ ...state, loading: false });
        const primeiro = j.find((e) => true);
        if (primeiro) {
          setPrimeiroRegistro(primeiro);
        }
        setSeries(j);
        setInterval(20000);
      })
      .catch((error) => {
        console.log(error)
        setState({ loading: false, error: true });
      });
  };
  useInterval(setMedidas, interval);

  if (error) return <Error title="Erro" text={error} />;
  return (
    <Box maxW={'100%'} w={'full'} boxShadow={'2xl'} rounded={'md'} overflow={'hidden'}>
      <Box p={6}>
        <Center>
          <Stack spacing={0} align={'center'} mb={5}>
            <Skeleton isLoaded={!loading}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'} paddingBottom="0.75rem" align="center">
                {primeiroRegistro.nome_dispositivo ? (
                  <Tooltip label={dispositivo}>{primeiroRegistro.nome_dispositivo}</Tooltip>
                ) : (
                  dispositivo
                )}
              </Heading>
            </Skeleton>
            <Skeleton paddingBottom="0.75rem" isLoaded={!loading}>
              <Stack direction={'row'} align="center">
                <Text fontWeight={'sm'}>Operação Manual?</Text>
                {primeiroRegistro.online && (
                  <>
                    {primeiroRegistro.modo_operacao === 'm' && (
                      <Switch id="email-alerts" onChange={handlerModoOperacao} isSelected />
                    )}
                    {primeiroRegistro.modo_operacao === 'a' && (
                      <Switch id="email-alerts" onChange={handlerModoOperacao} />
                    )}
                  </>
                )}
                {!primeiroRegistro.online && (
                  <>
                    {primeiroRegistro.modo_operacao === 'm' && <Switch id="email-alerts" isSelected isDisabled />}
                    {primeiroRegistro.modo_operacao === 'a' && <Switch id="email-alerts" isDisabled />}
                  </>
                )}
                <Button
                  leftIcon={<RepeatClockIcon />}
                  colorScheme="red"
                  variant="solid"
                  size={'sm'}
                  onClick={reboot}
                  disabled={!primeiroRegistro.online}
                >
                  Reiniciar
                </Button>
              </Stack>
            </Skeleton>
            <StackDivider borderColor="gray.200" />
            <Skeleton isLoaded={!loading}>
              <MedidasDispositivo series={series} mensagemMQtt={mensagemMQtt} />
            </Skeleton>
            <StackDivider borderColor="gray.200" padding={'0.5rem'} />
            <Skeleton isLoaded={!loading}>
              <Tooltip label={moment(primeiroRegistro.time).format('DD/MM/YYYY HH:mm:ss')}>
                <CustomCard>
                  <TimeAgo datetime={primeiroRegistro.time} locale={'pt_BR'} margin={'0.25rem'} />
                </CustomCard>
              </Tooltip>
            </Skeleton>
            <Skeleton isLoaded={!loading}>
              <Button
                rightIcon={<FaChartBar />}
                onClick={() => router.push(Links.filter((row) => row.name === 'Device').find((e) => true).page + hash)}
                margin={'0.25rem'}
              >
                Detalhes
              </Button>
            </Skeleton>
          </Stack>
        </Center>
      </Box>
    </Box>
  );
}
