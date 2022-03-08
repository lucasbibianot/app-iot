import {
  Skeleton,
  Switch,
  Card,
  Avatar,
  Select,
  Input,
  Button,
  Form,
} from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";

const { Meta } = Card;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function MyForm() {
  const [form] = useForm();
  const [topicos, setTopicos] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [series, setSeries] = useState([]);
  const getInitialProps = async ({ req }) => {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    return { userAgent };
  };

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
  const [state, setState] = useState({
    loading: true,
  });
  const { loading } = state;

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: "Hello world!",
      gender: "male",
    });
  };

  const onChangeTopic = (topic) => {
    setState({ loading: true });
    fetch(`api/medidas/1d?topico=${topic}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMedidas(data);
        setState({ loading: false });
      });
  };
  const onChangeMedida = (medida) => {
    setState({ loading: true });
    fetch(
      `api/series/1d?topico=${form.getFieldValue("topic")}&medida=${medida}&ultimo=true`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSeries(data);
        console.log(series);
        setState({ loading: false });
      });
  };
  return (
    <>
      <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
        <Meta
          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
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
              onChange={onChangeMedida}
              allowClear
            >
              {medidas.map((item) => (
                <Option key={item.medida} va>
                  {item.medida}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="link" htmlType="button" onClick={onFill}>
              Fill form
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
