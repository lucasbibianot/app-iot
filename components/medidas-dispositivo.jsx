import { Text, Stack, Skeleton, StackDivider, Tag, Switch, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import Error from './error';

export default function MedidasDispositivo({ series }) {
  const [state, setState] = useState({ loading: false, error: false });
  const { loading, error } = state;
  const toast = useToast();

  const mensagemMQtt = ({ valor, topico, medida }) => {
    setState({ ...state, loading: true });
    fetch(`/api/mqtt/publish`, {
      method: 'POST',
      body: JSON.stringify({
        topico: topico,
        msg: {
          device: medida,
          value: valor,
          modo: 'a',
        },
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.text())
      .then((data) => {
        setState({ ...state, loading: false });
        toast({
          title: 'Comando executado com sucesso.',
          description: `Comando executado com sucesso em ${topico}:${medida}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => console.log(error));
  };

  if (error) return <Error title="Erro" text={error} />;
  return (
    <Stack direction={['row']} justify={'center'} spacing={6} divider={<StackDivider borderColor="gray.200" />}>
      {series.map((item) => (
        <Stack spacing={0} align={'center'} key={'s' + item.medida}>
          {item.online ? <Tag colorScheme="green">online</Tag> : <Tag colorScheme="red">offline</Tag>}
          {item.online && item.medida.startsWith('estado') && (
            <Skeleton isLoaded={!loading}>
              {Math.round(item.valor) == 1 && (
                <Switch
                  size="md"
                  key={'s1' + item.medida}
                  isChecked
                  onChange={() => mensagemMQtt({ ...item, valor: 0 })}
                />
              )}
              {Math.round(item.valor) == 0 && (
                <Switch size="md" key={'s1' + item.medida} onChange={() => mensagemMQtt({ ...item, valor: 1 })} />
              )}
            </Skeleton>
          )}
          {!item.medida.startsWith('estado') && (
            <Text fontWeight={600} key={'t1' + item.medida}>
              {item.valor}
            </Text>
          )}
          <Text fontWeight={'sm'} key={'t2' + item.medida}>
            {item.medida}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
