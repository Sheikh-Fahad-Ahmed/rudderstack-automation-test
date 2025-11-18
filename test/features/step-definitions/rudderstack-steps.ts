import {
  Given,
  IWorldOptions,
  Then,
  World,
  setWorldConstructor,
} from "@cucumber/cucumber";
import apiHelpers from "../../helpers/apiHelpers.ts";

class CredentialsWorld extends World {
  dataPlaneURL?: string;
  writeKey?: string;
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CredentialsWorld);
Given(/^Login to rudderstack web app$/, async function () {
  // Launch browser and load page
  await browser.url(process.env.RUDDERSTACK_LOGIN_URL);
  await browser.setTimeout({ implicit: 15000, pageLoad: 10000 });

  // input credentials
  await $(`#text-input-email`).setValue(process.env.STANDARD_USER);
  await $(`#text-input-password`).setValue(process.env.STANDARD_PASSWORD);
  await $(`span=Log in`).click();
});

Then(/^Get and store data plane URL$/, async function (this: CredentialsWorld) {
  const link = await $(`=I'll do this later`);
  await link.waitForExist({ timeout: 10000 });
  await link.click();
  console.log(`>>> ${link} was clicked`);

  await browser.pause(1000);
  const btn = await $(`button=Go to dashboard`);
  await btn.waitForExist({ timeout: 10000 });
  await btn.waitForDisplayed({ timeout: 10000 });
  await btn.click();

  await browser.pause(3000);
  const popUpBtn = await $(`button[data-action=close]`);
  await popUpBtn.click();

  await browser.pause(3000);
  this.dataPlaneURL = await $(
    `//*[@id="top-layout"]/div[2]/div/div/div/div[1]/div/div/div/div/span`
  ).getText();
  await browser.pause(2000);
  console.log(this.dataPlaneURL);
});

Then(
  /^Store write key of HTTP source for api call$/,
  async function (this: CredentialsWorld) {
    await browser.pause(1000);
    let writeKeyText = await $(
      `(//span[@class="sc-kDnyiN kWZpvc text-ellipsis"])[2]`
    ).getText();
    console.log(`>>> write Key Text: ${writeKeyText}`);
    this.writeKey = writeKeyText.split("Write key ")[1];
    console.log(this.writeKey);
  }
);

Then(
  /^Use write key and data plane url to call api$/,
  async function (this: CredentialsWorld) {
    const baseURL: string = this.dataPlaneURL;
    const endPoint: string = "/v1/track";
    const authHeader: string =
      "Basic " + Buffer.from(`${this.writeKey}:`).toString("base64");
    const payload: object = {
      userId: "fahd838",
      event: "test event",
    };

    console.log(
      `>>>>> Data plane url: ${baseURL} , write key: ${this.writeKey}, Auth header: ${authHeader}`
    );
    try {
      const response = await apiHelpers.POST(
        baseURL,
        endPoint,
        authHeader,
        payload
      );
      console.log("Event sent successfully", response.body);
    } catch (error) {
      console.error("Failed to send event:", error);
    }
    await browser.pause(3000);
  }
);


