import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

const options = buildPreset(null, {
  modules: false,
  target: "node8",
  imports: "rollup-nodejs",
  sourceMaps: false
})

fixtures.forEach((fileName, index) => {
  test(titles[index], () => check(fileName, options))
})
