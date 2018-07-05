import buildPreset from "../src"
import { check, fixtures, titles } from "./core"

describe("Target: Universal", () => {
  const options = buildPreset(null, {
    sourceMaps: false
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
