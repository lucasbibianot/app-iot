import styles from "../styles/Home.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Breadcrumb } from "antd";
import MyForm from '../components/form-device.jsx'

export default function Home() {
  const { user, isAuthenticated } = useAuth0();
  return ( isAuthenticated &&
    <>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dispositivos</Breadcrumb.Item>
      </Breadcrumb>
      <MyForm/>
    </>
  );
}
