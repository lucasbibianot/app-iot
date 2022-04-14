import { Button, ButtonGroup, Tag, Select, Stack, Skeleton, Container, Divider } from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { useTable, useSortBy } from 'react-table';

const MyForm = (props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const defaultData = [
    { topico: '', medida: '', time: '', topic_subscribe: '', online: '', valor: '', isNumeric: false },
    { topico: '', medida: '', time: '', topic_subscribe: '', online: '', valor: '', isNumeric: false},
  ];

  const [topicos, setTopicos] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [series, setSeries] = useState([]);
  const mydata = useMemo(() => series, []);
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

  const columns = useMemo(
    () => [
      {
        Header: 'Operação',
        Cell: ({ text }) =>
          onLine && (
            <Button type="primary" htmlType="button" onClick={mensagemMQtt}>
              {getValues('medidas') === 'estadoRele' && Math.round(series[0].valor) == 0 ? 'Ligar' : 'Desligar'}
            </Button>
          ),
      },
      {
        Header: 'Tópico',
        accessor: 'topico',
        id: 'topico',
      },
      {
        Header: 'Medida',
        accessor: 'medida',
        id: 'medida',
      },
      {
        Header: 'Data/Hora',
        accessor: 'time',
        id: 'time',
      },
      {
        Header: 'Subscribed',
        accessor: 'topic_subscribe',
        id: 'topic_subscribe',
      },
      {
        Header: 'Online',
        accessor: 'online',
        id: 'online',
        Cell: ({ text }) => (text ? <Tag colorScheme="green">online</Tag> : <Tag colorScheme="red">offline</Tag>),
      },
      // {
      //   Header: 'Valor',
      //   accessor: 'valor',
      //   id: 'valor',
      //   Cell: ({text}) =>
      //     Math.round(text) == 1 ? (
      //       <Tag colorScheme="green">Ligado</Tag>
      //     ) : Math.round(text) == 0 ? (
      //       <Tag colorScheme="red">Desligado</Tag>
      //     ) : (
      //       text
      //     ),
      // },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns: columns, data: mydata }, useSortBy);
  const [state, setState] = useState({
    loading: true,
  });
  const { loading } = state;

  const onFinish = (values) => {
    console.log(values);
  };

  useEffect(() => {
    setState({ loading: true });
    fetch('/api/topics/30d')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTopicos(data);
        setState({ loading: false });
      })
      .catch((error) => {
        setState({ loading: false });
      });
  }, []);

  const onReset = () => {
    reset({});
    setMedidas([]);
    setSeries([]);
  };

  const onChangeTopic = async (topic) => {
    setState({ loading: true });
    setMedidas([]);
    setSeries([]);
    await fetch(`/api/medidas/1d?topico=${topic}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMedidas(data);
        setState({ loading: false });
      })
      .catch((error) => {
        setState({ loading: false });
      });
  };
  const onChangeMedida = async (medida) => {
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

  const atualizar = async () => {
    onChangeMedida(getValues('medidas'));
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
        <Stack overflow="hidden">
          <form onSubmit={handleSubmit(onFinish)}>
            <Stack>
              <FormControl as="fieldset" isInvalid={errors.name}>
                <FormLabel htmlFor="name">Selecione o Dispositivo</FormLabel>
                <Select
                  placeholder="Selecione o dispositivo"
                  onSelect={onChangeTopic}
                  isRequired={true}
                  {...register('dispositivo', {
                    required: 'Este campo é requerido',
                    minLength: { value: 4, message: 'Minimum length should be 4' },
                  })}
                >
                  {topicos.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
              </FormControl>
            </Stack>
            <Stack>
              <FormControl as="fieldset" isInvalid={errors.name}>
                <FormLabel htmlFor="name">Selecione o Sensor</FormLabel>
                <Select
                  placeholder="Selecione o Sensor"
                  onChange={onChangeMedida}
                  isRequired={true}
                  {...register('medidas', {
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
            </Stack>
            <Stack>
              <ButtonGroup variant="outline">
                <Button colorScheme="blue" onClick={atualizar}>
                  Atualizar
                </Button>
                <Divider type="vertical" />
                <Button colorScheme="blue" onClick={onReset}>
                  Reset
                </Button>
              </ButtonGroup>
            </Stack>
          </form>
        </Stack>
      </Container>
      <TableContainer>
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())} isNumeric={column.isNumeric}>
                    {column.render('Header')}
                    <chakra.span pl="4">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MyForm;
