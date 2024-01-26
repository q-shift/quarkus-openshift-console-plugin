import * as React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { Application } from '../types';
import { Chart, ChartAxis, ChartGroup, ChartLine, ChartVoronoiContainer } from '@patternfly/react-charts';
import { useEffect, useState } from 'react';
import { graphTheme } from '../theme';

const ApplicationCPUGraph: React.FC<{applications: Application[] }> = ({ applications }) => {
  const [data, setData] = useState([[]]);
  const [legendData, setLegendData] = useState([]);

  useEffect(() => {
    const newData = new Array(applications.length);
    const newLegendData = new Array(applications.length);
    applications.filter(app => app && app.metrics.cpu).forEach((app, index) => {
      newData[index] = app.metrics.cpu;
      newLegendData[index] = {name: app.metadata.name};
    });
    setData(newData);
    setLegendData(newLegendData);
    console.log(legendData);
  }, [applications]);

  return (
    <Card>
      <CardTitle>CPU</CardTitle>
      <CardBody>
        {data && legendData && legendData.length > 0 &&
        <Chart ariaTitle="CPU Usage"
          containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
          legendData={legendData}
          legendOrientation="vertical"
          legendPosition="right"
          domainPadding={{ y: 10 }}
          height={200}
          padding={{
            bottom: 50,
            left: 50,
            right: 200, // Adjusted to accommodate legend
            top: 50
          }}
          width={600}
          theme={graphTheme}>
          <ChartAxis dependentAxis tickCount={3}/>
          <ChartAxis showGrid tickValues={[20, 30, 60]}/>
          <ChartGroup>
            {data && data.map(d =>
              <ChartLine data={d}/>
            )}
          </ChartGroup>
        </Chart>
      }
      </CardBody>
    </Card>
  );
};

export default ApplicationCPUGraph;
