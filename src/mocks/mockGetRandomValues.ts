// Have to use a mutation on a let variable because of jest beforeAll from setupTests.ts
let realGetRandomvalues: any;

beforeAll(() => {
  realGetRandomvalues = window.crypto.getRandomValues;
  // mock impure getRandomeValues
  window.crypto.getRandomValues = (i) => i;
});

afterAll(() => {
  window.crypto.getRandomValues = realGetRandomvalues;
});

export {};
