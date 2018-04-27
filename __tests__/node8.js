import buildPreset from "../src"
import { getFixtures, check } from "./core"

describe("Node v8", () => {
  const options = buildPreset(null, {
    modules: false,
    target: "node8",
    imports: "rollup-nodejs",
    sourceMaps: false
  })

  getFixtures().then((fixtures, titles) => {
    fixtures.forEach((fileName, index) => {
      test(titles[index], () => check(fileName, options))
    })
  })
})
