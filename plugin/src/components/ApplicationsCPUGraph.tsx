import * as React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { Application } from '../types';
import { Chart, ChartAxis, ChartGroup, ChartLine } from '@patternfly/react-charts';
import { graphTheme } from '../theme';
import { useEffect, useState } from 'react';

const ApplicationCPUGraph: React.FC<{applications: Application[] }> = ({ applications }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const newData = new Array(applications.length);
    applications.filter(app => app && app.metrics.cpu).forEach((app, index) => {
      newData[index] = app.metrics.cpu;
    });
    setData(newData);
  }, [applications]);

  return (
    <Card>
      <CardTitle>CPU</CardTitle>
      <CardBody>
        <Chart ariaTitle="CPU Over Time"
          domainPadding={{ y: 1 }}
          scale={{ x: 'time', y: 'linear' }}
          height={100}
          theme={graphTheme}>
          <ChartAxis dependentAxis label="CPU Usage" />
          <ChartAxis label="Time" />
          <ChartGroup>
            {data && data.map(d =>
              <ChartLine data={d}/>
            )}
          </ChartGroup>
        </Chart>
      </CardBody>
    </Card>
  );
};

export default ApplicationCPUGraph;
