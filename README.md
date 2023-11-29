# Quarkus OpenShift Console Plugin

This project provides a [console plugin](https://github.com/openshift/console/tree/master/frontend/packages/console-dynamic-plugin-sdk) for [Quarkus](https://quarkus.io/).
The project is created using [openshift console plugin template](https://github.com/openshift/console-plugin-template)

# Local Development

For development you can login to an existing [OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift) and run the console with the plugin included locally.
**Note**: Works well with [OpenShift Sandbox](https://developers.redhat.com/developer-sandbox).

In one terminal window, run:

```sh
cd plugin
yarn install
yarn run start
```

In another terminal window, run:

After running `oc login` (requires [oc](https://console.redhat.com/openshift/downloads) and an [OpenShift cluster](https://console.redhat.com/openshift/create))

```sh
cd plugin
yarn run start-console
```
(requires [Docker](https://www.docker.com) or [podman 3.2.0+](https://podman.io))


This will run the OpenShift console in a container connected to the cluster
you've logged into. The plugin HTTP server runs on port 9001 with CORS enabled.
Navigate to <http://localhost:9000/example> to see the running plugin.

# Deployment to OpenShift

To deploy the console plugin to an actual [OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift) cluster the following are needed:

- [oc](https://console.redhat.com/openshift/downloads)
- [helm](https://helm.sh)

### Building the images locally

```sh
docker build -t docker.io/iocanel/quarkus-openshift-console-plugin:latest .
docker push docker.io/iocanel/quarkus-openshift-console-plugin:latest
```

**Note**: The image `docker.io/iocanel/quarkus-openshift-console-plguin:latest` is published so it can be pulled instead.

### Deploying the plugin using Helm

```sh
oc new-project plugin-quarkus-openshift-console-plugin
helm upgrade -i  quarkus-openshift-console-plugin charts/openshift-console-plugin --namespace plugin-quarkus-openshift-console-plugin --set plugin.image=docker.io/iocanel/quarkus-openshift-console-plugin:latest
```

### Deploying the plugin using the Quarkus CLI

This project provides a shell script that logs in to the cluster and installs the plugin in a single step.
This script can be installed to the Quarkus CLI as a plugin:

```sh
quakrus plug add bin/quarkus-install-openshift-console-plugin
```

Then it can be used:

```sh
quarkus install-openshift-console-plugin --token=<token> --server=<server url>
```

# The Quarkus Tab

In the developer perpective the Quarkus section is now shown:
[![The Quarkus Plugin Home](screenshots/home.png)](screenshots/home.png)


# Development notes

The frontend is able to retrieve information from the console using the following APIs:

## Kubernetes API /api/kubernetes
**Examples**:
  - /api/kubernetes/apis/apps/v1/namespaces/<namespace>/deployments
  - /api/kubernetes/apis/apps.openshift.io/v1/namespaces/<namespace>/deploymentconfigs

## Prometheus API /api/prometheus

**Examples**:
- /api/prometheus/api/v1/query_range
