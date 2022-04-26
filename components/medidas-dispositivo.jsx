import { Text, Stack, Skeleton, Tag, Switch, Wrap } from '@chakra-ui/react';
import { useState } from 'react';
import Error from './error';

export default function MedidasDispositivo({ series, mensagemMQtt }) {
  const [state, setState] = useState({ loading: false, error: false });
  const { loading, error } = state;
  if (error) return <Error title="Erro" text={error} />;
  return (
    <Wrap direction={['row']} justify={'center'} spacing={6}>
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
                  onChange={() => mensagemMQtt({ ...item, modo: 'm', valor: 0 })}
                />
              )}
              {Math.round(item.valor) == 0 && (
                <Switch
                  size="md"
                  key={'s1' + item.medida}
                  onChange={() => mensagemMQtt({ ...item, modo: 'm', valor: 1 })}
                />
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
    </Wrap>
  );
}
