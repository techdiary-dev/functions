import { Response } from "@netlify/functions/src/function/response";

export const headers = {
  "Access-Control-Allow-Origin": `${process.env.HOST_URL}`,
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  "Access-Control-Max-Age": "2592000",
  "Access-Control-Allow-Credentials": "true",
};

/**
 * Lambda Response
 * @param responseBody Response Message
 * @param statusCode status code
 * @returns JSON
 */

export function response(responseBody: object, statusCode = 403): Response {
  return {
    statusCode,
    headers,
    body: JSON.stringify(responseBody),
  };
}
