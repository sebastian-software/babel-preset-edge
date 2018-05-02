import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Node v8", () => {
  const options = buildPreset(null, {
    target: "node8",
    sourceMaps: false
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
