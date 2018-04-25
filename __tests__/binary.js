import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Binary", () => {
  const options = buildPreset(null, {
    target: "binary",
    sourceMaps: false,
    env: "production"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
