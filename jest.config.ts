import type { Config } from "@jest/types";
export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
     displayName: {
     name: "placeNameOfYourAppHere",
     color: "greenBright",
   },
   verbose: true,
   setupFiles: ["dotenv/config"],
   testMatch: ["**/**/*.test.ts"],
   testEnvironment: "jsdom",
   detectOpenHandles: true,
   collectCoverage: true,
   transform: { "^.+\\.tsx?$": "ts-jest" },
   globalTeardown: "<rootDir>/src/tests/jest-globals-teardown.ts",
  forceExit: true,
   
 };
};