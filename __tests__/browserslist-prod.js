import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Browserslist Production", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    target: "browser",
    env: "production"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
