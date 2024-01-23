import * as React from 'react';
import Helmet from 'react-helmet';
import {
  Page,
  PageSection,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
  Title,
} from '@patternfly/react-core';

import { match as RMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Application } from '../types';
import { fetchApplication } from '../services/QuarkusService';
import ApplicationDetailsCard from '../components/ApplicationDetailsCard';
import ApplicationAlertsCard from '../components/ApplicationAlertsCard';
import ApplicationMetricsCard from '../components/ApplicationMetricsCard';
import ApplicationLoggingCard from '../components/ApplicationLoggingCard';

import './quarkus.css';

export const ApplicationPage: React.FC<ApplicationPageProps> = ( {match} ) => {
  const { t } = useTranslation('plugin__console-plugin-template');
  const { ns, name } = match?.params || {};
  const [selectedNamespace] = useState<string>(ns || 'all-namespaces');
  const [selectedName] = useState<string>(name || '');
  const [application, setApplication] = useState<Application>();
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

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
          <Title headingLevel="h1">{t('Dashboard')}</Title>
        </PageSection>
        <PageSection variant="light">
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
              <TabContent id="1" title="Tab1">
                <PageSection variant="light">
                  <ApplicationDetailsCard application={application} />
                </PageSection>
              </TabContent>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Metrics</TabTitleText>}>
              <TabContent id="2" title="Metrics">
                <PageSection variant="light">
                  <ApplicationMetricsCard application={application} />
                </PageSection>
              </TabContent>
            </Tab>
            <Tab eventKey={2} title={<TabTitleText>Alerts</TabTitleText>}>
              <TabContent id="2" title="Alerts">
                <PageSection variant="light">
                  <ApplicationAlertsCard application={application} />
                </PageSection>
              </TabContent>
            </Tab>
            <Tab eventKey={3} title={<TabTitleText>Logging</TabTitleText>}>
              <TabContent id="3" title="Logging">
                <PageSection variant="light">
                  <ApplicationLoggingCard application={application} />
                </PageSection>
              </TabContent>
            </Tab>
          </Tabs>
        </PageSection>
      </Page>
      </>
  );
}

type ApplicationPageProps = {
  match: RMatch<{
    ns?: string;
    name?: string;
  }>;
};

export default ApplicationPage;
