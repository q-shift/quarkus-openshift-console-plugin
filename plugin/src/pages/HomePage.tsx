import * as React from 'react';
import { match as RMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import {
    Card,
    CardBody,
  Page,
  PageSection,
  Title,
} from '@patternfly/react-core';
import './quarkus.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { NamespaceBar } from '@openshift-console/dynamic-plugin-sdk';
import ApplicationList from '../components/ApplicationList';
import { Application } from '../types';
import { fetchApplicationsWithMetrics } from '../services/QuarkusService';
//import { useParams } from 'react-router-dom-v5-compat';

export const QuarkusPage: React.FC<QuarkusHomePageProps> = ({ match }) => {
  const { t } = useTranslation('plugin__console-plugin-template');
  const { ns } = match?.params || {};

  const [activeNamespace, setActiveNamespace] = useState(ns || 'all-namespaces');
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetchApplicationsWithMetrics(activeNamespace).then((apps: Application[]) => {
      console.log('Setting applications' + apps);
      setApplications(apps);
    })
  }, [activeNamespace]);
  
  useEffect(() => {
   applications.map(app => app.metadata.name + "{cpu:" +  app.cpu + ", memory:" + app.memory + "}").forEach(console.log);
  }, [applications]);

  return (
    <>
      <NamespaceBar onNamespaceChange={namespace => setActiveNamespace(namespace)} />
      <Helmet>
        <title data-test="example-page-title">{t('Quarkus')}</title>
      </Helmet>

      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{t('Quarkus Applications')}</Title>
        </PageSection>
        <PageSection variant="light">
          <Card>
            <CardBody>
              <ApplicationList apps={applications} />
            </CardBody>
          </Card>
        </PageSection>
      </Page>
    </>
  );
}

type QuarkusHomePageProps = {
  match: RMatch<{
    ns?: string;
  }>;
};

export default QuarkusPage;
