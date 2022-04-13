import { Card, Select, Button, Form, Table, Tag, Divider } from "antd";
import { FormOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";

const { Meta } = Card;
const { Option } = Select;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const MyForm = (props) => {
  const [form] = useForm();
  const [topicos, setTopicos] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [series, setSeries] = useState([]);
  const [onLine, setOnLine] = useState([]);
  const [onOff, setOnOff] = useState(0);
  const [comando, setComando] = useState(false);
  const [postMqtt, setPostMqtt] = useState({
    topico: "",
    msg: {
      device: "",
      value: 1,
      modo: "a",
    },
  });
  const getInitialProps = async ({ req }) => {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    return { userAgent };
  };

  const columns = [
    {
      title: "Operação",
      render: (text) =>
        onLine &&
        form.getFieldValue("medidas") === "estadoRele" && (
          <Button
            htmlType="button"
            alt={onOff ? "Ligar" : "Desligar"}
            onClick={() => {
              setComando(true);
              setOnOff(onOff == 0 ? 1 : 0);
            }}
            shape="circle"
            icon={
              onOff == 0 ? (
                <LoginOutlined alt="Ligar" />
              ) : (
                <LogoutOutlined alt="Desligar" />
              )
            }
          />
        ),
    },
    {
      title: "Tópico",
      dataIndex: "topico",
      key: "topico",
    },
    {
      title: "Medida",
      dataIndex: "medida",
      key: "medida",
    },
    {
      title: "Data/Hora",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Subscribed",
      dataIndex: "topic_subscribe",
      key: "topic_subscribe",
    },
    {
      title: "Online",
      dataIndex: "online",
      key: "online",
      render: (text) =>
        text ? <Tag color="green">online</Tag> : <Tag color="red">offline</Tag>,
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      render: (text) =>
        Math.round(text) == 1 &&
        form.getFieldValue("medidas") === "estadoRele" &&
        onOff == 1 ? (
          <Tag color="green">Ligado</Tag>
        ) : onOff == 0 && form.getFieldValue("medidas") === "estadoRele" ? (
          <Tag color="red">Desligado</Tag>
        ) : (
          text
        ),
    },
  ];

  useEffect(() => {
    setState({ loading: true });
    fetch("api/topics/1d")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTopicos(data);
        setState({ loading: false });
      });
  }, []);

  useEffect(() => {
    if (comando) {
      const newPost = {
        ...postMqtt,
        msg: {
          ...postMqtt.msg,
          value: onOff,
        },
      };
      console.log(newPost);
      mensagemMQtt(newPost);
    }
  }, [onOff, comando]);

  const [state, setState] = useState({
    loading: true,
  });
  const { loading } = state;

  const onFinish = (values) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
    setMedidas([]);
    setSeries([]);
  };

  const onChangeTopic = async (topic) => {
    setComando(false);
    setState({ loading: true });
    setMedidas([]);
    setSeries([]);
    await fetch(`api/medidas/1d?topico=${topic}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMedidas(data);
        setState({ loading: false });
      });
  };
  const onChangeMedida = async (medida) => {
    setState({ loading: true });
    await fetch(
      `api/series/1d?topico=${form.getFieldValue(
        "topic"
      )}&medida=${form.getFieldValue("medidas")}&ultimo=true`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data !== undefined && data.length > 0) {
          setSeries(data);
          setOnLine(data[0].online);
          if (!comando) {
            setOnOff(Math.round(data[0].valor));
          }
          setPostMqtt({
            topico: data[0].topic_subscribe,
            msg: {
              device: data[0].medida,
              value: Math.round(data[0].valor) == 1 ? 0 : 1,
              modo: "m",
            },
          });
        }
        setState({ loading: false });
      });
  };

  const atualizar = async () => {
    onChangeMedida(form.getFieldValue("medidas"));
  };

  const mensagemMQtt = async (postMqttP) => {
    setState({ loading: true });
    await fetch(`api/mqtt/publish`, {
      method: "POST",
      body: JSON.stringify(postMqttP),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res)
      .then((data) => {
        onChangeMedida(postMqttP.msg.device);
        let serie = [];
        serie.push({ ...series[0], valor: postMqttP.msg.value });
        setSeries(serie);
        setState({ loading: false });
      });
  };

  const alterarModo = async () => {
    setState({ loading: true });
    const mqtt = postMqtt;
    mqtt.msg.modo = "a";
    mensagemMQtt(mqtt);
  };

  return (
    <>
      <Card loading={loading}>
        <Meta
          avatar={<FormOutlined />}
          title="Operação"
          description="Execução de comandos remotos"
        />
        <Form form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="topic"
            label="Dispositivo"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Selecione o dispositivo"
              onChange={onChangeTopic}
              allowClear
            >
              {topicos.map((item) => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="medidas" label="Sensor" rules={[{ required: true }]}>
            <Select
              placeholder="Selecione o Sensor"
              onChange={() => onChangeMedida(postMqtt)}
              allowClear
            >
              {medidas.flatMap((item) =>
                item.medida !== "qtd_boot" ? (
                  <Option key={item.medida}>{item.medida}</Option>
                ) : (
                  <></>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="button" onClick={atualizar}>
              Atualizar
            </Button>
            <Divider type="vertical" />
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table columns={columns} dataSource={series} />
      </Card>
    </>
  );
};

export default MyForm;
