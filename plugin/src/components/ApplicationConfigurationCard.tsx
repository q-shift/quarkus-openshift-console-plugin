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
import { extractEnvironmentVariables, extractMountedConfigMaps, extractMountedSecrets } from '../utils';

const ApplicationConfigurationCard: React.FC<{application: Application }> = ({ application }) => {

  const [envVars, setEnvVars] = useState({});
  const [secrets, setSecrets] = useState<string[]>([]);
  const [configMaps, setConfigMaps] = useState<string[]>([]);


  useEffect(() => {
    if (application && application.spec) {
    setEnvVars(extractEnvironmentVariables(application));
    setSecrets(extractMountedSecrets(application));
    setConfigMaps(extractMountedConfigMaps(application));
    }
  });

  return (
    <Card>
      <CardTitle>Configuration</CardTitle>
      <CardBody>
        {application &&
        <TextContent>
          <Text component="p">Name: {application.metadata.name}</Text>
          <Text component="p">Environment Variables:</Text>
          <ul>
            {Object.entries(envVars).map(
              ([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              )
            )}
          </ul>
          <Text component="p">Secrets:</Text>
          <ul>
            {secrets.map((secret) => (
              <li key={secret}>{secret}</li>
            ))}
          </ul>
          <Text component="p">Config Maps:</Text>
          <ul>
            {configMaps.map((configMap) => (
              <li key={configMap}>{configMap}</li>
            ))}
          </ul>
        </TextContent>
      }
      </CardBody>
    </Card>
  );

};

export default ApplicationConfigurationCard;

