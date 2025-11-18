import request from "supertest";

async function POST(
  baseURL: string,
  endPoint: string,
  authHeader: string,
  payload: object
) {
  if (!baseURL || !endPoint) {
    throw Error(
      `>>>: baseURL: ${baseURL} or endPoint: ${endPoint} is not valid`
    );
  }
  try {
    const response = await request(baseURL)
      .post(endPoint)
      .set("Authorization", authHeader)
      .set("Content-Type", "application/json")
      .send(payload)
      .expect(200);
    return response;
  } catch (err) {
    err.message = `Error making POST call ${err}`;
    throw err;
  }
}

// (async () => {
//   const baseURL: string = "https://fermiromakugbs.dataplane.rudderstack.com";
//   const endPoint: string = "/v1/track";
//   const writeKey: string = "35axkmW2ssNTUf6QmgU49kMDc2F";
//   const authHeader: string =
//     "Basic " + Buffer.from(`${writeKey}:`).toString("base64");
//   const payload: object = {
//     userId: "fahd838",
//     event: "test event",
//   };
//   try {
//     const response = await POST(baseURL, endPoint, authHeader, payload);
//     console.log("Event sent successfully", response.body);
//   } catch (error) {
//     console.error("Failed to send event:", error);
//   }
// })();

// ("https://fermiromakugbs.dataplane.rudderstack.com", "/v1/track");
export default { POST };
// bWFoYXlvczQ0N0BmZXJtaXJvLmNvbTpBYmNkZV8xMjM0NTY=
