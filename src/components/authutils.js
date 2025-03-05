
export const getAuthHeaders = (auth) => {
    switch (auth.type) {
      case "API Key":
        return {
          [auth.apiKey.key]: auth.apiKey.value,
        };
      case "Bearer Token":
        return {
          Authorization: `Bearer ${auth.bearerToken}`,
        };
      case "Basic Auth":
        return {
          Authorization: `Basic ${btoa(`${auth.basicAuth.username}:${auth.basicAuth.password}`)}`,
        };
      default:
        return {};
    }
  };