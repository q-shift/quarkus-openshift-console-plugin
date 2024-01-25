import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { Application } from '../types';

const ApplicationAlertsCard: React.FC<{ application: Application }> = ({ application }) => {
  const [probes, setProbes] = useState<{
    readinessProbe: string | null;
    livenessProbe: string | null;
    startupProbe: string | null;
  }>({
    readinessProbe: null,
    livenessProbe: null,
    startupProbe: null,
  });

  useEffect(() => {
    if (application && application.spec && application.spec.containers && application.spec.containers.length > 0) {
      const container = application.spec.containers[0]; // Assuming the first container
      setProbes({
        readinessProbe: container.readinessProbe ? container.readinessProbe.httpGet?.path || null : null,
        livenessProbe: container.livenessProbe ? container.livenessProbe.httpGet?.path || null : null,
        startupProbe: container.startupProbe ? container.startupProbe.httpGet?.path || null : null,
      });
    }
  }, [application]);

  return (
    <Card>
      <CardTitle>Alerts</CardTitle>
      <CardBody>
        <TextContent>
          <Text component="p">Readiness Probe: {probes.readinessProbe || 'N/A'}</Text>
          <Text component="p">Liveness Probe: {probes.livenessProbe || 'N/A'}</Text>
          <Text component="p">Startup Probe: {probes.startupProbe || 'N/A'}</Text>
        </TextContent>
      </CardBody>
    </Card>
  );
};

export default ApplicationAlertsCard;
