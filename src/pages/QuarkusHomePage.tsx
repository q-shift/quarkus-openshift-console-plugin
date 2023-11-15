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
import { deploymentToQuarkusApplication, deploymentConfigToQuarkusApplication, QuarkusApplication } from '../types';
import { NamespaceBar } from '@openshift-console/dynamic-plugin-sdk';
import { DeploymentKind, DeploymentConfigKind } from '../k8s-types';
import QuarkusApplicationList from '../components/QuarkusApplicationList';

export const QuarkusPage: React.FC<QuarkusHomePageProps> = ({ match }) => {
  const { t } = useTranslation('plugin__console-plugin-template');
  const { ns } = match?.params;

  const [activeNamespace, setActiveNamespace] = useState(ns || 'all-namespaces');
  const [quarkusApplications, setQuarkusApplications] = useState<QuarkusApplication[]>([]);

  useEffect(() => {
    console.log('activeNamespace: ' + activeNamespace);
    setQuarkusApplications([]);
    fetchDeployments().then((apps: QuarkusApplication[]) => {
       let newApps: QuarkusApplication[] = [...quarkusApplications];
       apps.forEach(app => { 
         populateMetrics(app).then((app: QuarkusApplication) => { 
           addQuarkusApplication(app, newApps);
           newApps.push(app);
         });
       });
    });

    fetchDeploymentConfigs().then((apps: QuarkusApplication[]) => {
       let newApps: QuarkusApplication[] = [...quarkusApplications];
       apps.forEach(app => { 
         populateMetrics(app).then((app: QuarkusApplication) => { 
           addQuarkusApplication(app, newApps);
           newApps.push(app);
         });
       });
    });

  }, [activeNamespace]);
  
  useEffect(() => {
   quarkusApplications.map(app => app.metadata.name + "{cpu:" +  app.cpu + ", memory:" + app.memory + "}").forEach(console.log);
  }, [quarkusApplications]);

  const addQuarkusApplication = (newApp: QuarkusApplication, existingApps: QuarkusApplication[]) => {
   console.log('adding: ' + newApp.metadata.name + ' to [' + existingApps.map(app => app.metadata.name + "{cpu:" +  app.cpu + ", memory:" + app.memory + "}").join(',') + ']');
    const updatedQuarkusApplications = [...existingApps, newApp];
    setQuarkusApplications(updatedQuarkusApplications);
  };

  const fetchDeployments = (): Promise<QuarkusApplication[]> => {
    return consoleFetchJSON('/api/kubernetes/apis/apps/v1/namespaces/' + activeNamespace + '/deployments').then(res => {
      return res.items
        .filter((d: DeploymentKind) => (d.metadata.labels['app.openshift.io/runtime'] === 'quarkus'))
        .map((d: DeploymentKind) => deploymentToQuarkusApplication(d));
    });
  }

  const fetchDeploymentConfigs = (): Promise<QuarkusApplication[]> => {
    return consoleFetchJSON('/api/kubernetes/apis/apps.openshift.io/v1/namespaces/' + activeNamespace + '/deploymentconfigs').then(res => {
      return res.items
        .filter((d: DeploymentConfigKind) => (d.metadata.labels['app.openshift.io/runtime'] === 'quarkus'))
        .map((d: DeploymentConfigKind) => deploymentConfigToQuarkusApplication(d));
    });
  }

  const populateMetrics = (app: QuarkusApplication): Promise<QuarkusApplication>  => {
    return populateCpu(app).then(populateMem);
  }

  const populateCpu = (app: QuarkusApplication): Promise<QuarkusApplication>  => {
    return consoleFetchJSON('/api/prometheus/api/v1/query?query=avg_over_time(process_cpu_usage{service="' + app.metadata.name + '", namespace="' + app.metadata.namespace + '"}[1m]) * 100 * system_cpu_count').then((res) => {
      let newApp: QuarkusApplication = {...app};
      if (res && res.data && res.data && res.data.result && res.data.result.length > 0 && res.data.result[0].value && res.data.result[0].value.length > 1) {
       newApp.cpu=String(res.data.result[0].value[1]);
      }
      return newApp;
    });
  }

  const populateMem = (app: QuarkusApplication): Promise<QuarkusApplication>  => {
    return consoleFetchJSON('/api/prometheus/api/v1/query?query=sum(jvm_memory_used_bytes{namespace="' + app.metadata.namespace + '", service="' +  app.metadata.name + '"})').then((res) => {
      let newApp: QuarkusApplication = {...app};
      if (res && res.data && res.data && res.data.result && res.data.result.length > 0 && res.data.result[0].value && res.data.result[0].value.length > 1) {
       newApp.memory=String(res.data.result[0].value[1]);
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
        <QuarkusApplicationList apps={quarkusApplications} />
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
