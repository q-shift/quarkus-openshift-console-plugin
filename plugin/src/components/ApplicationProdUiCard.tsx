import * as React from 'react';
import { useEffect, useState } from 'react';
import { Application } from '../types';

const ApplicationProdUiCard: React.FC<{application: Application }> = ({ application }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(application.url + '/q/dev')
  }, [application]);

  return (
        <div>
          <iframe
            title="Quarkus Production UI"
            src={url}
            width="100%"
            height="600"
            frameBorder="0"
            allowFullScreen />
        </div>
  );
};

export default ApplicationProdUiCard;
