import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { Application } from '../types';
import ApplicationsCPUGraph from './ApplicationsCPUGraph';
import ApplicationsMemoryGraph from './ApplicationsMemoryGraph';

const ApplicationMetricsCard: React.FC<{application: Application }> = ({ application }) => {

  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    const newApplications: Application[] = [application]; 
    setApplications(newApplications);
  }, [application]);

  return (
    <Card>
      <CardTitle>Metrics</CardTitle>
      {applications &&
      <CardBody style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          <ApplicationsCPUGraph applications={applications} />
        </div>
        <div style={{ flex: 1 }}>
          <ApplicationsMemoryGraph applications={applications} />
        </div>
      </CardBody>
    }
    </Card>
  );
};

export default ApplicationMetricsCard;
