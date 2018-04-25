import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Modern", () => {
  const options = buildPreset(null, {
    modules: false,
    target: "modern",
    sourceMaps: false
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
