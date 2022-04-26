import Error from '../../components/error';
import { AdmOnly } from '../../components/login-logout';
import Success from '../../components/sucess';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from 'react-timeseries-charts';
import { TimeSeries, TimeRange } from 'pondjs';
import useSWR from 'swr';
import { Text } from '@chakra-ui/react';

const DashBoard = () => {
  const fetcher = (url) => {
    return fetch(url).then((res) => res.json());
  };
  const { data, error } = useSWR(
    '/api/series/1d?topico=device/sensor/ronan/granja/1?medida=temp&timeseries=true',
    fetcher
  );
  if (!data) {
    return (<Text>Carregando</Text>)
  }
  if (data) {
    const timeseries = new TimeSeries(data);
    return (
      <>
        {/* {AdmOnly() && <Success title="Dashboard" text="Monitoramento de dispositivos IOT" />}
      {!AdmOnly() && <Error title="Dashboard" text="Sem acesso a esta funcionalidade" />} */}
        <ChartContainer timeRange={timeseries.timerange()} width={800}>
          <ChartRow height="200">
            <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f" />
            <Charts>
              <LineChart axis="axis1" series={timeseries} />
            </Charts>
            <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f" />
          </ChartRow>
        </ChartContainer>
      </>
    );
  }
};
export default DashBoard;
