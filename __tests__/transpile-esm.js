import buildPreset from "../src"

import { check, fixtures, titles } from "./core"

describe("Transpile: ESM", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    transpile: "esm"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
