import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from 'react-timeseries-charts';
import { TimeSeries } from 'pondjs';
import useSWR from 'swr';
import { Box, Center, Heading, Skeleton, Stack, Text } from '@chakra-ui/react';
import styler from 'react-timeseries-charts/lib/js/styler';

const CardDashBoard = ({ dispositivo }) => {
  const fetcher = (url) => {
    return fetch(url).then((res) => res.json());
  };
  const { data, error } = useSWR(`/api/series/1d?topico=${dispositivo}&medida=temp&timeseries=true`, fetcher);

  const style = styler([
    { key: 'temp', color: '#CA4040' },
    { key: 'pressure', color: '#9467bd' },
    { key: 'wind', color: '#987951' },
    { key: 'gust', color: '#CC862A' },
    { key: 'rain', color: '#C3CBD4' },
    { key: 'rainAccum', color: '#333' },
  ]);
  if (!data) {
    return <Text>Carregando</Text>;
  }
  if (data) {
    const dataTitle = { ...data, name: 'Temperatura' };
    const tempSeries = new TimeSeries(dataTitle);
    console.log(tempSeries);
    return (
      <Box maxW={'100%'} w={'full'} boxShadow={'2xl'} rounded={'md'} overflow={'hidden'}>
        <Box p={6}>
          <Center>
            <Stack spacing={0} align={'center'} mb={5}>
              <Skeleton isLoaded={data}>
                <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'} paddingBottom="0.75rem" align="center">
                  {dispositivo}
                </Heading>
              </Skeleton>
              <ChartContainer timeRange={tempSeries.timerange()} width={800}>
                <ChartRow height="150">
                  <YAxis
                    id="temp"
                    label="Temperatura (°C)"
                    labelOffset={5}
                    style={style.axisStyle('temp')}
                    min={0}
                    max={70}
                    width="80"
                    type="linear"
                    format=",.1f"
                  />
                  <Charts>
                    <LineChart axis="temp" series={tempSeries} columns={['temp']} style={style} />
                  </Charts>
                </ChartRow>
              </ChartContainer>
            </Stack>
          </Center>
        </Box>
      </Box>
    );
  }
};
export default CardDashBoard;
