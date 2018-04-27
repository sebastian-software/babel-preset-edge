import buildPreset from "../src"
import { getFixtures, check } from "./core"

describe("Webpack", () => {
  const options = buildPreset(null, {
    modules: false,
    target: { browsers: "ie 11", node: "8.0.0" },
    imports: "webpack",
    sourceMaps: false
  })

  getFixtures().then((fixtures, titles) => {
    fixtures.forEach((fileName, index) => {
      test(titles[index], () => check(fileName, options))
    })
  })
})
