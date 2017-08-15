import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

const options = buildPreset(null, { modules: false, sourceMaps: false, compression: true })

fixtures.forEach((fileName, index) => {
  test(titles[index], () => check(fileName, options))
})
