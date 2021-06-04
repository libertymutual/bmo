# @b-mo/bundle

This module packages, loads, and resolves a dependency bundle. It allows you to easily extend dependency bundles
so that you can compose applications together easily.

Install the bundle package using whatever package manager you are using these days:

```npm i @b-mo/bundle```

```yarn add @b-mo/bundle```


By default, bundle will be loaded from the current working directory, but you can override it with params

```
import bundle from '@b-mo/bundle'

const b = bundle({ dir:'my/other/dir' })

bundle.run(...runArgs)

```

## API

Constructor:

```
const app = bundle(config);
```


config:
```
{
  dir // the directory to use as a root for the bundle
}
```

Load a bundle:

```
await app.load(config)
```

Loads a configuration and dependency bundle, but does not resolve or perform the injection.
The config parameter is the same as the constructor and takes precedent over the config value passed there.


Build a bundle:

```
await app.build()
```

Resolves and injects the dependency bundle, loading it if required, does not invoke the run() dependency.


Run a bundle

```
await app.run(...runArgs)
```

Loads and Builds a bundle (if not called before) and then invokes the run() dependency passing through any args.
