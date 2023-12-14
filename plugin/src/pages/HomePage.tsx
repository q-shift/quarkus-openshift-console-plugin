import * as React from 'react';
import { match as RMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import {
  Page,
  PageSection,
  Title,
} from '@patternfly/react-core';
import './quarkus.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';
import { sprintf } from 'sprintf-js';
import { deploymentToApplication, deploymentConfigToApplication, Application } from '../types';
import { NamespaceBar } from '@openshift-console/dynamic-plugin-sdk';
import { DeploymentKind, DeploymentConfigKind } from '../k8s-types';
import ApplicationList from '../components/ApplicationList';

export const QuarkusPage: React.FC<QuarkusHomePageProps> = ({ match }) => {
  const { t } = useTranslation('plugin__console-plugin-template');
  const { ns } = match?.params || {};

  const [activeNamespace, setActiveNamespace] = useState(ns || 'all-namespaces');
  const [Applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    setApplications([]);
    fetchDeployments().then((apps: Application[]) => {
       let newApps: Application[] = [...Applications];
       apps.forEach(app => { 
         populateMetrics(app).then((app: Application) => { 
           addApplication(app, newApps);
           newApps.push(app);
         });
       });
    });

    fetchDeploymentConfigs().then((apps: Application[]) => {
       let newApps: Application[] = [...Applications];
       apps.forEach(app => { 
         populateMetrics(app).then((app: Application) => { 
           addApplication(app, newApps);
           newApps.push(app);
         });
       });
    });

  }, [activeNamespace]);
  
  useEffect(() => {
   Applications.map(app => app.metadata.name + "{cpu:" +  app.cpu + ", memory:" + app.memory + "}").forEach(console.log);
  }, [Applications]);

  const addApplication = (newApp: Application, existingApps: Application[]) => {
   console.log('adding: ' + newApp.metadata.name + ' to [' + existingApps.map(app => app.metadata.name + "{cpu:" +  app.cpu + ", memory:" + app.memory + "}").join(',') + ']');
    const updatedApplications = [...existingApps, newApp];
    setApplications(updatedApplications);
  };

  const fetchDeployments = (): Promise<Application[]> => {
    return consoleFetchJSON('/api/kubernetes/apis/apps/v1/namespaces/' + activeNamespace + '/deployments').then(res => {
      return res.items
        .filter((d: DeploymentKind) => (d.metadata.labels['app.openshift.io/runtime'] === 'quarkus'))
        .map((d: DeploymentKind) => deploymentToApplication(d));
    });
  }

  const fetchDeploymentConfigs = (): Promise<Application[]> => {
    return consoleFetchJSON('/api/kubernetes/apis/apps.openshift.io/v1/namespaces/' + activeNamespace + '/deploymentconfigs').then(res => {
      return res.items
        .filter((d: DeploymentConfigKind) => (d.metadata.labels['app.openshift.io/runtime'] === 'quarkus'))
        .map((d: DeploymentConfigKind) => deploymentConfigToApplication(d));
    });
  }

  const populateMetrics = (app: Application): Promise<Application>  => {
    return populateCpu(app).then(populateMem);
  }

  const populateCpu = (app: Application): Promise<Application>  => {
    return consoleFetchJSON('/api/prometheus/api/v1/query?query=avg_over_time(process_cpu_usage{service="' + app.metadata.name + '", namespace="' + app.metadata.namespace + '"}[1m]) * 100 / avg_over_time(system_cpu_usage[1m])').then((res) => {
      let newApp: Application = {...app};
      if (res && res.data && res.data && res.data.result && res.data.result.length > 0 && res.data.result[0].value && res.data.result[0].value.length > 1) {
       newApp.cpu=sprintf('%.2f', res.data.result[0].value[1]);
      }
      return newApp;
    });
  }

  const populateMem = (app: Application): Promise<Application>  => {
    return consoleFetchJSON('/api/prometheus/api/v1/query?query=sum(jvm_memory_used_bytes{namespace="' + app.metadata.namespace + '", service="' +  app.metadata.name + '"} / (1024 * 1024))').then((res) => {
      let newApp: Application = {...app};
      if (res && res.data && res.data && res.data.result && res.data.result.length > 0 && res.data.result[0].value && res.data.result[0].value.length > 1) {
       newApp.memory=sprintf('%.2f MB', res.data.result[0].value[1]);
      }
      return newApp;
    });
  }

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
        <ApplicationList apps={Applications} />
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
