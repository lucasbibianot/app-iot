import { Spinner, Text, Stack, StackDivider } from '@chakra-ui/react';
import useSWR from 'swr';
import Error from '../../components/error';
import { AdmOnly } from '../../components/login-logout';
import dynamic from 'next/dynamic'


const PlotTeste = dynamic(import('../../components/plot'), {
  ssr: false,
});

const DashBoard = (props) => {
  const Plot = createPlotlyComponent(Plotly);
  const fetcher = (url) => {
    return fetch(url).then((res) => res.json());
  };
  const { data, error } = useSWR('/api/topics/1d', fetcher);
  if (error) return <Error title="Erro" text={error} />;
  if (!data)
    return (
      <Stack
        direction={'column'}
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="center"
        marginTop={'10rem'}
      >
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        <Text>Aguarde, estamos localizando os seus dispositivos</Text>
      </Stack>
    );
  // return (
  //   <>
  //     {AdmOnly() && (
  //       <Wrap>
  //         {data.map((item) => (
  //           <WrapItem key={item} padding={'1rem'}>
  //             <CardDashBoard dispositivo={item} medidas={['temp', 'hum', 'temp_config']} />
  //           </WrapItem>
  //         ))}
  //       </Wrap>
  //     )}
  //     {!AdmOnly() && <Error title="Dashboard" text="Sem acesso a esta funcionalidade" />}
  //   </>
  // );
  <PlotTeste />;
};
export default DashBoard;
