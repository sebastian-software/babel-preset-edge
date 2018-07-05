import buildPreset from "../src"
import { check, fixtures, titles } from "./core"

describe("Target: Universal: Node Imports", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    imports: "node"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
