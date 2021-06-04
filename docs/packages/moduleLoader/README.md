# @b-mo/module-loader


Loads the bmo modules defined in the package.json.


```
import loadModules from '@b-mo/load-modules'

const modules = loadModules(process.cwd())

// outputs the bmo modules defined in the package.json
console.log(modules)
```
