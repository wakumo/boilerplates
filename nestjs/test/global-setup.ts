require("dotenv").config();

import * as matchers from 'jest-extended';
expect.extend(matchers);

import "@/test/mocks/mock-rabbitmq-spec.event-message";
import '@/test/mocks/mock-eventmq.module';

if (process.env.SILENT_TEST === "1") {
  console.log("SILENT");
  jest.spyOn(console, "log").mockImplementation(() => null);
  jest.spyOn(console, "info").mockImplementation(() => null);
  jest.spyOn(console, "error").mockImplementation(() => null);
  jest.spyOn(console, "time").mockImplementation(() => null);
  jest.spyOn(console, "timeEnd").mockImplementation(() => null);
}
