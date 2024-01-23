import * as React from 'react';
import { useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { Application } from '../types';

const ApplicationMetricsCard: React.FC<{application: Application }> = ({ application }) => {

   useEffect(() => {
   }, [application]);

  return (

    <Card>
      <CardTitle>Metrics</CardTitle>
      <CardBody>
      </CardBody>
    </Card>
  );
};

export default ApplicationMetricsCard;
