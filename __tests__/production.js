import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Production", () => {
  const options = buildPreset(null, {
    modules: false,
    sourceMaps: false,
    compression: true,
    env: "production"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
