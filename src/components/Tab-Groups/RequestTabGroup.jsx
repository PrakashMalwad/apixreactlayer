import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Tab-Groups.css';
import KeyValuePane from '../Panes/KeyValue/KeyValuePane';
import JsonEditorPane from '../Panes/Json/JsonEditorPane';
import AuthPane from '../Panes/AuthPane';

export default function RequestTabGroup({
  queryParams,
  setQueryParams,
  headers,
  setHeaders,
  body,
  setBody,
}) {
  const [auth, setAuth] = useState({
    type: 'None',
    apiKey: { key: '', value: '' },
    bearerToken: '',
    basicAuth: { username: '', password: '' },
  });

  const requestTabs = [
    {
      slug: 'query-params',
      title: 'Query Params',
      panel: KeyValuePane,
      paneValue: queryParams,
      setPaneValue: setQueryParams,
    },
    {
      slug: 'authorization',
      title: 'Authorization',
      panel: AuthPane,
      paneValue: auth,
      setPaneValue: setAuth,
    },
    {
      slug: 'headers',
      title: 'Headers',
      panel: KeyValuePane,
      paneValue: headers,
      setPaneValue: setHeaders,
    },
    {
      slug: 'body',
      title: 'Body',
      panel: JsonEditorPane,
      paneValue: body,
      setPaneValue: setBody,
    },
  ];

  return (
    <Tabs forceRenderTabPanel>
      <TabList className="flex mt-5 border border-gray-300 rounded-t-lg">
        {requestTabs.map((tab) => (
          <Tab
            key={tab.slug}
            className="mr-3 py-2 px-4 border-purple-400 focus:outline-none hover:text-purple-500 cursor-pointer transition-colors duration-200"
            selectedClassName="border-b-2 text-purple-600"
          >
            {tab.title}
          </Tab>
        ))}
      </TabList>

      {requestTabs.map((tab) => (
        <TabPanel
          key={tab.slug}
          className="react-tabs__tab-panel px-4 py-4 rounded-b-lg border border-t-0 border-gray-300"
        >
          {React.createElement(tab.panel, {
            paneValue: tab.paneValue,
            setPaneValue: tab.setPaneValue,
          })}
        </TabPanel>
      ))}
    </Tabs>
  );
}

RequestTabGroup.propTypes = {
  queryParams: PropTypes.array.isRequired,
  setQueryParams: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  setHeaders: PropTypes.func.isRequired,
  body: PropTypes.object.isRequired,
  setBody: PropTypes.func.isRequired,
};