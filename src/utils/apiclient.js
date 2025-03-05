import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/todos/1',
});

// Attach request metadata
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date().getTime() };
  return config;
});

// Attach response metadata
apiClient.interceptors.response.use((response) => {
  response.config.metadata.endTime = new Date().getTime();
  return response;
}, (error) => {
  if (error.config) {
    error.config.metadata = { endTime: new Date().getTime() };
  }
  return Promise.reject(error);
});

export default apiClient;
