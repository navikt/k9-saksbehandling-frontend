import ResponseData from './ResponseData';

class ResponseError extends Error {
  public response: ResponseData;

  constructor(response: ResponseData) {
    super(response.statusText);
    this.response = response;
  }
}

export default ResponseError;
