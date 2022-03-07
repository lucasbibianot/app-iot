import { Skeleton, Switch, Card, Avatar } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Meta } = Card;

export default function MyForm() {
  const [state, setState] = useState({
    loading: true,
  });
  const { loading } = state;

  const onChange = (checked) => {
    setState({ loading: !checked });
  };

  return (
    <>
      <Switch checked={!loading} onChange={onChange} />

      <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
        <Meta
          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
          title="Card title"
          description="This is the description"
        />
      </Card>

      <Card
        style={{ width: 300, marginTop: 16 }}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Skeleton loading={loading} avatar active>
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title="Card title"
            description="This is the description"
          />
        </Skeleton>
      </Card>
    </>
  );
}
