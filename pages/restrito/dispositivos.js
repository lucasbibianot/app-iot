import { AdmOnly } from '../../components/login-logout';
import Error from '../../components/error';
import Dispositivos from '../../components/dispositivos';

const Operacoes = () => {
  return (
    <>
      {AdmOnly() && <Dispositivos />}
      {!AdmOnly() && <Error title="Operações" text="Sem acesso a esta funcionalidade" />}
    </>
  );
};

export default Operacoes;
