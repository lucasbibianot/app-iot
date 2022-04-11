import { AdmOnly } from '../../components/login-logout';
import Error from '../../components/error';
import Success from '../../components/sucess';

const Operacoes = () => {
  console.log(AdmOnly());
  return (
    <>
      {AdmOnly() && <Success title="Operações" text="Monitoramento de dispositivos IOT" />}
      {!AdmOnly() && <Error title="Operações" text="Sem acesso a esta funcionalidade" />}
    </>
  );
};

export default Operacoes;
