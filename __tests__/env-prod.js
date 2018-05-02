import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Production", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    compression: true,
    env: "production",
    debug: true
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
