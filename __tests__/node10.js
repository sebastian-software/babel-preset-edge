import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Node v10", () => {
  const options = buildPreset(null, {
    modules: false,
    target: "node10",
    imports: "rollup-nodejs",
    sourceMaps: false
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
