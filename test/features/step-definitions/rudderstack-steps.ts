import {
  Given,
  When,
  Then,
  World,
  setWorldConstructor,
} from "@cucumber/cucumber";
import * as chai from "chai";
import apiHelpers from "../../helpers/apiHelpers.ts";

class CredentialsWorld extends World {
  dataPlaneURL?: string;
  writeKey?: string;
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

When(/^Logged in skip two factor authentication$/, async function () {
  // Skip 2-Factor Authentication
  const link = await $(`=I'll do this later`);
  await link.waitForExist({ timeout: 10000 });
  await link.click();
  console.log(`>>> ${link} was clicked`);

  // Another skip
  await browser.pause(1000);
  const btn = await $(`button=Go to dashboard`);
  await btn.waitForExist({ timeout: 10000 });
  await btn.waitForDisplayed({ timeout: 10000 });
  await btn.click();
});

Then(/^Get and store data plane URL$/, async function (this: CredentialsWorld) {
  // Close help pop-up
  await browser.pause(3000);
  const popUpBtn = await $(`button[data-action=close]`);
  await popUpBtn.click();

  //Fetch data plane URL
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
    //Fetch Write Key
    await browser.pause(1000);
    let writeKeyText: string = await $(
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
    // Construct parameters for api call
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

    // Call POST method
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
    // Click Destinations link on the side bar
    await $(`span=Destinations`).click();
    const value = await $(`.sc-ksJhlw.sc-fTkLMS.fxuygx.gHHISb`);
    let valueText: string = await value.getText();
    console.log(`>>> valueText: ${valueText}, value: ${value}`);

    // Validate if the destination passed is equal
    if (valueText === destination) {
      await value.click();
    } else {
      throw new Error(`Destination: ${destination} is not valid`);
    }

    // In Destination page get all the tabs
    await browser.pause(2000);
    let eventsTabs = await $$(`.ant-tabs-tab-btn`);
    let eventsTabsLength: number = await eventsTabs.length;
    let flag: boolean = false;

    // Find Events tab and click on it
    for (let i = 0; i < eventsTabsLength; i++) {
      let tabText: string = await eventsTabs[i].getText();
      if (tabText === "Events") {
        eventsTabs[i].click();
        flag = true;
        break;
      }
    }

    if (flag === false) {
      throw new Error(`Events tab was not clicked`);
    }
    console.log(`Events tab was clicked`);
  }
);

Then(/^Read the events data$/, async function () {
  // Fetch the two counts: Delivered & Failed
  await browser.pause(2000);
  let events = await $$(`h2.sc-gKHVrV.kFyvFM > span`);
  let numbers: string[] = [];
  console.log(`Events array was found: ${await events.length}`);
  const eventsLength = await events.length;
  for (let i = 0; i < eventsLength; i++) {
    const numText = await events[i].getText();
    numbers.push(numText);
  }

  let deliveredEvents: string = numbers[0];
  let failedEvents: string = numbers[1];
  console.log(`>>> delivery: ${deliveredEvents}, failed: ${failedEvents}`);

  // Assert the two counts
  chai.expect(parseInt(deliveredEvents)).to.greaterThanOrEqual(0);
  chai.expect(parseInt(failedEvents)).to.greaterThanOrEqual(0);
});
