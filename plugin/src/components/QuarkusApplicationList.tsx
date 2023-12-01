import * as React from "react";
import { useEffect } from 'react';
import { Table, Thead, Tr, Th, Td, Tbody } from '@patternfly/react-table';
import { QuarkusApplication } from "../types";

interface QuarkusApplicationListProps {
  apps: QuarkusApplication[];
}

export const QuarkusApplicationList: React.FC<QuarkusApplicationListProps> = ({ apps }) => {
  const columnNames = {
    name: 'Name',
    namespace: 'Namespace',
    created: 'Created',
    cpu: 'CPU',
    memory: 'Memory',
  };

  useEffect(() => {
   //refresh 
  },[])
  
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>{columnNames.name}</Th>
          <Th>{columnNames.namespace}</Th>
          <Th>{columnNames.created}</Th>
          <Th>{columnNames.cpu}</Th>
          <Th>{columnNames.memory}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {apps.map(app => (
          <Tr key={app.metadata.name}>
            <Td dataLabel={columnNames.name}>
             <a href="/api/proxy/plugin/quarkus-openshift-console-plugin/serviceProxy/{app.metadata.namespace}/{app.metadata.name}" target="_blank" rel="noopener noreferrer">
              {app.metadata.name}
            </a>
            {app.metadata.name}</Td>
            <Td dataLabel={columnNames.namespace}>{app.metadata.namespace}</Td>
            <Td dataLabel={columnNames.created}>{app.metadata.creationTimestamp}</Td>
            <Td dataLabel={columnNames.cpu}>{app.cpu}</Td>
            <Td dataLabel={columnNames.memory}>{app.memory}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
 
export default QuarkusApplicationList;
