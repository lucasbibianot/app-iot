import { ArrowBackIcon } from '@chakra-ui/icons';
import { Button, Stack, StackDivider, Text, WrapItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import CardDashBoard from '../../../components/card-dashboard';
import base64 from '../../../lib/hash-utils';
import { Links } from '../../../components/header';

const Device = (props) => {
  const router = useRouter();
  const { hash } = router.query;
  if (hash)
    return (
      <WrapItem key={hash} padding={'1rem'}>
        <Stack direction={'column'} divider={<StackDivider borderColor="gray.200" />} spacing={1} align="center">
          <CardDashBoard dispositivo={base64.urlDecode(hash)} medidas={['temp', 'hum', 'temp_config']} />
          <Button
            rightIcon={<ArrowBackIcon />}
            onClick={() => router.push(Links.filter((row) => row.name === 'Dispositivos').find((e) => true).page)}
          >
            Voltar
          </Button>
        </Stack>
      </WrapItem>
    );

  return <Text>Carregando</Text>;
};

export default Device;
