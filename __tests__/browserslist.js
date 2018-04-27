import buildPreset from "../src"
import { getFixtures, check } from "./core"

describe("Browserslist", () => {
  const options = buildPreset(null, {
    target: "browser",
    sourceMaps: false,
    env: "development"
  })

  getFixtures().then((fixtures, titles) => {
    fixtures.forEach((fileName, index) => {
      test(titles[index], () => check(fileName, options))
    })
  })
})
