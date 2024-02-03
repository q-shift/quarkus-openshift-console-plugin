import * as React from 'react';
import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer';
import {
  Button,
  Tooltip,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup
} from '@patternfly/react-core';
import OutlinedPlayCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-play-circle-icon';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import DownloadIcon from '@patternfly/react-icons/dist/esm/icons/download-icon';
import { Application } from '../types';
import { PodKind } from '../k8s-types';
import { fetchApplicationPods, fetchPodsLogs } from '../services/QuarkusService';

const ApplicationLogViewer: React.FC<{ application: Application, containerName?: string }> = ({ application, containerName }) => {

  const [pods, setPods] = React.useState<PodKind[]>([]);

  const [content, setContent] = React.useState([]);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isFullScreen] = React.useState(false);
  const [itemCount, setItemCount] = React.useState(1);
  const [currentItemCount, setCurrentItemCount] = React.useState(0);
  const [_, setRenderData] = React.useState('');
  const [timer, setTimer] = React.useState(null);
  const [buffer, setBuffer] = React.useState([]);
  const [linesBehind, setLinesBehind] = React.useState(0);
  const logViewerRef = React.useRef();

  React.useEffect(() => {
    if (application && application.metadata) {
      fetchApplicationPods(application.metadata.namespace, application.metadata.name).then((newPods: PodKind[]) => {
        if (newPods) {
          console.log('(logs): Application pods:' +  newPods.map(p => p.metadata.name).join(', '));
          setPods(newPods);
        }
      });
    }
  }, [application]);

  React.useEffect(() => {
    console.log('Getting logs of pod...');
    if (pods && pods.length > 0) {
      console.log('Getting logs of pod:' + pods[0].metadata.name);
      fetchPodsLogs(application.metadata.namespace, pods[0].metadata.name, containerName).then(logs => {
        if (logs) {
          console.log('setting logs:' + logs);
          setContent(logs.split('\n'));
          setTimer(
            window.setInterval(() => {
              setItemCount(itemCount => itemCount + 1);
            }, 10)
          );
          return () => {
            window.clearInterval(timer);
          };

        }
      });
    }
  }, [pods]);


  React.useEffect(() => {
    if (itemCount > content.length) {
      window.clearInterval(timer);
    } else {
      setBuffer(content.slice(0, itemCount));
    }
  }, [itemCount]);

  React.useEffect(() => {
    if (!isPaused && buffer.length > 0) {
      setCurrentItemCount(buffer.length);
      setRenderData(buffer.join('\n'));
      if (logViewerRef && logViewerRef.current) {
        //TODO: Fix the commented line below 
        // logViewerRef.current.scrollToBottom();
      }
    } else if (buffer.length !== currentItemCount) {
      setLinesBehind(buffer.length - currentItemCount);
    } else {
      setLinesBehind(0);
    }
  }, [isPaused, buffer]);

  const onExpandClick = _event => {
  };

  const onDownloadClick = () => {
    const element = document.createElement('a');
    const file = new Blob(content, { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `logs.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const onScroll = ({ scrollOffsetToBottom, _scrollDirection, scrollUpdateWasRequested }) => {
    if (!scrollUpdateWasRequested) {
      if (scrollOffsetToBottom > 0) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    }
  };

  const ControlButton = () => (
    <Button
      variant={isPaused ? 'plain' : 'link'}
      onClick={() => {
        setIsPaused(!isPaused);
      }}
    >
      {isPaused ? <PlayIcon /> : <PauseIcon />}
      {isPaused ? ` Resume Log` : ` Pause Log`}
    </Button>
  );

  const leftAlignedToolbarGroup = (
    <React.Fragment>
      <ToolbarToggleGroup toggleIcon={<EllipsisVIcon />} breakpoint="md">
        <ToolbarItem variant="search-filter">
          <LogViewerSearch onFocus={_e => setIsPaused(true)} placeholder="Search" />
        </ToolbarItem>
      </ToolbarToggleGroup>
      <ToolbarItem>
        <ControlButton />
      </ToolbarItem>
    </React.Fragment>
  );

  const rightAlignedToolbarGroup = (
    <React.Fragment>
      <ToolbarGroup variant="icon-button-group">
        <ToolbarItem>
          <Tooltip position="top" content={<div>Download</div>}>
            <Button onClick={onDownloadClick} variant="plain" aria-label="Download current logs">
              <DownloadIcon />
            </Button>
          </Tooltip>
        </ToolbarItem>
        <ToolbarItem>
          <Tooltip position="top" content={<div>Expand</div>}>
            <Button onClick={onExpandClick} variant="plain" aria-label="View log viewer in full screen">
              <ExpandIcon />
            </Button>
          </Tooltip>
        </ToolbarItem>
      </ToolbarGroup>
    </React.Fragment>
  );

  const FooterButton = () => {
    const handleClick = _e => {
      setIsPaused(false);
    };
    return (
      <Button onClick={handleClick} isBlock>
        <OutlinedPlayCircleIcon />
        resume {linesBehind === 0 ? null : `and show ${linesBehind} lines`}
      </Button>
    );
  };
  return (
    <LogViewer
      id="application-log-viewer"
      data={content}
      theme="dark"
      scrollToRow={currentItemCount}
      innerRef={logViewerRef}
      height={isFullScreen ? '100%' : 600}
      toolbar={
      <Toolbar>
        <ToolbarContent>
          <ToolbarGroup>{leftAlignedToolbarGroup}</ToolbarGroup>
          <ToolbarGroup>{rightAlignedToolbarGroup}</ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
    }
      overScanCount={10}
      footer={isPaused && <FooterButton />}
      onScroll={onScroll}
      />
  );
};

export default ApplicationLogViewer;
