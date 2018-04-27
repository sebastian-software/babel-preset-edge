import buildPreset from "../src"
import { getFixtures, check } from "./core"

describe("ES2015", () => {
  const options = buildPreset(null, {
    modules: false,
    target: "es2015",
    sourceMaps: false
  })

  getFixtures().then((fixtures, titles) => {
    fixtures.forEach((fileName, index) => {
      test(titles[index], () => check(fileName, options))
    })
  })
})
