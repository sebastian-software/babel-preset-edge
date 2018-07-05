import buildPreset from "../src"
import { check, fixtures, titles } from "./core"

describe("Target: Browser: Dev", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    target: "browser",
    env: "development"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
