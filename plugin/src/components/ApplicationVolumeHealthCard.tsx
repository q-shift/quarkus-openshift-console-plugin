import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  List,
  ListItem,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { Application } from '../types';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';
import { fetchConfigMap, fetchPvc, fetchSecret } from '../services/QuarkusService';
import { ConfigMapKind, PersistentVolumeClaimKind, SecretKind } from 'k8s-types';

const ApplicationHealthCard: React.FC<{ application: Application }> = ({ application }) => {

  const [volumes, setVolumes] = useState(application && application.spec ? application.spec.volumes : []);
  const [volumeStatus, setVolumeStatus] = useState(application && application.spec ? application.spec.volumes.map(v => "Pending") : []);

  useEffect(() => {
    setVolumes(application && application.spec ? application.spec.volumes : []);
  }, [application]);

  useEffect(() => {
    if (application && application.metadata) {
      volumes.forEach((volume, index) => {
        const kind = volumeKind(volume);
        console.log('Volume kind:' + volume);
        if (kind === 'ConfigMap') {
          fetchConfigMap(application.metadata.namespace, volume.name).then((configMap: ConfigMapKind) => {
            console.log('Updating volume status for configMap: ' + volume.name + ': ' + configMap);
            updateVolumeStatus(index, configMap ?  "Succeeded" : "Pending");
          });
        } else if (kind === 'Secret') {
          fetchSecret(application.metadata.namespace, volume.name).then((secret: SecretKind) => {
            updateVolumeStatus(index, secret ?  "Succeeded" : "Pending");
          });
        } else if (kind === 'PersistentVolumeClaim') {
          fetchPvc(application.metadata.namespace, volume.name).then((pvc: PersistentVolumeClaimKind) => {
            updateVolumeStatus(index, pvc ?  "Succeeded" : "Pending");
          });
        }
      });
    }
  }, [volumes]);

  const updateVolumeStatus = (index: number, status: string) => {
    console.log('Updating volume at index: ' + index + ' status: ' + status);
    const newStatus = [...volumeStatus];
    newStatus[index] = status;
    setVolumeStatus(newStatus);
  } 


  return (
    <Card>
      <CardTitle>Volumes</CardTitle>
      <CardBody>
        <List isPlain isBordered>
          {application && application.spec.volumes.map((volume, index) => (
            <ListItem key={index}>  
              <Text component="h3" >{volume.name}</Text>
              <TextContent>
                <Text component="p">Kind: {volumeKind(volume)} </Text>
              </TextContent>
              <TextContent>
                {application.spec.containers.filter((container) => container.volumeMounts.filter((volumeMount) => volumeMount.name === volume.name).length > 0).map((container) => (
                  <TextContent>
                    Container: {container.name}
                    {container.volumeMounts.filter((volumeMount) => volumeMount.name === volume.name).map((volumeMount) => (
                      <TextContent>
                        Path: {volumeMount.mountPath}
                      </TextContent>
                    ))}
                  </TextContent>
                ))}
              </TextContent>
              <TextContent>
                  Status:
                  <Status
                    title={volumeStatus.length > index ? "Available" : "Pending"}
                    status={volumeStatus.length > index ? volumeStatus[index] : "Pending"} />
              </TextContent>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  );
};

const volumeKind = (volume) => {
  //check if volume has property configMap and return `ConfigMap` or `Secret` otherwise
  if (volume.configMap) {
    return 'ConfigMap';
  }
  if (volume.secret) {
    return 'Secret';
  }
  if (volume.emptyDir) {
    return 'EmptyDir';
  }
  if (volume.persistentVolumeClaim) {
    return 'PersistentVolumeClaim';
  }
  if (volume.hostPath) {
    return 'HostPath';
  }
  if (volume.awsElasticBlockStore) {
    return 'AWS Elastic Block Store';
  }
  if (volume.azureDisk) {
    return 'Azure Disk';
  }
  if (volume.azureFile) {
    return 'Azure File';
  }
  if (volume.cinder) {
    return 'Cinder';
  }
  if (volume.downwardAPI) {
    return 'Downward API';
  }
  if (volume.fc) {
    return 'FC';
  }
  if (volume.flexVolume) {
    return 'Flex Volume';
  }
  return 'Unknown';
};

export default ApplicationHealthCard;
