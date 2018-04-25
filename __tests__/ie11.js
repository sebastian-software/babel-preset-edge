import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("IE11", () => {
  const options = buildPreset(null, {
    modules: false,
    target: { browsers: "ie 11" },
    sourceMaps: false
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
