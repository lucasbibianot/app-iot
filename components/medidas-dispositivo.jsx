import {
  Text,
  Stack,
  Skeleton,
  Tag,
  Switch,
  Wrap,
  Editable,
  Input,
  EditableInput,
  EditablePreview,
  Tooltip,
} from '@chakra-ui/react';
import { useState } from 'react';
import EditableControls from './editable-text';
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
          {!item.medida.startsWith('estado') && !item.medida.includes('config') && (
            <Text fontWeight={600} key={'t1' + item.medida}>
              {item.valor}
            </Text>
          )}

          {item.medida.includes('config') && (
            <Tooltip label="clique para alterar">
              <Editable
                defaultValue={item.valor}
                onSubmit={(val) => mensagemMQtt({ ...item, medida: 'temp', modo: 'm', valor: val })}
              >
                <EditablePreview fontWeight={600} padding={'0px'} margin={'0px'} size="xs" />
                <Input as={EditableInput} size="xs" w={'3rem'} />
              </Editable>
            </Tooltip>
          )}
          <Text fontWeight={'sm'} key={'t2' + item.medida}>
            {item.medida}
          </Text>
        </Stack>
      ))}
    </Wrap>
  );
}
