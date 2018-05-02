import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Node v6", () => {
  const options = buildPreset(null, {
    target: "node6",
    sourceMaps: false
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
