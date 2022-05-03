import React from 'react';
import Plotly from 'plotly.js-basic-dist-min';
import createPlotComponent from 'react-plotly.js/factory';

const Plot = createPlotComponent(Plotly);

const PlotTeste = () => (
  <Plot
    data={[
      {
        type: 'scatter',
        mode: 'lines+points',
        x: [1, 2, 3],
        y: [2, 6, 3],
        marker: { color: 'red' },
      },
      {
        type: 'bar',
        x: [1, 2, 3],
        y: [2, 5, 3],
      },
    ]}
    layout={{
      width: 320,
      height: 240,
      title: 'A Fancy Plot',
    }}
  />
);
PlotTeste.displayName = 'PlotTeste';
export default PlotTeste;
