import path from 'path'
import pkgup from 'pkg-up'
import { load as loadConfig } from '@b-mo/config'
import loadBundle from './load'
import buildBundle from './build'
import resolve from './resolve'
import {
  merge,
  has, set, get,
  isString, isNumber,
  isFunction, isObject
} from 'lodash'

const BUNDLE_DEPENDENCIES = 'bundle.dependencies'
const BUNDLE_CONFIG = 'bundle.config'
const BUNDLE_DEPENDENCY_PATH = 'dependencies.bmo.bundle'

const isExtendable = value => !isString(value) && !isNumber(value) && !isFunction(value)

class Bundle {
  get manifest() {
    return this._manifest
  }

  dependencies(dependencies) {
    if (has(this, BUNDLE_DEPENDENCIES)) {
      throw new Error('Dependencies have already been loaded for this bundle!')
    }

    set(this, BUNDLE_DEPENDENCIES, dependencies)
    return this
  }

  config(config) {
    if (has(this, BUNDLE_CONFIG)) {
      throw new Error('Config already loaded for bundle')
    }

    set(this, BUNDLE_CONFIG, config)
    return this
  }

  setRoot(dir) {
    this._root = dir
    return this
  }

  get root() {
    return this._root || process.cwd()
  }

  async load() {
    if (!this.bundle) {
      const dir = this.root
      const pkg = require(await pkgup({ cwd: dir }))
      const config = await loadConfig(path.resolve(dir, './config'))
      this.cwd = dir
      this.bundle = await loadBundle({ dir, pkg, config })
      // Injects a bundle builder into the dependencies
      set(this.bundle, BUNDLE_DEPENDENCY_PATH, () => () => new Bundle())
    } else {
      throw new Error('Calling load on a bundle that has already been created is not supported')
    }

    return this
  }

  async build() {
    if (this._manifest) {
      throw new Error('Cannot call build twice on the same module.')
    }

    if (!this.resolved) {
      await this.resolve()
    }

    this._manifest = await buildBundle({
      bundle: merge({}, this.resolved, this._overrides)
    })
    return this
  }

  async resolve() {
    if (!this.bundle) {
      await this.load()
    }

    this.resolved = resolve(this)
    return this
  }

  async run(...runArgs) {
    if (!this.manifest) {
      await this.build()
    }

    if (!this.manifest.dependencies.run) {
      throw new Error('No run dependency found. Please add one to your bundle!')
    }

    return this.manifest.dependencies.run(...runArgs)
  }

  async stop() {
    if (this.manifest.dependencies.stop) {
      await this.manifest.dependencies.stop()
    }
  }

  override({ dependencies, config }) {
    this._overrides = merge({}, this._overrides, { dependencies, config })
    return this
  }

  get bundleDependencies() {
    if (this.resolved) {
      return this.resolved.dependencies
    }

    if (this.bundle) {
      return this.bundle.dependencies
    }

    return {}
  }

  // Given the full dependency path return the part that exists in the bundle.
  getBundlePathNamespace(path) {
    let ns
    const parts = path.split('.')
    do {
      ns = get(this.bundleDependencies, parts.join('.'))
      if (!ns) {
        parts.pop()
      }
    } while (!ns && parts.length > 0)

    return parts.join('.')
  }

  getNamespaceForPath(path) {
    return get(this.bundleDependencies, this.getBundlePathNamespace(path))
  }

  add(path, module) {
    if (!this.bundle) {
      throw new Error('Bundle must be loaded before adding new dependencies.')
    }

    if (this.resolved) {
      throw new Error('Cannot add dependency after bundle has been resolved.')
    }

    const ns = this.getNamespaceForPath(path)
    if (ns) {
      if (!isExtendable(ns)) {
        throw new Error(`Unable to append to namespace type ${typeof ns}. Use override if you are trying to replace an existing module.`)
      } else if (Array.isArray(ns)) {
        // Namespace is an array type. Safe to append to.
        ns.push(module)
      } else if (isObject(ns)) {
        // Namespace is a plain object should be safe to add to.
        set(this.bundle.dependencies, path, module)
      }
    } else {
      // No part of the existing path so it is safe to set it.
      set(this.bundle.dependencies, path, module)
    }

    return this
  }
}

export default () => new Bundle()

