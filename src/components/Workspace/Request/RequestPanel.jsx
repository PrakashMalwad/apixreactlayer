import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { convertKeyValueToObject } from "../../../utils/helpers";
import UrlEditor from "../../Panes/RequestUrl/UrlEditor";
import RequestTabGroup from "../../Tab-Groups/RequestTabGroup";
import apiClient from "../../../utils/apiclient";
import axios from "axios";

const keyPairInitState = [{ id: uuidv4(), keyItem: "", valueItem: "" }];

export default function Request({
  setResponse,
  setLoading,
  selectedRequest,
  requestdata,
  setRequestData,
  selectedCollection,
  updateCollection,
}) {
  const [url, setUrl] = useState("");
  const [reqMethod, setReqMethod] = useState("GET");
  const [queryParams, setQueryParams] = useState(keyPairInitState);
  const [headers, setHeaders] = useState(keyPairInitState);
  const [body, setBody] = useState("{\n\t\n}");
  const [auth, setAuth] = useState({
    type: "None",
    apiKey: { key: "", value: "" },
    bearerToken: "",
    basicAuth: { username: "", password: "" },
  });

  // Load selected API request
  useEffect(() => {
    if (selectedRequest) {
      setUrl(selectedRequest.url || "");
      setReqMethod(selectedRequest.method || "GET");
      setQueryParams(selectedRequest.queryParams?.length ? selectedRequest.queryParams : keyPairInitState);
      setHeaders(selectedRequest.headers?.length ? selectedRequest.headers : keyPairInitState);
      setBody(selectedRequest.body || "{\n\t\n}");
      setAuth(
        selectedRequest.auth || {
          type: "None",
          apiKey: { key: "", value: "" },
          bearerToken: "",
          basicAuth: { username: "", password: "" },
        }
      );
    }
  }, [selectedRequest]);

  // Auto-save API request when any field changes
  useEffect(() => {
    if (selectedCollection && selectedRequest) {
      const newRequest = {
            ...selectedRequest,
            url,
            method: reqMethod,
            queryParams,
            headers,
            body,
            auth,
          };
      
          setRequestData(newRequest);
    }
  }, [url, reqMethod, queryParams, headers, body, auth]);


  // const autoSaveRequest = async () => {
  //   if (!selectedCollection || !selectedRequest) return;

  //   const newRequest = {
  //     ...selectedRequest,
  //     url,
  //     method: reqMethod,
  //     queryParams,
  //     headers,
  //     body,
  //     auth,
  //   };

  //   setRequestData(newRequest);
  //   console.log("Request Data: ", newRequest);

  //   console.log("Selected Request: ", selectedRequest._id);
  //   const updatedRequests = selectedCollection.requests.map((req) =>
  //     req.id === selectedRequest.id ? newRequest : req
  //   );
  //   console.log("Updated Requests: ", updatedRequests,);
  //   try {
  //     await axios.put(`/api/collections/${selectedCollection._id}`, { requests: updatedRequests });
  //     updateCollection(updatedCollection);
  //   } catch (error) {
  //     console.error("Error updating collection:", error);
  //   }
  // };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      autoSaveRequest();
    }
  };

  const handleOnInputSend = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setResponse({ error: "URL cannot be empty" });
      return;
    }

    setLoading(true);

    let requestBody = {};
    if (body.trim()) {
      try {
        requestBody = JSON.parse(body);
      } catch (error) {
        console.error("Invalid JSON body:", error);
        setLoading(false);
        setResponse({ error: "Invalid JSON in request body" });
        return;
      }
    }

    const requestHeaders = {
      ...convertKeyValueToObject(headers),
      ...getAuthHeaders(auth),
    };

    try {
      const response = await apiClient({
        url,
        method: reqMethod,
        params: convertKeyValueToObject(queryParams),
        headers: requestHeaders,
        data: requestBody,
      });

      setResponse(response);
    } catch (error) {
      console.error("Request Error:", error);
      setResponse({
        error: error.response?.data || error.message || "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = (auth) => {
    if (!auth) return {};

    switch (auth.type) {
      case "API Key":
        return auth.apiKey.key && auth.apiKey.value
          ? { [auth.apiKey.key]: auth.apiKey.value }
          : {};
      case "Bearer Token":
        return auth.bearerToken ? { Authorization: `Bearer ${auth.bearerToken}` } : {};
      case "Basic Auth":
        return auth.basicAuth.username && auth.basicAuth.password
          ? {
            Authorization: `Basic ${btoa(
              `${auth.basicAuth.username}:${auth.basicAuth.password}`
            )}`,
          }
          : {};
      default:
        return {};
    }
  };

  return (
    <>
      <UrlEditor
        url={url}
        setUrl={setUrl}
        reqMethod={reqMethod}
        setReqMethod={setReqMethod}
        onInputSend={handleOnInputSend}
        onKeyDown={handleKeyDown}
      />
      <RequestTabGroup
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        headers={headers}
        setHeaders={setHeaders}
        body={body}
        setBody={setBody}
        auth={auth}
        setAuth={setAuth}
      />
    </>
  );
}

Request.propTypes = {
  setResponse: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  selectedRequest: PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string,
    method: PropTypes.string,
    queryParams: PropTypes.array,
    headers: PropTypes.array,
    body: PropTypes.string,
    auth: PropTypes.object,
  }),
  requestdata: PropTypes.object,
  setRequestData: PropTypes.func.isRequired,
  selectedCollection: PropTypes.object,
  updateCollection: PropTypes.func,
};
