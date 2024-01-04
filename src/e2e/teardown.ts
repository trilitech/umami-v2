import { killNode } from "./utils";

// eslint-disable-next-line import/no-unused-modules
export default async function teardown() {
  killNode();
}
