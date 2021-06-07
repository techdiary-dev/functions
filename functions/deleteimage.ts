import { v2 as cloudinary } from "cloudinary";
import { promisify } from "util";
import { Handler } from "@netlify/functions";
import { response } from "../lib/helpers";

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

function getCloudinaryPublicId(url: string) {
  return url.split("/").slice(-2).join("/").split(".")[0];
}

export const handler: Handler = async (event) => {
  if (!event.headers.host?.includes(process.env.HOST_URL as string)) {
    return response(
      {
        message: "You can't delete our images. Please don't do that next time",
      },
      401
    );
  }
  cloudinary.config(config);
  if (event.httpMethod !== "DELETE") {
    return response({
      message: "Request type must be DELETE",
    });
  }
  try {
    const body = JSON.parse(event.body as string);

    if (!body.asset_url) {
      return response({ message: "asset_url is not provided." });
    }

    const url = new URL(body.asset_url);
    // const path = url.pathname;

    if (!url.hostname.includes("cloudinary.com")) {
      return response({ message: "asset_url is not provided." });
    }

    const res = (await promisify(cloudinary.api.delete_resources)([
      getCloudinaryPublicId(body.asset_url),
    ])) as object;

    return response(res, 200);
  } catch (error) {
    return response({ message: "Internal Server Error" }, 500);
  }
};
