import * as React from "react";
import { useEffect, useState } from 'react';
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

  const [sortColumn, setSortColumn] = useState("name"); // Default sorting column
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction (ascending)

  const toggleSort = (columnName) => {
    if (sortColumn === columnName) {
      // If the same column is clicked again, reverse the sorting direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If a different column is clicked, update the sort column and set the direction to ascending
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
   //refresh 
  },[])
  
 // Sort the apps based on the current sort column and direction
  const sortedApps = [...apps].sort((a, b) => {
    if (sortColumn === "name") {
      return sortDirection === "asc"
        ? a.metadata.name.localeCompare(b.metadata.name)
        : b.metadata.name.localeCompare(a.metadata.name);
    } else if (sortColumn === "namespace") {
      return sortDirection === "asc"
        ? a.metadata.namespace.localeCompare(b.metadata.namespace)
        : b.metadata.namespace.localeCompare(a.metadata.namespace);
    } else if (sortColumn === "status") {
      const missingReplicasA = a.status.replicas - a.status.readyReplicas;
      const missingReplicasB = b.status.replicas - b.status.readyReplicas;
      return sortDirection === "asc" ? missingReplicasA - missingReplicasB : missingReplicasB - missingReplicasA;
    } else if (sortColumn === "cpu") {
      const cpuA = parseFloat(a.cpu);
      const cpuB = parseFloat(b.cpu);
      return sortDirection === "asc" ? cpuA - cpuB : cpuB - cpuA;
    } else if (sortColumn === "memory") {
     const memoryA = parseFloat(a.memory);
      const memoryB = parseFloat(b.memory);
      return sortDirection === "asc" ? memoryA - memoryB : memoryB - memoryA;
    } else if (sortColumn === "created") {
      const timestampA = new Date(a.metadata.creationTimestamp).getTime();
      const timestampB = new Date(b.metadata.creationTimestamp).getTime();
      return sortDirection === "asc" ? timestampA - timestampB : timestampB - timestampA;
    }
    return 0;
  });
  
  return (
    <Table>
      <Thead>
        <Tr>
          <Th
            onClick={() => toggleSort("name")}
            className={sortColumn === "name" ? `sorted ${sortDirection}` : ""}
          >
            {columnNames.name}

            <span className="pf-c-table__sort-indicator"/>
            {sortColumn === "name" && (
              <span className="sort-icon">{sortDirection === "asc" ? "▲" : "▼"}</span>
            )}
          </Th>
          <Th
            onClick={() => toggleSort("namespace")}
            className={sortColumn === "namespace" ? `sorted ${sortDirection}` : ""}
          >
            {columnNames.namespace}
            {sortColumn === "namespace" && (
              <span className="sort-icon">{sortDirection === "asc" ? "▲" : "▼"}</span>
            )}
          </Th>
          <Th
            onClick={() => toggleSort("status")}
            className={sortColumn === "status" ? `sorted ${sortDirection}` : ""}
          >
            {columnNames.status}
            {sortColumn === "status" && (
              <span className="sort-icon">{sortDirection === "asc" ? "▲" : "▼"}</span>
            )}
          </Th>
          <Th
            onClick={() => toggleSort("cpu")}
            className={sortColumn === "cpu" ? `sorted ${sortDirection}` : ""}
          >
            {columnNames.cpu}
            {sortColumn === "cpu" && (
              <span className="sort-icon">{sortDirection === "asc" ? "▲" : "▼"}</span>
            )}
          </Th>
          <Th
            onClick={() => toggleSort("memory")}
            className={sortColumn === "memory" ? `sorted ${sortDirection}` : ""}
          >
            {columnNames.memory}
            {sortColumn === "memory" && (
              <span className="sort-icon">{sortDirection === "asc" ? "▲" : "▼"}</span>
            )}
          </Th>
          <Th
            onClick={() => toggleSort("created")}
            className={sortColumn === "created" ? `sorted ${sortDirection}` : ""}
          >
            {columnNames.created}
            {sortColumn === "created" && (
              <span className="sort-icon">{sortDirection === "asc" ? "▲" : "▼"}</span>
            )}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedApps && sortedApps.filter(app => app.metadata && app.metadata.name && app.metadata.namespace).map(app => (
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
