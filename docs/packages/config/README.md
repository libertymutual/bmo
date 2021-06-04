# @b-mo/config

This package encapsulates our configuration loading algorithm. Its fairly basic:
given a directory load the `index.js` and `${NODE_ENV}.config.js` if they exist.

If either module is a function (async or sync) call it and merge the resulting object with then environment
configuration taking priority.


# Example usage
Say you have the following directory structure in your project

```
/root
  /config
   -index.js
   -test.config.js
   -production.config.js
   -develop.config.js
```

```
process.env.NODE_ENV='test'
import { load } from '@b-mo/onfig'

const config = await load(`root/config`)

console.log(config)
// Your test config
```

# API

```
const config = await load(directory)

directory - string - The directory to look for configs to load.
returns - a config object with the merged config values.
```

```
config.get(valuePath)

valuePath - string - attempt to get the value at the given path.
returns - the value in the config if found, otherwise it returns undefined.

```

```
config.has(valuePath)

valuePath - string - see if there is a value at the given path.
returns - true if the path exists false if it does not.

```
