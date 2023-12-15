import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription
} from '@patternfly/react-core';

import { Application } from '../types';

interface ApplicationDetails {
  name: string;
  location: string;
  healthEndpoint: string;
  metricsEndpoint: string;
  infoEndpoint: string;
  produiEndpoint: string;
  framework: string;
  version: string;
  newPatchVersion: string;
  newMinorVersion: string;
  newMajorVersion: string;
  buildVersion: string;
}

function getHealthCheckEndpoint(application: Application): string | null {
  if (application && application.spec && application.spec.containers) {
    for (const container of application.spec.containers) {
      if (container.readinessProbe?.httpGet?.path) {
        return container.readinessProbe.httpGet.path;
      }
    }
  }
  return null;
}
const ApplicationDetailsCard: React.FC<{application: Application }> = ({ application }) => {
   const [details, setDetails] = useState<ApplicationDetails>();

   useEffect(() => {
     if (application) {
       setDetails({
         name: application.metadata.name,
         location: application.url,
         healthEndpoint: getHealthCheckEndpoint(application), 
         metricsEndpoint: "/q/metrics",
         infoEndpoint: "/q/info",
         produiEndpoint: "/q/dev",
         framework: "quarkus",
         version: "3.6.2", 
         newMajorVersion: "3",
         newMinorVersion: "6",
         newPatchVersion: "2",
         buildVersion: application.metadata.labels["app.kubernetes.io/version"]
       });
     }
   }, [application]);

  return (

    <Card>
      <CardTitle>Live View</CardTitle>
      {details &&
      <CardBody>
        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Application Name</DescriptionListTerm>
            <DescriptionListDescription>{details.name}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Location</DescriptionListTerm>
            <DescriptionListDescription>
            <a href={details.location} target="_blank" rel="noopener noreferrer">
              {details.location}
            </a>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Health Endpoint</DescriptionListTerm>
            <DescriptionListDescription>
            {details.healthEndpoint}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Metrics Endpoint</DescriptionListTerm>
            <DescriptionListDescription>{details.metricsEndpoint}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Info Endpoint</DescriptionListTerm>
            <DescriptionListDescription>{details.infoEndpoint}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Prod UI</DescriptionListTerm>
            <DescriptionListDescription>
            {details.location 
            ?
            <a href={details.location  + details.produiEndpoint} target="_blank" rel="noopener noreferrer">
              {details.location + details.produiEndpoint} 
            </a>
            : details.produiEndpoint}
          </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Framework</DescriptionListTerm>
            <DescriptionListDescription>{details.framework}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Version</DescriptionListTerm>
            <DescriptionListDescription>{details.version}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>New Major Version</DescriptionListTerm>
            <DescriptionListDescription>{details.newMajorVersion}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>New Minor Version</DescriptionListTerm>
            <DescriptionListDescription>{details.newMinorVersion}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>New Patch Version</DescriptionListTerm>
            <DescriptionListDescription>{details.newPatchVersion}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Build Version</DescriptionListTerm>
            <DescriptionListDescription>{details.buildVersion}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>}
    </Card>
  );
};

export default ApplicationDetailsCard;
