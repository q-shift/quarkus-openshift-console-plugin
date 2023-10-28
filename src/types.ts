import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { DeploymentCondition, DeploymentKind, DeploymentConfigKind  } from "k8s-types";

export type QuarkusApplication = {
  status?: {
    availableReplicas?: number;
    collisionCount?: number;
    conditions?: DeploymentCondition[];
    observedGeneration?: number;
    readyReplicas?: number;
    replicas?: number;
    unavailableReplicas?: number;
    updatedReplicas?: number;
  };
} & K8sResourceCommon;

export function deploymentToQuarkusApplication(deployment: DeploymentKind): QuarkusApplication {
  return {
    metadata: {
      ...deployment.metadata,
    },
    status: {
      ...deployment.status,
    },
  };
};

export function deploymentConfigToQuarkusApplication(deployment: DeploymentConfigKind): QuarkusApplication {
  return {
    metadata: {
      ...deployment.metadata,
    },
    status: {
      ...deployment.status,
    },
  };
};
