import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("ES2015", () => {
  const options = buildPreset(null, {
    target: "es2015",
    sourceMaps: false
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
