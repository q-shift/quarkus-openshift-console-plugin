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

  const devUiUrl = (app) => `/api/proxy/plugin/quarkus-openshift-console-plugin/service-proxy/produi/${app.metadata.namespace}/${app.metadata.name}/`

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
        {apps && apps.filter(app => app.metadata && app.metadata.name && app.metadata.namespace).map(app => (
          <Tr key={app.metadata.name}>
            <Td dataLabel={columnNames.name}>
             <a href={devUiUrl(app)} target="_blank" rel="noopener noreferrer">
              {app.metadata.name}
            </a>
            </Td>
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
