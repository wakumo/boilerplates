import "dotenv/config";

import matchers from 'jest-extended';
expect.extend(matchers);

import "../mocks/mock-rabbitmq-spec.event-message.js";
import "../mocks/mock-eventmq.module.js";

if (process.env.SILENT_TEST === "1") {
  console.log("SILENT");
  jest.spyOn(console, "log").mockImplementation(() => null);
  jest.spyOn(console, "info").mockImplementation(() => null);
  jest.spyOn(console, "error").mockImplementation(() => null);
  jest.spyOn(console, "time").mockImplementation(() => null);
  jest.spyOn(console, "timeEnd").mockImplementation(() => null);
}
