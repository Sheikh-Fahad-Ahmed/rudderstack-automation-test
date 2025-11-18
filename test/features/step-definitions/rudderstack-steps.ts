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

Then(
  /^Move to events tab in destination (.*)$/,
  async function (destination: string) {
    await $(`span=Destinations`).click();
    const value = await $(`.sc-ksJhlw.sc-fTkLMS.fxuygx.gHHISb`);
    let valueText: string = await value.getText();
    console.log(`>>> valueText: ${valueText}, value: ${value}`);
    if (valueText === destination) {
      await value.click();
    }
    await browser.pause(2000);
    let eventsTabs = await $$(`.ant-tabs-tab-btn`);
    let eventsTabsLength = await eventsTabs.length;
    for (let i = 0; i < eventsTabsLength; i++) {
      let tabText = await eventsTabs[i].getText();
      if (tabText === "Events") {
        eventsTabs[i].click();
        break;
      }
    }
    console.log(`Events tab was clicked`);
    await browser.pause(3000);
  }
);
//*[@id="top-layout"]/div[2]/div/div/div/div[2]/div/div/div/div/div/div/div[2]/table/tbody/tr[2]/td[1]/div
//*[@id="rc-tabs-0-panel-Events"]/div[3]/div[1]/div/div[1]/div/h2

Then(/^Read the events data$/, async function () {
  await browser.pause(2000);
  let events = await $$(`h2.sc-gKHVrV.kFyvFM > span`);
  let numbers = [];
  console.log(`Events array was found: ${await events.length}`);
  const eventsLength = await events.length;
  for (let i = 0; i < eventsLength; i++) {
    const numText = await events[i].getText();
    numbers.push(numText);
  }
  let deliveredEvents = numbers[0];
  let failedEvents = numbers[1];
  console.log(`>>> delivery: ${deliveredEvents}, failed: ${failedEvents}`);
});
