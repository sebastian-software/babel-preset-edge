import buildPreset from "../src"
import { getFixtures, check } from "./core"

describe("Browserslist Production", () => {
  const options = buildPreset(null, {
    target: "browser",
    sourceMaps: false,
    env: "production"
  })

  getFixtures().then((fixtures, titles) => {
    fixtures.forEach((fileName, index) => {
      test(titles[index], () => check(fileName, options))
    })
  })
})
