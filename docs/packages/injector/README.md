# @b-mo/injector

The DI or dependency injection that BMO supplies is meant to be totally unobtrusive.
Simply attach your constructor to the root dependencies export, and deconstruct your modules dependencies
off of the manifest passed to each constructor.

#### Why dependency injection over `import`?

When you import a module, your are coupling your module directly to the imported module.
References to dependencies are hard coded and strewn throughout the code base.
If you need to change a dependency or module you have to update every reference to it and ensure that
the interface was not broken. Using dependency injection allows you to wrap your
external dependencies in modules that are then shared through the DI framework.
Any changes or updates are isolated to the one module, and percolated from that single point.


#### Example Module

```
export default async ({ config, dependencies :{ connectionPool } }) => ({
    query:async (query) => {
      const connection = await connectionPool.getConnection();
      const result = await connection.execute(query)
      return result;
    }
  })
```


### Using the dependency injector

```
import inject from '@b-mo/injector'

const dependencies = {
  //... a collection of your modules
}

const config = {
  //.... your configuration
}

// the manifest contains your created bundle
const manifest = await inject(config, dependencies)

//??
//profit

```

When the manifest is created the injector traverses your dependency tree injecting each modules dependencies
eventually ending up with an object with all your build modules.

### Package dependencies and built in modules:
The injector will detect and load nodejs builtin modules into your dependency context for you.
To use packages defined in your package.json, populate the 'pkg' key on your config with the package.json
structure and the dependency injector will also automatically load any dependencies requested in modules.
Some of the other tools will do this for you, but if you use this package directly you will need to load it yourself.

### Sub Contexts
Sometimes it is useful to be able to create an isolated dependency context within your dependencies.
The injector supplies a built in module to do this called `context` you can access it in any module being run
through the dependency injector


```
export default ({
  config,
  dependencies:{
    baz,
    bmo: { di: { context } }
  }
}) => context()
      .config(config)// sets the config for the context
      .inherit({
        baz
      })
      .dependencies({ //sets the dependencies for the module
        foo,
        bar
        //... your submodule dependencies
      })
      .expose({
        foo:true,
      })
      .module()
```

## Known Limitations

### Any tools that modify the AST of your code may break dependency injection

Using transpilers, minifiers, or uglifiers that modify the AST may or may not work. (probably won't)
