import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Non Loose", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    target: { browsers: "ie 11" },
    looseMode: false,
    imports: "rollup-nodejs"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
