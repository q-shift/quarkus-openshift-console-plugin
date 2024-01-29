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
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import ApplicationVolumeHealthCard from './ApplicationVolumeHealthCard';
import ApplicationJobsHealthCard from './ApplicationJobsHealthCard';

const ApplicationHealthCard: React.FC<{ application: Application }> = ({ application }) => {

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
      <CardTitle>Health</CardTitle>
      <CardBody>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* First Row */}
          <div style={{ flex: 1 }}>
            <Card>
              <CardTitle>Probes</CardTitle>
              <CardBody>
                <TextContent>
                  <Text component="p">Startup Probe: <Status title={probes.startupProbe || 'N/A'} status={probes.startupProbe && application.status.availableReplicas === application.status.replicas ? "Succeeded" : "Failed"}/></Text>
                  <Text component="p">Readiness Probe: <Status title={probes.readinessProbe || 'N/A'} status={probes.readinessProbe && application.status.availableReplicas === application.status.replicas ? "Succeeded" : "Failed"}/></Text>
                  <Text component="p">Liveness Probe: <Status title={probes.livenessProbe || 'N/A'} status={probes.livenessProbe && application.status.availableReplicas === application.status.replicas ? "Succeeded" : "Failed"}/></Text>
                </TextContent>
              </CardBody>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <ApplicationVolumeHealthCard application={application} />
          </div>
        </div>

        {/* Second Row */}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <Card>
              <CardTitle>Init Containers (mock)</CardTitle>
              <CardBody>
                <TextContent>
                  <Text component="h3">wait-for-flyway</Text>
                  <Text component="p">Image: groundnuty/k8s-wait-for:no-root-v1.7</Text>
                  <Text component="p"><Status title="pending" status="Pending"/></Text>
                </TextContent>
              </CardBody>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <ApplicationJobsHealthCard application={application} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ApplicationHealthCard;
