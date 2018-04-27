import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Node v10", () => {
  const options = buildPreset(null, {
    target: "node10",
    sourceMaps: false
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
