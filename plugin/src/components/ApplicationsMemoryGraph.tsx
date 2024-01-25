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

const ApplicationMemoryGraph: React.FC<{applications: Application[] }> = ({ applications }) => {
  const [data, setData] = useState([[]]);

  useEffect(() => {
    const newData = new Array(applications.length);
    applications.filter(app => app && app.metrics.memory).forEach((app, index) => {
      newData[index] = app.metrics.memory;
    });
    setData(newData);
  }, [applications]);

  return (
    <Card>
      <CardTitle>Memory</CardTitle>
      <CardBody>
        <Chart ariaTitle="Memory Over Time"
          domainPadding={{ y: 10 }}
          height={100}
          theme={graphTheme}>
          <ChartAxis dependentAxis label="Memory Usage" />
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

export default ApplicationMemoryGraph;
