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
import { fetchJobs } from '../services/QuarkusService';
import { JobKind } from 'k8s-types';

const ApplicationJobsHealthCard: React.FC<{ application: Application }> = ({ application }) => {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const newJobs = [];
    if (application && application.metadata) {
      fetchJobs(application.metadata.namespace).then((jobs) => {
        if (jobs) {
          jobs.forEach((job) => {
            if (job.metadata.name.startsWith(application.metadata.name) && job.metadata.name.endsWith('-init')) {
              newJobs.push(job);
            }
          });
        }
        setJobs(newJobs);

      })
    }
  }, [application]);


  return (
    <Card>
      <CardTitle>Jobs</CardTitle>
      <CardBody>
        <List isPlain isBordered>
          {jobs &&  jobs.map((job, index) => (
            <ListItem key={index}>  
              <Text component="h3" >{job.metadata.name}</Text>
              {job.spec.template.spec.containers.map((container) => (
                <>
                  <TextContent>Name: {container.name}</TextContent>
                  <TextContent>Image: {container.image}</TextContent>
                  <TextContent>Command: {container.command}</TextContent>
                  <TextContent>Args: {container.args}</TextContent>
                  </>
              ))}
              <TextContent>
                Status:
                <Status
                  title={jobStatus(job)}
                  status={jobStatus(job)}/>
              </TextContent>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  );
};

const jobStatus = (job: JobKind) => {
  if (job.status.succeeded) {
    return "Succeeded";
  }
  if (job.status.failed) {
    return "Failed";
  }
  if (job.status.active) {
    return "Running";
  }
  return "Unknown";
};

export default ApplicationJobsHealthCard;
