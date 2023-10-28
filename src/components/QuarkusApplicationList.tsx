import * as React from "react";
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
  };
  
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>{columnNames.name}</Th>
          <Th>{columnNames.namespace}</Th>
          <Th>{columnNames.created}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {apps.map(app => (
          <Tr key={app.metadata.name}>
            <Td dataLabel={columnNames.name}>{app.metadata.name}</Td>
            <Td dataLabel={columnNames.namespace}>{app.metadata.namespace}</Td>
            <Td dataLabel={columnNames.created}>{app.metadata.creationTimestamp}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
 
export default QuarkusApplicationList;
