import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Transpile: ESM", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    transpile: "esm"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
