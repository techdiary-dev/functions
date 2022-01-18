import { Handler } from "@netlify/functions";
import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import wait from "waait";

// const cached = new Map();

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

  // browser.close();

  return headingText;
};

export const handler: Handler = async (event, context) => {
  const base64Image = await getScreenShot();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      base64Image,
    }),
    // isBase64Encoded: true,
  };
};
