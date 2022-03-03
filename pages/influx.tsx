import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

export const InfluxChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('api/topics')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
  return <ResponsiveLine data={data} />;
};
