import { Handler } from "@netlify/functions";
import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import wait from "waait";

// const cached = new Map();

const getScreenShot = async () => {
  const browser = await puppeteer.launch({
    product: "chrome",
    executablePath: await chrome.executablePath,
    args: chrome.args,
    headless: true,
    defaultViewport: {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1.5,
    },
  });

  const page = await browser.newPage();
  await page.goto(`${process.env.CLIENT_URL}/thumbnail`);
  await wait(500);
  console.log("i am in techdiary");
  console.log("URL: " + process.env.CLIENT_URL);
  // const buffer = await page.screenshot({ type: "png" });
  // const base64Image = buffer.toString("base64");
  // cached.set("heyy", base64Image);
  browser.close();
  // return base64Image;
};

export const handler: Handler = async (event, context) => {
  // const base64Image = await getScreenShot();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
    }),
    // isBase64Encoded: true,
  };
};
