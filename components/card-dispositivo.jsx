import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Tag,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import Error from './error';

export default function CardDispositivo(props) {
  const [medidas, setMedidas] = useState([]);
  const [series, setSeries] = useState([]);
  const [onLine, setOnLine] = useState([]);
  const [postMqtt, setPostMqtt] = useState({
    topico: '',
    msg: {
      device: '',
      value: 1,
      modo: 'a',
    },
  });
  const [state, setState] = useState({
    loading: true,
  });
  const { loading } = state;

  const fetcher = (url) => {
    setState({ loading: true });
    setMedidas([]);
    setSeries([]);
    return fetch(url).then((res) => {
      setMedidas(data);
      setState({ loading: false });
      return res.json();
    });
  };
  const { data, error } = useSWR(`/api/medidas/1d?topico=${props.title}`, fetcher);
  if (error) return <Error title="Erro" text={error} />;
  if (!data)
    return (
      <Box padding="6" boxShadow="lg">
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </Box>
    );
  const loadSeries = async (medida) => {
    setState({ loading: true });
    await fetch(`/api/series/1d?topico=${getValues('topico')}&medida=${medida}&ultimo=true`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data !== undefined) {
          setSeries(data);
          setOnLine(data[0].online);
          setPostMqtt({
            topico: data[0].topic_subscribe,
            msg: {
              device: data[0].medida,
              value: Math.round(data[0].valor) == 1 ? 0 : 1,
              modo: 'm',
            },
          });
          setState({ loading: false });
        }
      })
      .catch((error) => {
        setState({ loading: false });
      });
  };

  const mensagemMQtt = async () => {
    setState({ loading: true });
    await fetch(`api/mqtt/publish`, {
      method: 'POST',
      body: JSON.stringify(postMqtt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        return res;
      })
      .then((data) => {
        onChangeMedida(postMqtt.msg.device);
        medidas[0].valor = postMqtt.msg.value;
        setState({ loading: false });
      });
  };
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: 'Operação',
  //       Cell: ({ text }) =>
  //         onLine && (
  //           <Button type="primary" htmlType="button" onClick={mensagemMQtt}>
  //             {/* {getValues('medidas') === 'estadoRele' && Math.round(series[0].valor) == 0 ? 'Ligar' : 'Desligar'} */}
  //           </Button>
  //         ),
  //     },
  //     {
  //       Header: 'Tópico',
  //       accessor: 'topico',
  //       id: 'topico',
  //     },
  //     {
  //       Header: 'Medida',
  //       accessor: 'medida',
  //       id: 'medida',
  //     },
  //     {
  //       Header: 'Data/Hora',
  //       accessor: 'time',
  //       id: 'time',
  //     },
  //     {
  //       Header: 'Subscribed',
  //       accessor: 'topic_subscribe',
  //       id: 'topic_subscribe',
  //     },
  //     {
  //       Header: 'Online',
  //       accessor: 'online',
  //       id: 'online',
  //       Cell: ({ text }) => (text ? <Tag colorScheme="green">online</Tag> : <Tag colorScheme="red">offline</Tag>),
  //     },
  //     // {
  //     //   Header: 'Valor',
  //     //   accessor: 'valor',
  //     //   id: 'valor',
  //     //   Cell: ({text}) =>
  //     //     Math.round(text) == 1 ? (
  //     //       <Tag colorScheme="green">Ligado</Tag>
  //     //     ) : Math.round(text) == 0 ? (
  //     //       <Tag colorScheme="red">Desligado</Tag>
  //     //     ) : (
  //     //       text
  //     //     ),
  //     // },
  //   ],
  //   []
  // );

  return (
    <Center py={6}>
      <Box
        maxW={'100%'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
      >
        <Flex justify={'center'} mt={-12}>
          <Avatar
            size={'xl'}
            src={''}
            alt={'Author'}
            css={{
              border: '2px solid white',
            }}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
              {props.title}
            </Heading>
            <Text color={'gray.500'}>Frontend Developer</Text>
          </Stack>

          <Stack direction={'row'} justify={'center'} spacing={6}>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>23k</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Followers
              </Text>
            </Stack>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>23k</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Followers
              </Text>
            </Stack>
          </Stack>

          <Button
            w={'full'}
            mt={8}
            bg={useColorModeValue('#151f21', 'gray.900')}
            color={'white'}
            rounded={'md'}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
          >
            Follow
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
