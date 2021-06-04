import dotenv from 'dotenv'
import bundle from '@b-mo/bundle'
import { extract as extractDependencyNames } from '@b-mo/injector'
import { get, set } from 'lodash'
dotenv.config()
const getModules = ({
  bundle,
  mocks,
  names
}) => names.map(s => ({
  key: s,
  value: bundle.getNamespaceForPath(s)
}))
  .reduce((acc, { key, value }) => {
    const mock = get(mocks, key)
    set(acc, key, mock ? () => mock : value)
    return acc
  }, {})

export default ({ config, dependencies } = {}) => {
  let bundleConfig = { ...config }
  let bundleDependencies = { ...dependencies }
  return {
    setRoot(root) {
      this._root = root
      return this
    },
    extend() {
      throw new Error('mocker.extends is deprecated. Please declare extensions as a part of your application definition')
    },
    config(path, value) {
      set(bundleConfig, path, value)
      return this
    },
    mock(path, mock) {
      set(bundleDependencies, path, mock)
      return this
    },
    async _loadRootBundle() {
      if (this._rootBundle) {
        return
      }

      const rootBundle = bundle()
      if (this._root) {
        rootBundle.setRoot(this._root)
      }

      this._rootBundle = rootBundle
      await rootBundle.resolve()
    },
    async build(module) {
      try {
        await this._loadRootBundle()
        const mockBundle = bundle()
        mockBundle.config(this._rootBundle.resolved.config)
        mockBundle.override({ config: bundleConfig })

        const dependencies = getModules({
          bundle: this._rootBundle,
          names: extractDependencyNames(module),
          mocks: bundleDependencies
        })

        mockBundle.dependencies({
          ...dependencies,
          testMod: module
        })
        await mockBundle.build()
        const mod = mockBundle.manifest.dependencies.testMod
        mod.manifest = mockBundle.manifest
        return mod
      } catch (e) {
        console.log('Failed to build')
        console.error(e)
        throw e
      }
    }
  }
}

