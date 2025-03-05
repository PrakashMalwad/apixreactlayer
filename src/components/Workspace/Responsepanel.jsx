import React, { useState, useEffect } from 'react';
import prettyBytes from 'pretty-bytes';
import PropTypes from 'prop-types';
import ResponseTabGroup from '../../Tab-Groups/ResponseTabGroup';

export default function Response({ response, loading }) {
  const [doc, setDoc] = useState('{}');

  useEffect(() => {
    if (!response || !response.data) return;
    try {
      setDoc(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setDoc('Invalid JSON response');
    }
  }, [response, loading]);

  const hasResponse = response !== null;
  let time = '';
  let status = '';
  let size = '';

  if (hasResponse) {
    status = response.status || 'N/A';

    if (response.data && response.headers) {
      size = prettyBytes(JSON.stringify(response.data).length);
    }

    // Ensure time calculation is handled correctly
    if (response.config?.metadata?.startTime && response.config.metadata.endTime) {
      time = `${response.config.metadata.endTime - response.config.metadata.startTime} ms`;
    } else {
      time = 'N/A';
    }
  }

  const RenderedResponseMeta = () => (
    <div className="flex mt-3 text-purple-600">
      <span className="w-28 px-2">Status: {status}</span>
      <span className="w-28 px-2">Time: {time}</span>
      <span className="w-28 px-2">Size: {size}</span>
    </div>
  );

  return (
    <div className="my-4">
      {hasResponse && <RenderedResponseMeta />}
      <ResponseTabGroup doc={doc} setDoc={setDoc} response={response} loading={loading} />
    </div>
  );
}

Response.propTypes = {
  response: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};