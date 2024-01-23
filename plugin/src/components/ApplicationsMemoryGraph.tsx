import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { Application } from '../types';
import { Chart, ChartAxis, ChartGroup, ChartLine } from '@patternfly/react-charts';
import { graphTheme } from '../theme';

const ApplicationMemoryGraph: React.FC<{applications: Application[] }> = ({ applications }) => {

   const [cpuData, _ ] = useState<number[][]>([]); 

   useEffect(() => {
   }, [applications]);

  return (

    <Card>
      <CardTitle>Memory</CardTitle>
      <CardBody>
         <Chart ariaTitle="Memory Over Time"
                domainPadding={{ y: 1 }}
                height={50}
                scale={{ x: 'time', y: 'linear' }}
                theme={graphTheme}>
                <ChartAxis dependentAxis label="Memory Usage" />
                <ChartAxis label="Time" />
                <ChartGroup>
                  <ChartLine
                    data={applications.map((app) => ({ x: app.metadata.name, y: cpuData[applications.indexOf(app)] }))}
                  />
                </ChartGroup>
              </Chart>
      </CardBody>
    </Card>
  );
};

export default ApplicationMemoryGraph;
