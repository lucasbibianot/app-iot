import { Spinner, Text, Stack, StackDivider, Wrap, WrapItem } from '@chakra-ui/react';
import useSWR from 'swr';
import CardDashBoard from '../../components/card-dashboard';
import Plotly from 'plotly.js-basic-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import Error from '../../components/error';
import { AdmOnly } from '../../components/login-logout';
('../components/card-dispositivo');

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
  <Plot
    data={[
      {
        x: [1, 2, 3],
        y: [2, 6, 3],
        type: 'scatter',
        marker: { color: 'red' },
      },
    ]}
    layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
  />;
};
export default DashBoard;
