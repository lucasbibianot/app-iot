import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

const InfluxChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const getInitialProps = async ({ req }) => {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    return { userAgent };
  };

  useEffect(() => {
    setLoading(true);
    fetch("api/topics")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);
  return <ResponsiveLine data={data} />;
};

export default InfluxChart;
