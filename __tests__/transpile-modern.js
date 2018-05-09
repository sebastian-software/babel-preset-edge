import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Transpile: Modern", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    transpile: "modern"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
