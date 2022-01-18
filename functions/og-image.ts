import { Handler } from "@netlify/functions";
import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import wait from "waait";

const cached = new Map();

const getScreenShot = async () => {
  const browser = await puppeteer.launch({
    product: "chrome",
    executablePath:
      process.env.CHROME_EXECUTEABLE_PATH || (await chrome.executablePath),
    args: chrome.args,
    headless: chrome.headless,
    defaultViewport: {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1.5,
    },
  });

  const page = await browser.newPage();
  await page.goto(`${process.env.CLIENT_URL}/thumbnail`);
  await wait(500);
  const buffer = await page.screenshot({ type: "png" });
  const base64Image = buffer.toString("base64");
  cached.set("heyy", base64Image);
  browser.close();
  return base64Image;
};

export const handler: Handler = async (event, context) => {
  const base64Image = await getScreenShot();

  return {
    statusCode: 200,
    body: base64Image,
    isBase64Encoded: true,
  };
};
