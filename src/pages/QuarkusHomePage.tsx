import * as React from 'react';
import Helmet from 'react-helmet';
import {
  Page,
  PageSection,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import './quarkus.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';
import { deploymentToQuarkusApplication, deploymentConfigToQuarkusApplication, QuarkusApplication } from '../types';
import QuarkusApplicationList from '../components/QuarkusApplicationList';

export default function QuarkusPage() {
  const { t } = useTranslation('plugin__console-plugin-template');

  const [quarkusApplications, setQuarkusApplications] = useState<QuarkusApplication[]>([]);
  const addQuarkusApplications = (apps: QuarkusApplication[]) => {
    // Use the spread operator (...) to create a new array with the new item appended
    const newQuarksApplications = [...quarkusApplications, ...apps];

    // Update the state with the new array
    setQuarkusApplications(newQuarksApplications);
  };

  useEffect(() => {
    consoleFetchJSON('/api/kubernetes/apis/apps/v1/namespaces/ikanello1-dev/deployments').then((res) => {
        addQuarkusApplications(res.items
        .filter(d => (d.metadata.labels['app.openshift.io/runtime'] === 'quarkus'))
        .map(d => deploymentToQuarkusApplication(d)));
    });
    consoleFetchJSON('/api/kubernetes/apis/apps.openshift.io/v1/namespaces/ikanello1-dev/deploymentconfigs').then((res) => {
        addQuarkusApplications(res.items.filter(d => (d.metadata.labels['app.openshift.io/runtime'] === 'quarkus'))
        .map(d => deploymentConfigToQuarkusApplication(d)));
    });
  }, []);

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{t('Hello, Plugin!')}</title>
      </Helmet>
      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{t('Hello, Quarkus!')}</Title>
        </PageSection>
        <PageSection variant="light">
          <TextContent>
            <Text component="p">
              <span className="console-plugin-template__nice">
                {t('Nice!')}
              </span>{' '}
              {t('The Quarkus plugin is working.')}
            </Text>
            <Text component="p">
              {t(
                'This is the home page of the Quarkus OpenShift Console plugin.'
              )}
              <code>{t('exposedModules')}</code>{' '}
              {t('in package.json mapping the reference to the module.')}
              <QuarkusApplicationList apps={quarkusApplications} />
            </Text>
          </TextContent>
        </PageSection>
      </Page>
    </>
  );
}
