import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';
import { DeploymentConfigKind, DeploymentKind, RouteKind } from '../k8s-types';
import { Application, deploymentConfigToApplication, deploymentToApplication } from '../types';
import { sprintf } from 'sprintf-js';
import { quarkusApplicationStore } from '../state';

async function fetchDeployments(ns: string): Promise<Application[]>  {
  return consoleFetchJSON('/api/kubernetes/apis/apps/v1/namespaces/' + ns + '/deployments').then(res => {
    return res.items
      .filter((d: DeploymentKind) => (d.metadata.labels['app.openshift.io/runtime'] === 'quarkus'))
      .map((d: DeploymentKind) => deploymentToApplication(d));
  });
}

async function fetchDeployment(ns: string, name: string): Promise<Application>  {
  return consoleFetchJSON('/api/kubernetes/apis/apps/v1/namespaces/' + ns + '/deployments/' + name).then(res => {
       if (res.metadata.labels?.['app.openshift.io/runtime'] === 'quarkus') {
           return deploymentToApplication(res);
       }
       return null;
  }).catch(_ => {
    return null;
  });
}

async function fetchDeploymentConfigs(ns: string): Promise<Application[]> {
  return consoleFetchJSON('/api/kubernetes/apis/apps.openshift.io/v1/namespaces/' + ns + '/deploymentconfigs').then(res => {
    return res.items
      .filter((d: DeploymentConfigKind) => (d.metadata.labels['app.openshift.io/runtime'] === 'quarkus'))
      .map((d: DeploymentConfigKind) => deploymentConfigToApplication(d));
  }).catch(_ => {
      return null;
  });
}

async function fetchDeploymentConfig(ns: string, name: string): Promise<Application>  {
  return consoleFetchJSON('/api/kubernetes/apis/apps.openshift.io/v1/namespaces/' + ns + '/deploymentconfigs/'+ name).then(res => {
       if (res.metadata.labels?.['app.openshift.io/runtime'] === 'quarkus') {
           return deploymentConfigToApplication(res);
       }
       return null;
  });
}

async function populateAdddionalInfo(app: Application): Promise<Application>  {
  return populateCpu(app).then(populateCpuMetrics).then(populateMem).then(populateMemMetrics).then(populateRoute);
}

async function populateCpu (app: Application): Promise<Application> {
  return consoleFetchJSON('/api/prometheus/api/v1/query?query=avg_over_time(process_cpu_usage{service="' + app.metadata.name + '", namespace="' + app.metadata.namespace + '"}[1m]) * 100 / avg_over_time(system_cpu_usage[1m])').then((res) => {
    let newApp: Application = {...app};
    if (res && res.data && res.data && res.data.result && res.data.result.length > 0 && res.data.result[0].value && res.data.result[0].value.length > 1) {
      newApp.cpu=sprintf('%.2f', res.data.result[0].value[1]);
    }
    return newApp;
  });
}

async function populateCpuMetrics(app: Application): Promise<Application> {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const query = `/api/prometheus/api/v1/query_range?query=avg_over_time(process_cpu_usage{service="${app.metadata.name}", namespace="${app.metadata.namespace}"}[1m]) * 100 / avg_over_time(system_cpu_usage[1m])&start=${currentTimeInSeconds - 3600}&end=${currentTimeInSeconds}&step=60`;
  
  return consoleFetchJSON(query).then((res) => {
    let newApp: Application = {...app};

    if (res && res.data && res.data.result && res.data.result.length > 0) {
      const sortedValues = res.data.result[0].values.sort((a, b) => a[0] - b[0]); // Sort by timestamp
      newApp.metrics = newApp.metrics || {};
      newApp.metrics.cpu = sortedValues.map((value, index) => ({
        name: newApp.metadata.name,
        x: index + 1,  // Map the index to values from 1 to 60
        y: sprintf('%.2f', value[1])
      }));
    }
    console.log('Cpu Metrics:'+ JSON.stringify(newApp.metrics.cpu));
    return newApp;
  }).catch(error => {
    console.error('Error fetching CPU metrics:', error);
    return app; // Return the original app object in case of error
  });
}

async function populateMem (app: Application): Promise<Application>  {
  return consoleFetchJSON('/api/prometheus/api/v1/query?query=sum(jvm_memory_used_bytes{namespace="' + app.metadata.namespace + '", service="' +  app.metadata.name + '"} / (1024 * 1024))').then((res) => {
    let newApp: Application = {...app};
    if (res && res.data && res.data && res.data.result && res.data.result.length > 0 && res.data.result[0].value && res.data.result[0].value.length > 1) {
      newApp.memory=sprintf('%.2f MB', res.data.result[0].value[1]);
    }
    return newApp;
  });
}

