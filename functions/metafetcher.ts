import { Handler } from "@netlify/functions";
import fetch from "isomorphic-unfetch";
import * as cheerio from "cheerio";
import { response, headers } from "../lib/helpers";
export const handler: Handler = async (event, context) => {
  //   console.log("queryStringParameters", event.queryStringParameters);
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers };
    }
    if (event.httpMethod === "GET") {
      let meta;
      if (event.queryStringParameters?.url) {
        const res = await fetch(event.queryStringParameters?.url);
        if (res.status === 403) {
          return response(
            {
              success: 0,
              message: "Not a valid url",
            },
            403
          );
        }
        const content = await res.text();
        const $ = cheerio.load(content);
        const head = $("head");
        const title = head.find("title").text();
        const description = head
          .find('meta[name="description"]')
          .attr("content");
        const image = head.find('meta[property="og:image"]').attr("content");
        meta = { title, description, image: { url: image } };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: "Please enter an url with url query parameter",
          }),
        };
      }
      return response(
        {
          success: 1,
          meta,
        },
        200
      );
    } else {
      return response(
        {
          success: 0,
          message: "Only GET method is allowed",
        },
        400
      );
    }
  } catch (error) {
    console.log(error);
    return response(
      {
        success: 0,
        message: "Only absolute URLs are supported via query parameters url",
      },
      400
    );
  }
};
