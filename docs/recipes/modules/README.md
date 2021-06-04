# BMO Modules

BMO modules are meant to provide a better alternative to `import` statements.

The problem with import statements is they tightly couple your code to a specific package. So if a package is
deprecated or needs to be swapped out for some reason you need to hunt down every reference to it
and update then possibly requiring more code changes if the new interface does not match the old interface.

Using BMO modules and the [dependency injector](/packages/injector/) you can loosely couple your
application modules allowing you to make quick easy updates.
if when updating a package the interface does change the module provides a layer of indirection
that you can use to make the modules compatible.

A BMO module is a simple es6 module that exports a default function. The function will be passed a manifest
and you declare your dependencies by destructuring them from the manifest.dependencies object.

```
export default ({ config, dependencies:{ myDependency } })=>{}

```

The injector will parse the abstract syntax tree of your module, and create any dependencies required for your module before instantiating the current module.
It will also walk your dependencies dependency tree instantiating other require modules ensuring all modules
are available.

Your module can return anything and the result will be passed to other modules that have the dependency declared in their manifest.

Here is an example of how the module system works. Given a set of dependencies that looks like this:
```
{
  http:()=> axios,
  services:{
    things:({ config, dependencies:{ http } }) => ({
       get:(params) => http.get(config.services.things,params)
      })
  },
  repositories:{
    things:({ dependencies:{ services:{ things } } }) => ({
      list:() => things.get()
    })
  }
}

```

After this has been run through the dependency injector the resulting tree will look like this:

```
{
  http,
  services:{
    things:{
      get
    }
  },
  repositories:{
    things:{
      list
    }
  }
}
```


Another benefit to this style of declaring dependencies also makes unit testing a breeze. You can simply provide mock
values for your dependencies and unit test with your favorite framework. Though once your get beyond trivial modules like the one above it may
become cumbersome to mock everything out manually. For this we have provided a mocking framework that will allow you to target just the dependencies
that require mocking you can check out the [docs](/packages/mocker/) or the [testing recipe](/recipes/testing/) for more information.

# Sharing modules

Modules can be shared across projects and services by publishing them to the npm registry. When doing this
be sure to populate to set add the following to the package's package.json:

```
"bmo":{"module":true}

```

This will ensure that the module is compatible with the `bmo add` command and the [module loader](/packages/moduleLoader/)

