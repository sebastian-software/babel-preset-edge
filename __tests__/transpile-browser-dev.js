import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Transpile: Browser: Dev", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    target: "browser",
    env: "development"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
