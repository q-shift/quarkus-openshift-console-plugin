import { SetFeatureFlag } from '@openshift-console/dynamic-plugin-sdk';
import { FLAG_OPENSHIFT_QUARKUS } from './const';


export const enableQuarkusPlugin = (setFeatureFlag: SetFeatureFlag) => {
  setFeatureFlag(FLAG_OPENSHIFT_QUARKUS, true);
};
