import { Charts, ChartContainer, ChartRow, YAxis, LineChart, EventMarker} from 'react-timeseries-charts';
import { TimeSeries } from 'pondjs';
import { Box, Center, Heading, Skeleton, Spinner, Stack, StackDivider, Text } from '@chakra-ui/react';
import styler from 'react-timeseries-charts/lib/js/styler';
import { useEffect, useState } from 'react';
import moment from 'moment';

const CardDashBoard = ({ dispositivo, medidas }) => {
  const [medida1, medida2, medida3] = medidas;
  const [state, setState] = useState({
    tracker: null,
    trackerValue: '-- °C',
    trackerEvent: null,
    markerMode: 'flag',
  });
  const [stateFetch, setStateFetch] = useState({ loading: true });
  const { loading } = stateFetch;
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  const style = styler([
    { key: medida1, color: '#CA4040' },
    { key: medida2, color: '#9467bd' },
    { key: medida3, color: '#987951' },
    {
      key: 'baseLine',
      line: {
        stroke: 'steelblue',
        strokeWidth: 1,
        opacity: 0.4,
        strokeDasharray: 'none',
      },
      label: {
        fill: 'steelblue',
      },
    },
  ]);

  const NullMarker = (props) => {
    return <g />;
  };
  const fetcher = (url) => {
    return fetch(url).then((res) => res.json());
  };

  useEffect(async () => {
    setStateFetch({ loading: true });
    const res1 = await fetcher(`/api/series/1d?topico=${dispositivo}&medida=${medida1}&timeseries=true`);
    setData1(res1);
    const res2 = await fetcher(`/api/series/1d?topico=${dispositivo}&medida=${medida2}&timeseries=true`);
    setData2(res2);
    const res3 = await fetcher(`/api/series/1d?topico=${dispositivo}&medida=${medida3}&timeseries=true`);
    setData3(res3);
    setStateFetch({ loading: false });
  }, []);

  const renderMarker = (eixo, key, evento) => {
    if (!state.tracker) {
      return <NullMarker />;
    }
    if (state.markerMode === 'flag') {
      return (
        <EventMarker
          type="flag"
          axis={eixo}
          event={state[evento]}
          column={eixo}
          info={state[key]}
          infoTimeFormat="%Y"
          infoWidth={120}
          markerRadius={2}
          markerStyle={{ fill: 'black' }}
        />
      );
    } else {
      return (
        <EventMarker
          type="point"
          axis={eixo}
          event={state[evento]}
          column={eixo}
          markerLabel={'('+ moment(state.tracker).format('DD/MM/YYYY HH:mm:ss') + ') ' + state[key]}
          // markerLabelStyle={{ fill: 'dark-gray' }}
          markerRadius={3}
          // markerStyle={{ fill: 'gray' }}
        />
      );
    }
  };

  const handleTrackerChanged = (medida1Series, medida2Series, medida3Series, t) => {
    if (t) {
      const e1 = medida1Series.atTime(t);
      const e2 = medida2Series.atTime(t);
      const e3 = medida3Series.atTime(t);
      const eventTime1 = new Date(e1.begin().getTime() + (e1.end().getTime() - e1.begin().getTime()) / 2);
      const eventTime2 = new Date(e2.begin().getTime() + (e2.end().getTime() - e2.begin().getTime()) / 2);
      const eventTime3 = new Date(e3.begin().getTime() + (e3.end().getTime() - e3.begin().getTime()) / 2);
      const eventValue1 = e1.get(medida1);
      const eventValue2 = e2.get(medida2);
      const eventValue3 = e3.get(medida3);
      const v1 = `${eventValue1 > 0 ? '+' : ''}${eventValue1}°C - Limite inferior ${eventValue3}°C`;
      const v2 = `${eventValue2} %`;
      const v3 = `${eventValue3 > 0 ? '+' : ''}${eventValue3}°C`;

      setState({
        tracker: eventTime1,
        trackerValue1: v1,
        trackerValue2: v2,
        trackerValue3: v3,
        trackerEvent1: e1,
        trackerEvent2: e2,
        trackerEvent3: e3,
      });
    } else {
      setState({
        tracker: null,
        trackerValue1: null,
        trackerValue2: null,
        trackerValue3: null,
        trackerEvent1: null,
        trackerEvent2: null,
        trackerEvent3: null,
      });
    }
  };

  if (loading) {
    return (
      <Stack direction={'column'} divider={<StackDivider borderColor="gray.200" />} align="center" marginTop={'3rem'}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        <Text>Carregando o gráfico para {dispositivo}</Text>
      </Stack>
    );
  }

  if (!loading) {
    const medida1Series = new TimeSeries(data1);
    const medida2Series = new TimeSeries(data2);
    const medida3Series = new TimeSeries(data3);

    return (
      <Box maxW={'100%'} w={'full'} boxShadow={'2xl'} rounded={'md'} overflow={'visible'}>
        <Box p={6}>
          <Center>
            <Stack spacing={0} align={'center'} mb={5}>
              <Skeleton isLoaded={!loading}>
                <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'} paddingBottom="0.75rem" align="center">
                  {dispositivo} nas últimas 24 horas
                </Heading>
              </Skeleton>
              <ChartContainer
                timeRange={medida1Series.timerange()}
                showGridPosition="under"
                utc={true}
                enablePanZoom={true}
                enableDragZoom={true}
                trackerPosition={state.tracker}
                onTrackerChanged={(event) => handleTrackerChanged(medida1Series, medida2Series, medida3Series, event)}
              >
                <ChartRow height="150">
                  <YAxis
                    id={medida1}
                    label="Temperatura (°C)"
                    labelOffset={5}
                    style={style.axisStyle(medida1)}
                    min={0}
                    max={70}
                    width="80"
                    type="linear"
                    format=",.1f"
                  />
                  <Charts>
                    <LineChart axis={medida1} series={medida1Series} columns={[medida1]} style={style} />
                    <LineChart axis={medida1} series={medida3Series} columns={[medida3]} style={style} />
                    {renderMarker(medida1, 'trackerValue1', 'trackerEvent1')}
                  </Charts>
                </ChartRow>
                <ChartRow>
                  <YAxis
                    id={medida2}
                    label="Humidade"
                    labelOffset={5}
                    style={style.axisStyle(medida2)}
                    min={0}
                    max={100}
                    width="80"
                    type="linear"
                    format=",.1f"
                  />
                  <Charts>
                    <LineChart axis={medida2} series={medida2Series} columns={[medida2]} style={style} />
                    {renderMarker(medida2, 'trackerValue2', 'trackerEvent2')}
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
