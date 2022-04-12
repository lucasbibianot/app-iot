import { AdmOnly } from '../../components/login-logout';
import Error from '../../components/error';
import Success from '../../components/sucess';
import MyForm from '../../components/form-device';

const Operacoes = () => {
  return (
    <>
      {/* {AdmOnly() && <Success title="Operações" text="Monitoramento de dispositivos IOT" />}
      {!AdmOnly() && <Error title="Operações" text="Sem acesso a esta funcionalidade" />} */}
      <MyForm />
    </>
  );
};

export default Operacoes;
