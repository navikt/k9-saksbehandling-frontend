import { loginWithRedirect } from './apiConfig';
import { redirect } from './browserUtils';
import ResponseData from './ResponseData';
import ResponseError from './ResponseError';

function checkStatus(response: ResponseData) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 401) {
    const url = loginWithRedirect();
    redirect(url);
    return;
  }

  throw new ResponseError(response);
}

const getData = (response: Response): Promise<ResponseData> => {
  return response
    .json()
    .then(data => ({
      data,
      status: response.status,
      statusText: response.statusText,
    }))
    .catch(() => {
      console.log('No JSON data in response');
      return {
        status: response.status,
        statusText: response.statusText,
      };
    });
};

export const get = (
  url: string,
  options: RequestInit = {},
): Promise<ResponseData> => {
  // @ts-ignore
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  })
    .then(getData)
    .then(checkStatus);
};

export const post = (
  url: string,
  body: object,
  options: RequestInit = {},
): Promise<ResponseData> => {
  // @ts-ignore
  return fetch(url, {
    ...options,
    body: JSON.stringify(body),
    method: 'POST',
    credentials: 'include',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  })
    .then(getData)
    .then(checkStatus);
};
