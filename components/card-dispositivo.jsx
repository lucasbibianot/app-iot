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
  const [mqttStart, setMqttStart] = useState(false);
  const toast = useToast();

  const mensagemMQtt = ({ _value, topic_subscribe, _measurement, modo_operacao }) => {
    setState({ ...state, loading: true });
    setMqttStart(true);
    fetch(`/api/mqtt/publish`, {
      method: 'POST',
      body: JSON.stringify({
        topico: topic_subscribe,
        msg: {
          device: _measurement,
          value: _value,
          modo: modo_operacao,
        },
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((data) => {
        setTimeout(() => {
          setMqttStart(false);
        }, 400);
        toast({
          title: 'Comando enviado com sucesso.',
          description: `Comando enviado com sucesso para ${topic_subscribe}:${_measurement}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        setState({ ...state, loading: false });
        toast({
          title: 'Erro',
          description: `Ocorreu um erro ao processar comando: ${topic_subscribe}:${_measurement}`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const reboot = () => {
    mensagemMQtt({
      _value: 1,
      topic_subscribe: primeiroRegistro.topic_subscribe,
      _measurement: 'reboot',
      modo_operacao: 'a',
    });
  };
  const handlerModoOperacao = () => {
    const op = primeiroRegistro.modo_operacao === 'a' ? 'm' : 'a';
    mensagemMQtt({
      _value: 0,
      topic_subscribe: primeiroRegistro.topic_subscribe,
      _measurement: '',
      modo_operacao: op,
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
      })
      .catch((error) => {
        console.log(error);
        setState({ loading: false, error: true });
      });
  };

  useEffect(() => {
    setState({ ...state, loading: true });
    setMedidas();
  }, [mqttStart]);

  useEffect(() => {
    window.clearInterval(0);
    setMedidas();
  }, []);

  useEffect(() => {
    if (interval > 0) {
      let intervalId = null;
      const tick = () => setMedidas();
      if (interval !== null) {
        intervalId = window.setInterval(tick, interval);
      }
      return () => {
        if (intervalId) {
          window.clearInterval(intervalId);
        }
      };
    }
    window.clearInterval(0);
  }, [interval]);

  if (error) return <Error title="Erro" text={error} />;
  return (
    <Box maxW={'100%'} w={'full'} boxShadow={'2xl'} rounded={'md'} overflow={'hidden'}>
      <Stack direction={'row-reverse'}>
        <Tooltip label="Auto refresh">
          <>
            {interval > 0 && <Switch onChange={() => setInterval(0)} isChecked />}
            {interval == 0 && <Switch onChange={() => setInterval(30000)} />}
          </>
        </Tooltip>
      </Stack>
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
                      <Switch id="email-alerts" onChange={handlerModoOperacao} isChecked />
                    )}
                    {primeiroRegistro.modo_operacao === 'a' && (
                      <Switch id="email-alerts" onChange={handlerModoOperacao} />
                    )}
                  </>
                )}
                {!primeiroRegistro.online && (
                  <>
                    {primeiroRegistro.modo_operacao === 'm' && <Switch id="email-alerts" isChecked isDisabled />}
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
