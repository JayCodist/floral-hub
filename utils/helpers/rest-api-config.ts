import User from "../types/User";
import AppStorage, { AppStorageConstants } from "./storage-helpers";

const baseUrl = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
// const baseUrl = "http://localhost:8080";

const getAPIHeaders = () => {
  const savedUser = AppStorage.get<User>(AppStorageConstants.USER_DATA);

  const restAPIHeaders: HeadersInit = {
    "Content-Type": "application/json",
    authorization: savedUser ? `Bearer ${savedUser.authToken}` : ""
  };
  return restAPIHeaders;
};
interface FetchInstanceType {
  get: (url: string, config?: RequestInit) => Promise<any>;
  post: (url: string, data?: any, config?: RequestInit) => Promise<any>;
  put: (url: string, data: any, config?: RequestInit) => Promise<any>;
  patch: (url: string, data: any, config?: RequestInit) => Promise<any>;
  delete: (url: string, config?: RequestInit) => Promise<any>;
}

const processResponse = async (response: Response) => {
  const json = await response.json();
  // Reject 4xx and 5xx responses
  if (/^(4|5)/.test(String(response.status))) {
    throw json;
  }
  return json;
};

export const restAPIInstance: FetchInstanceType = {
  get: (url, config) =>
    fetch(`${baseUrl}${url}`, {
      ...(config || {}),
      method: "GET",
      headers: {
        ...getAPIHeaders(),
        ...(config?.headers || {})
      }
    }).then(processResponse),
  post: (url, data, config) =>
    fetch(`${baseUrl}${url}`, {
      body: JSON.stringify(data),
      ...(config || {}),
      method: "POST",
      headers: {
        ...getAPIHeaders(),
        ...(config?.headers || {})
      }
    }).then(processResponse),
  put: (url, data, config) =>
    fetch(`${baseUrl}${url}`, {
      body: JSON.stringify(data),
      ...(config || {}),
      method: "PUT",
      headers: {
        ...getAPIHeaders(),
        ...(config?.headers || {})
      }
    }).then(processResponse),
  patch: (url, data, config) =>
    fetch(`${baseUrl}${url}`, {
      body: JSON.stringify(data),
      ...(config || {}),
      method: "PATCH",
      headers: {
        ...getAPIHeaders(),
        ...(config?.headers || {})
      }
    }).then(processResponse),
  delete: (url, config) =>
    fetch(`${baseUrl}${url}`, {
      ...(config || {}),
      method: "DELETE",
      headers: {
        ...getAPIHeaders(),
        ...(config?.headers || {})
      }
    }).then(processResponse)
};