async function populateMemMetrics(app: Application): Promise<Application> {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const query = `/api/prometheus/api/v1/query_range?query=sum(jvm_memory_used_bytes{namespace="${app.metadata.namespace}", service="${app.metadata.name}"} / (1024 * 1024))&start=${currentTimeInSeconds - 3600}&end=${currentTimeInSeconds}&step=60`;
  
  return consoleFetchJSON(query).then((res) => {
    let newApp: Application = {...app};

    if (res && res.data && res.data.result && res.data.result.length > 0) {
      const sortedValues = res.data.result[0].values.sort((a, b) => a[0] - b[0]); // Sort by timestamp

      newApp.metrics = newApp.metrics || {};
      newApp.metrics.memory = sortedValues.map((value, index) => ({
        name: newApp.metadata.name,
        x: index + 1,  // Map the index to values from 1 to 60
        y: sprintf('%.2f', value[1])
      }));
    }

    console.log('Memory metrics:' + JSON.stringify(newApp.metrics.memory));
    return newApp;
  }).catch(error => {
    console.error('Error fetching memory metrics:', error);
    return app; // Return the original app object in case of error
  });
}

export async function populateGCPauseMetrics(app: Application): Promise<Application> {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const query = `/api/prometheus/api/v1/query_range?query=avg_over_time(jvm_gc_pause_seconds_count{namespace="${app.metadata.namespace}", service="${app.metadata.name}"} / (1024 * 1024))&start=${currentTimeInSeconds - 3600}&end=${currentTimeInSeconds}&step=60`;
  
  return consoleFetchJSON(query).then((res) => {
    let newApp: Application = {...app};

    if (res && res.data && res.data.result && res.data.result.length > 0) {
      const sortedValues = res.data.result[0].values.sort((a, b) => a[0] - b[0]); // Sort by timestamp

      newApp.metrics = newApp.metrics || {};
      newApp.metrics.gcPause = sortedValues.map((value, index) => ({
        name: newApp.metadata.name,
        x: index + 1,  // Map the index to values from 1 to 60
        y: sprintf('%.2f', value[1])
      }));
    }

    console.log('GC Pause metrics:' + JSON.stringify(newApp.metrics.memory));
    return newApp;
  }).catch(error => {
    console.error('Error fetching memory metrics:', error);
    return app; // Return the original app object in case of error
  });
}

export async function populateGCOverheadMetrics(app: Application): Promise<Application> {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const query = `/api/prometheus/api/v1/query_range?query=avg_over_time(jvm_gc_overhead_percent{service="${app.metadata.name}", namespace="${app.metadata.namespace}"}[1m]) * 100 / avg_over_time(system_cpu_usage[1m])&start=${currentTimeInSeconds - 3600}&end=${currentTimeInSeconds}&step=60`;
  return consoleFetchJSON(query).then((res) => {
    let newApp: Application = {...app};

    if (res && res.data && res.data.result && res.data.result.length > 0) {
      const sortedValues = res.data.result[0].values.sort((a, b) => a[0] - b[0]); // Sort by timestamp

      newApp.metrics = newApp.metrics || {};
      newApp.metrics.gcOverhead = sortedValues.map((value, index) => ({
        name: newApp.metadata.name,
        x: index + 1,  // Map the index to values from 1 to 60
        y: sprintf('%.2f', value[1])
      }));
    }

    console.log('GC Overhead metrics:' + JSON.stringify(newApp.metrics.memory));
    return newApp;
  }).catch(error => {
    console.error('Error fetching memory metrics:', error);
    return app; // Return the original app object in case of error
  });
}

export async function populateRoute(app: Application): Promise<Application>  {
  return consoleFetchJSON('/api/kubernetes/apis/route.openshift.io/v1/namespaces/' + app.metadata.namespace + '/routes/'+ app.metadata.name).then((route: RouteKind) => {
    let newApp: Application = {...app};
    const protocol = route.spec.tls ? 'https' : 'http';
    newApp.url=  protocol + "://" + route.spec.host;
    return newApp;
  }).catch(_ => {
    return app;
  });
}

export async function fetchApplications(ns: string): Promise<Application[]> {
  return Promise.all([fetchDeployments(ns), fetchDeploymentConfigs(ns)]).then(([deployments, deploymentConfigs]) => {
    return deployments.concat(deploymentConfigs);
  });
}


export async function fetchApplicationsWithMetrics(ns: string): Promise<Application[]> {
  // Fetch applications
  return fetchApplications(ns).then((applications) => {
      const populatePromises = applications.map((app) => populateAdddionalInfo(app));
      return Promise.all(populatePromises);
    }).then((applications) => {
     quarkusApplicationStore.setState({applications});
      return applications;
    }).catch((error) => {
      console.error('Error fetching and populating metrics:', error);
      throw error;
    });
}

export async function fetchApplication(ns: string, name: string): Promise<Application> {
  return Promise.all([fetchDeployment(ns, name), fetchDeploymentConfig(ns, name)]).then(([deployment, deploymentConfig]) => {
    return deployment || deploymentConfig;
  }).then(populateRoute);
}

export async function fetchApplicationWithMetrics(ns: string, name: string): Promise<Application> {
  return Promise.all([fetchDeployment(ns, name), fetchDeploymentConfig(ns, name)]).then(([deployment, deploymentConfig]) => {
    return deployment || deploymentConfig;
  }).then(populateRoute).then(populateCpuMetrics).then(populateMemMetrics);
}

const QuarkusService = {
  fetchApplications,
  fetchApplicationsWithMetrics,
  populateCpuMetrics,
  populateMemMetrics,
  populateGCOverheadMetrics,
  populateGCPauseMetrics,
  populateRoute,
}
export default QuarkusService;
