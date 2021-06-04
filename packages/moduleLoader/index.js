import { isString, get } from 'lodash'
import es6Require from '@b-mo/es6-require'

const getLocalPath = module => require.resolve(`${module}`, {
  paths: [ `${process.cwd()}/node_modules/`, __dirname ]
})

export default pkg => {
  let module = pkg
  if (isString(pkg)) {
    module = require(`${pkg}/package.json`)
  }

  const modules = get(module, 'bmo.modules', {})
  return Object.keys(modules).reduce((agg, key) => {
    const value = modules[key]
    const mod = es6Require(getLocalPath(key))
    const modPackage = es6Require(getLocalPath(`${key}/package.json`))
    if (get(modPackage, 'bmo.module')) {
      agg[value] = mod
    } else {
      agg[value] = () => mod
    }

    return agg
  }, {})
}
