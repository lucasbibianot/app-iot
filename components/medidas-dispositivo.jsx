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
        <Stack spacing={0} align={'center'} key={'s' + item._measurement}>
          {item.online ? <Tag colorScheme="green">online</Tag> : <Tag colorScheme="red">offline</Tag>}
          {item.online && item._measurement.startsWith('estado') && (
            <Skeleton isLoaded={!loading}>
              {Math.round(item._value) == 1 && (
                <Switch
                  size="md"
                  key={'s1' + item._measurement}
                  isChecked
                  onChange={() => mensagemMQtt({ ...item, modo_operacao: 'm', _value: 0 })}
                />
              )}
              {Math.round(item._value) == 0 && (
                <Switch
                  size="md"
                  key={'s1' + item._measurement}
                  onChange={() => mensagemMQtt({ ...item, modo_operacao: 'm', _value: 1 })}
                />
              )}
            </Skeleton>
          )}
          {!item._measurement.startsWith('estado') && !item._measurement.includes('config') && (
            <Text fontWeight={600} key={'t1' + item._measurement}>
              {item._value.toFixed(2)}
            </Text>
          )}

          {item._measurement.includes('config') && (
            <Tooltip label="clique para alterar">
              <Editable defaultValue={item._value} onSubmit={(val) => mensagemMQtt({...item, _value: val})}>
                <Stack direction={'row'}>
                  <EditablePreview fontWeight={600} padding={'0px'} margin={'0px'} size="xs" />
                  <Input as={EditableInput} size="xs" w={'3rem'} />
                  <EditableControls />
                </Stack>
              </Editable>
            </Tooltip>
          )}
          <Text fontWeight={'sm'} key={'t2' + item._measurement}>
            {item._measurement}
          </Text>
        </Stack>
      ))}
    </Wrap>
  );
}
