import * as React from 'react';
import { useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { Application } from '../types';

const ApplicationAlertsCard: React.FC<{application: Application }> = ({ application }) => {

   useEffect(() => {
   }, [application]);

  return (

    <Card>
      <CardTitle>Alerts</CardTitle>
      <CardBody>
      </CardBody>
    </Card>
  );
};

export default ApplicationAlertsCard;
