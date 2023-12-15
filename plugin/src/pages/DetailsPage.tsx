import * as React from 'react';
import Helmet from 'react-helmet';
import {
  Page,
  PageSection,
  Title,
} from '@patternfly/react-core';

import { match as RMatch } from 'react-router-dom';
import './quarkus.css';
import { useEffect, useState } from 'react';
import { Application } from '../types';
import { fetchApplication } from '../services/QuarkusService';
import ApplicationDetailsCard from '../components/ApplicationDetailsCard';
import { useTranslation } from 'react-i18next';

export const DetailsPage: React.FC<DetailsPageProps> = ( {match} ) => {
  const { t } = useTranslation('plugin__console-plugin-template');
  const { ns, name } = match?.params || {};
  const [selectedNamespace] = useState<string>(ns || 'all-namespaces');
  const [selectedName] = useState<string>(name || '');
  const [application, setApplication] = useState<Application>();

  useEffect(() => {
    fetchApplication(selectedNamespace, selectedName).then((app: Application) => {
      setApplication(app);
    });
  }, [selectedNamespace, selectedName]);
  
  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{selectedNamespace} - {selectedName}</title>
      </Helmet>
      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{t('Details')}</Title>
        </PageSection>
        <PageSection variant="light">
        <ApplicationDetailsCard application={application} />
        </PageSection>
      </Page>
      </>
  );
}

type DetailsPageProps = {
  match: RMatch<{
    ns?: string;
    name?: string;
  }>;
};

export default DetailsPage;
