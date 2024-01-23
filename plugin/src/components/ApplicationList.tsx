import * as React from "react";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Thead, Tr, Th, Td, Tbody } from '@patternfly/react-table';
import { Application } from "../types";
import Status from "@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status";
interface ApplicationListProps {
  apps: Application[];
}

export const ApplicationList: React.FC<ApplicationListProps> = ({ apps }) => {
  const columnNames = {
    name: 'Name',
    namespace: 'Namespace',
    status: 'Status',
    created: 'Created',
    cpu: 'CPU',
    memory: 'Memory',
  };

  //const devUiUrl = (app) => `/api/proxy/plugin/quarkus-openshift-console-plugin/service-proxy/produi/${app.metadata.namespace}/${app.metadata.name}/`
  const detailsUrl = (app) => `/quarkus/details/${app.metadata.namespace}/${app.metadata.name}`

  useEffect(() => {
   //refresh 
  },[])
  
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>{columnNames.name}</Th>
          <Th>{columnNames.namespace}</Th>
          <Th>{columnNames.status}</Th>
          <Th>{columnNames.cpu}</Th>
          <Th>{columnNames.memory}</Th>
          <Th>{columnNames.created}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {apps && apps.filter(app => app.metadata && app.metadata.name && app.metadata.namespace).map(app => (
          <Tr key={app.metadata.name}>
            <Td dataLabel={columnNames.name}>
            <Link to={detailsUrl(app)}>
              {app.metadata.name}
            </Link>
            </Td>
            <Td dataLabel={columnNames.namespace}>{app.metadata.namespace}</Td>
            <Td dataLabel={columnNames.status}><Status title={`${app.status.availableReplicas} of ${app.status.replicas} pods`} status={app.status.availableReplicas === app.status.replicas ? "Succeeded" : "Failed"}/></Td>
            <Td dataLabel={columnNames.cpu}>{app.cpu}</Td>
            <Td dataLabel={columnNames.memory}>{app.memory}</Td>
            <Td dataLabel={columnNames.created}>{calculateTimeDifference(app.metadata.creationTimestamp)} ago</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

function calculateTimeDifference(timestamp: string): string {
  const currentTime = new Date();
  const targetTime = new Date(timestamp);

  // Calculate the time difference in milliseconds
  const timeDifference = currentTime.getTime() - targetTime.getTime();

  // Convert milliseconds to seconds, minutes, hours, and days
  const seconds = Math.floor(timeDifference / 1000) % 60;
  const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
  const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Create a human-readable string
  const durationString = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

  return durationString;
}

export default ApplicationList;
