import * as React from 'react';
import { useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle
} from '@patternfly/react-core';
import { Application } from '../types';

const ApplicationLoggingCard: React.FC<{application: Application }> = ({ application }) => {

   useEffect(() => {
   }, [application]);

  return (

    <Card>
      <CardTitle>Logging</CardTitle>
      <CardBody>
      </CardBody>
    </Card>
  );
};

export default ApplicationLoggingCard;
