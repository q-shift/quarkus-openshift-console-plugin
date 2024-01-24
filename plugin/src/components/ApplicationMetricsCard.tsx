import * as React from 'react';
import { useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { Application } from '../types';
import ApplicationsCPUGraph from './ApplicationsCPUGraph';
import ApplicationsMemoryGraph from './ApplicationsMemoryGraph';

const ApplicationMetricsCard: React.FC<{application: Application }> = ({ application }) => {

  useEffect(() => {
  }, [application]);

  return (
    <Card>
      <CardTitle>Metrics</CardTitle>
      <CardBody style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          <ApplicationsCPUGraph applications={[application]} />
        </div>
        <div style={{ flex: 1 }}>
          <ApplicationsMemoryGraph applications={[application]} />
        </div>
      </CardBody>
    </Card>
  );
};

export default ApplicationMetricsCard;
