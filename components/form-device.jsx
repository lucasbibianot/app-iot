import { Button, ButtonGroup, Tag, Select, Stack, Skeleton, Container, Divider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react';

const MyForm = (props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [topicos, setTopicos] = useState([]);
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
  const getInitialProps = async ({ req }) => {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
    return { userAgent };
  };

  const columns = [
    {
      title: 'Operação',
      render: (text) =>
        onLine && (
          <Button type="primary" htmlType="button" onClick={mensagemMQtt}>
            {form.getFieldValue('medidas') === 'estadoRele' && Math.round(series[0].valor) == 0 ? 'Ligar' : 'Desligar'}
          </Button>
        ),
    },
    {
      title: 'Tópico',
      dataIndex: 'topico',
      key: 'topico',
    },
    {
      title: 'Medida',
      dataIndex: 'medida',
      key: 'medida',
    },
    {
      title: 'Data/Hora',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Subscribed',
      dataIndex: 'topic_subscribe',
      key: 'topic_subscribe',
    },
    {
      title: 'Online',
      dataIndex: 'online',
      key: 'online',
      render: (text) => (text ? <Tag colorScheme="green">online</Tag> : <Tag colorScheme="red">offline</Tag>),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (text) =>
        Math.round(text) == 1 ? (
          <Tag colorScheme="green">Ligado</Tag>
        ) : Math.round(text) == 0 ? (
          <Tag colorScheme="red">Desligado</Tag>
        ) : (
          text
        ),
    },
  ];

  useEffect(() => {
    setState({ loading: true });
    fetch('api/topics/1d')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTopicos(data);
        setState({ loading: false });
      });
  }, []);

  const [state, setState] = useState({
    loading: true,
  });
  const { loading } = state;

  const onFinish = (values) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
    setMedidas([]);
    setSeries([]);
  };

  const onChangeTopic = async (topic) => {
    setState({ loading: true });
    setMedidas([]);
    setSeries([]);
    await fetch(`api/medidas/1d?topico=${topic}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMedidas(data);
        setState({ loading: false });
      });
  };
  const onChangeMedida = async (medida) => {
    setState({ loading: true });
    console.log(form.getFieldValue('topic'));
    await fetch(`api/series/1d?topico=${form.getFieldValue('topic')}&medida=${medida}&ultimo=true`)
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
      });
  };

  const atualizar = async () => {
    onChangeMedida(form.getFieldValue('medidas'));
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

  return (
    <>
      <Container>
        <Stack>
          <Skeleton height="20px" isLoaded={!loading} />
          <Skeleton height="20px" isLoaded={!loading} />
          <Skeleton height="20px" isLoaded={!loading} />
        </Stack>
        <Stack visibility={loading}>
          <form onSubmit={handleSubmit(onFinish)}>
            <FormControl as="fieldset" isInvalid={errors.name}>
              <FormLabel htmlFor="name">Selecione o Dispositivo</FormLabel>
              <Select
                placeholder="Selecione o dispositivo"
                onChange={onChangeTopic}
                isRequired={true}
                {...register('dispositivo', {
                  required: 'Este campo é requerido',
                  minLength: { value: 4, message: 'Minimum length should be 4' },
                })}
              >
                {topicos.map((item) => (
                  <option value={item}>{item}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>
            <FormControl as="fieldset" isInvalid={errors.name}>
              <FormLabel htmlFor="name">Selecione o Sensor</FormLabel>
              <Select
                placeholder="Selecione o Sensor"
                onChange={onChangeMedida}
                isRequired={true}
                {...register('dispositivo', {
                  required: 'Este campo é requerido',
                  minLength: { value: 4, message: 'Minimum length should be 4' },
                })}
              >
                {medidas.flatMap((item) =>
                  item.medida !== 'qtd_boot' ? <option value={item.medida}>{item.medida}</option> : <></>
                )}
              </Select>
              <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>
            <ButtonGroup variant="outline" spacing="6">
              <Button colorScheme="blue" onClick={atualizar}>
                Atualizar
              </Button>
              <Divider type="vertical" />
              <Button colorScheme="blue" onClick={onReset}>
                Reset
              </Button>
            </ButtonGroup>
          </form>
        </Stack>
      </Container>
      <TableContainer>
        <Table variant="simple"></Table>
      </TableContainer>
    </>
  );
};

export default MyForm;
