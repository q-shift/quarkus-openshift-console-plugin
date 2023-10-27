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

export default function QuarkusPage() {
  const { t } = useTranslation('plugin__console-plugin-template');

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
            </Text>
          </TextContent>
        </PageSection>
      </Page>
    </>
  );
}
