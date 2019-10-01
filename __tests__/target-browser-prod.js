import buildPreset from "../src"

import { check, fixtures, titles } from "./core"

describe("Target: Browser: Prod", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    target: "browser",
    env: "production"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
