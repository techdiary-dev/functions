import { Handler } from "@netlify/functions";
import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import wait from "waait";
const getOptions = async () => {
  const isDev: boolean = process?.env?.NODE_ENV === "development";
  console.log({ isDev });

  const option = {
    product: "chrome",
    args: [],
    executablePath: "",
    headless: true,
    defaultViewport: {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1.5,
    },
  };

  if (isDev) {
    option.executablePath = process.env.CHROME_EXECUTEABLE_PATH as string;
  } else {
    // @ts-ignore
    option.args = chrome.args;
    option.executablePath = await chrome.executablePath;
  }

  return option;
};

const getScreenShot = async () => {
  const options = await getOptions();

  // @ts-ignore
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();
  await page.goto(`${process.env.CLIENT_URL}/thumbnail`);
  await wait(500);
  console.log("i am in techdiary");
  console.log("URL: " + process.env.CLIENT_URL);
  // const buffer = await page.screenshot({ type: "png" });
  // const base64Image = buffer.toString("base64");
  // cached.set("heyy", base64Image);

  const headingText = await page.$eval(
    "#__layout > main > div > div.flex-1 > h3",
    (el) => el.textContent
  );

  console.log(headingText);

  browser.close();

  return headingText;
};

export const handler: Handler = async (event, context) => {
  const base64Image = await getScreenShot();

  return {
    statusCode: 200,
    body: JSON.stringify({
      base64Image,
    }),
    // isBase64Encoded: true,
  };
};
