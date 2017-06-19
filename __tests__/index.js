import { transform } from "babel-core"
import buildPreset from "../src"

const options = buildPreset()

test("ES2015: Classes", () => {
  expect(transform(`class Component{ main() { } }`, options).code).toMatchSnapshot()
})

test("ES2015: Set", () => {
  expect(transform(`new Set([1,2,3])`, options).code).toMatchSnapshot()
})

test("React: JSX", () => {
  expect(transform(`function render() { return <h1>Hello</h1> }`, options).code).toMatchSnapshot()
})

test("ESNext: Object Spread", () => {
  expect(transform(`let original = { bar : 10 }; let variant = { foo: 1, ...original }`, options).code).toMatchSnapshot()
})

test("ESNext: Class Properties", () => {
  expect(transform(`class Component{ onClick = () => { } }`, options).code).toMatchSnapshot()
})

test("ESNext: Async/Await", () => {
  expect(transform(`async function hello() { }`, options).code).toMatchSnapshot()
})

test("Lodash", () => {
  expect(transform(`import { camelCase } from "lodash"; camelCase("hello world")`, options).code).toMatchSnapshot()
})
