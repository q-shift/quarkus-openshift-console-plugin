import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  List,
  ListItem,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { Application } from '../types';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';

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

  const kubernetesJobInfo = {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: 'init-task-example-flyway-init',
    },
    spec: {
      completionMode: 'NonIndexed',
      template: {
        metadata: {},
        spec: {
          containers: [
            {
              env: [
                {
                  name: 'QUARKUS_FLYWAY_ENABLED',
                  value: 'true',
                },
                {
                  name: 'QUARKUS_INIT_AND_EXIT',
                  value: 'true',
                },
              ],
              image: 'init-task-example:1.0.0-SNAPSHOT',
              name: 'init-task-example-flyway-init',
            },
          ],
          restartPolicy: 'OnFailure',
          serviceAccountName: 'init-task-example',
        },
      },
    },
  };

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
            <Card>
              <CardTitle>Volumes (mock)</CardTitle>
              <CardBody>
                <Text component="h3" >app-config</Text>
                <TextContent>
                  <Text component="p">Type: ConfigMap</Text>
                </TextContent>
                <TextContent>
                  <Text component="p">Path: /mnt/app/app-config.yaml</Text>
                </TextContent>
                <TextContent>
                  <Text component="p"><Status title="available" status="Succeeded"/></Text>
                </TextContent>
              </CardBody>
            </Card>
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
            <Card>
              <CardTitle>Jobs (mock)</CardTitle>
              <CardBody>
                <TextContent>
                  <Text component="h3">init-task-example-flyway-init</Text>
                  <Text component="p"><Status title="Failed" status="Failed"/></Text>
                  <Text component="p">Completion Mode: {kubernetesJobInfo.spec.completionMode}</Text>
                  <Text component="p">Container Image: {kubernetesJobInfo.spec.template.spec.containers[0].image}</Text>
                  <Text component="p">Environment Variables:</Text>
                  <List>
                    {kubernetesJobInfo.spec.template.spec.containers[0].env.map((variable, index) => (
                      <ListItem key={index}>
                        <Text component="p">{variable.name}: {variable.value}</Text>
                      </ListItem>
                    ))}
                  </List>
                </TextContent>
              </CardBody>
            </Card>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ApplicationHealthCard;
