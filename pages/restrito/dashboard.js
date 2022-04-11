import Error from '../../components/error';
import { AdmOnly } from '../../components/login-logout';
import Success from '../../components/sucess';

const DashBoard = () => {
  return (
    <>
      {AdmOnly() && <Success title="Dashboard" text="Monitoramento de dispositivos IOT" />}
      {!AdmOnly() && <Error title="Dashboard" text="Sem acesso a esta funcionalidade" />}
    </>
  );
};

export default DashBoard;
