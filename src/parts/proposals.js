import classPropertiesPlugin from "@babel/plugin-proposal-class-properties"
import objectRestSpreadPlugin from "@babel/plugin-proposal-object-rest-spread"

export function register(presets, plugins, options) {
  // Support for ES7 Class Properties (currently stage-2)
  // class { handleClick = () => { } }
  plugins.push(classPropertiesPlugin)

  // Support for Object Rest Spread `...` operator in objects.
  // { ...todo, completed: true }
  plugins.push([
    objectRestSpreadPlugin,
    {
      useBuiltIns: true
    }
  ])
}
