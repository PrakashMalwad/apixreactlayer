// api.js
import { getAuthHeaders } from './authutils';

export const fetchData = async (url, auth) => {
  const headers = getAuthHeaders(auth);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};