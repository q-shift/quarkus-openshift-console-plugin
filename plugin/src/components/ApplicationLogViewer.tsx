import * as React from 'react';
import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer';
import { useEffect, useState } from 'react';
import { Application } from '../types';
import { Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';

const ApplicationLogViewer: React.FC<{application: Application, containerName?: string }> = ({ application, containerName }) => {

  const [lines, setLines] = useState<string[]>(["mic", "check", "one", "two"]);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    console.log("Setting up logs");
    if (application && application.metadata) {
    console.log("Setting lines for app: " + application.metadata.name);
      setLines([
        'Application:' + application.metadata.name,
        'Container:' + containerName || application.metadata.name
      ]);
    }
  }, []);

  useEffect(() => {
    setContent(lines.join('\n'));
    console.log("Setting content: " + lines.join('\n'));
  }, [lines]);

  return (
    <>
      <LogViewer
        height="300"
        data={content}
        theme="dark" 
        toolbar={
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <LogViewerSearch placeholder="Search" />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      }/>
      </>
  );
}

export default ApplicationLogViewer;
