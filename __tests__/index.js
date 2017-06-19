import { transform } from 'babel-core';

test("Should transpile ES2015", () => {
  expect(transform(`class Component{ main() { } }`)).toMatchSnapshot()
})
