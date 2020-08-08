// import { rest } from "msw";
// import { setupServer } from "msw/node";
// const config = require("../../../config");
// const getAllHelpResponse = require("../../fixtures/getAllHelpResponse.json");
// const app = require("../../../app");
// const isAuthorised = require("../../../middleware/auth");

// const server = setupServer(
//   // Describe the requests to mock.
//   rest.get(config.help_requests_api_url, (req, res, ctx) => {
//     { "postcode" : "E1" }= req.params;
//     return res(ctx.json(getAllHelpResponse));
//   })
// );

// // Enable API mocking before tests.
// // Establish requests interception layer before all tests.
// beforeAll(() => server.listen());

// // Reset any runtime request handlers we may add during the tests.
// // Clean up after all tests are done, preventing this
// // interception layer from affecting irrelevant tests.
// afterEach(() => server.resetHandlers());

// // Disable API mocking after the tests are done.
// afterAll(() => server.close());
// describe("Test the root path", () => {
//   test("It should response the GET method", async () => {
//     const response = await request(app).get("/", isAuthorised());
//     expect(response.statusCode).toBe(200);
//   });
// });

// // describe("Test help request path", () => {
// //   test("It should response the GET method", async () => {
// //     const response = await request(app).get("/search").p;
// //     expect(response.statusCode).toBe(200);
// //   });
// // });
