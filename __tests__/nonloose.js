import buildPreset from "../src"
import { getFixtures, check } from "./core"

describe("Non Loose", () => {
  const options = buildPreset(null, {
    modules: false,
    target: { browsers: "ie 11" },
    looseMode: false,
    imports: "rollup-nodejs",
    sourceMaps: false
  })

  getFixtures().then((fixtures, titles) => {
    fixtures.forEach((fileName, index) => {
      test(titles[index], () => check(fileName, options))
    })
  })
})
