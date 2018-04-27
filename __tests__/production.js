import buildPreset from "../src"
import { getFixtures, check } from "./core"

describe("Production", () => {
  const options = buildPreset(null, {
    modules: false,
    sourceMaps: false,
    compression: true,
    env: "production"
  })

  getFixtures().then((fixtures, titles) => {
    fixtures.forEach((fileName, index) => {
      test(titles[index], () => check(fileName, options))
    })
  })
})
