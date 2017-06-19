import { transform } from 'babel-core';

test("ES2015: Classes", () => {
  expect(transform(`class Component{ main() { } }`).code).toMatchSnapshot()
})

test("ESNext: Async/Await", () => {
  expect(transform(`async function hello() { }`).code).toMatchSnapshot()
})

test("React: JSX", () => {
  expect(transform(`function render() { return <h1>Hello</h1> }`).code).toMatchSnapshot()
})
