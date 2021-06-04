# Hello World


## Setup
This guide will teach you the basics of running an application in the bmo framework.

To get started ensure that you have node.js >= 10.16 installed.

From here create an empty directory for your application and initialize your package using `npm init`

Once you have completed the prompts use your favorite package manager to install the bmo cli and the run extension.

```sh
yarn add @b-mo/cli @b-mo/extension-run
```

```sh
npm install @b-mo/cli @b-mo/extension-run
```

After that, lets add a script to run our application in the scripts section of the package.json add:

```json
{
  "scripts":{
    "start":"bmo run"
  }
}
```

## Running

Now when we run `npm run start` or `yarn start` our application will be invoked through the bmo cli.

Now if we were try and start our application we would see a the following error:

```sh
(node:45409) UnhandledPromiseRejectionWarning:
Error: Module must either have a main file, index.js file or a dependencies/index.js file.
No matching paths in <your project>
```

All this means is that the cli could not find your dependency bundle.

Before we go further lets learn a bit more about bmo's module system and dependency injection.

### Modules

It all starts with a dependency bundle. It is essentially an object where all of the leaf values are module functions IE:

```js
{
  fooModule:()=>({}),
  bar:{
    bazModule:()=>({})
  }
}
```

During the startup process each module function is walked and its `dependencies` are inspected, and after
ensuring that all the dependencies are available (by running the same algorithm) the module function will be called with the 'manifest'.
The resulting value will be available for other modules in the manifest to consume.

The manifest has a structure like so:

```js
{
  config:{},
  dependencies:{}
}
```

The config object is the resolved object from your config folder, as well as any additional configurations supplied by other modules.

The dependencies object's structure will match your dependency bundle's structure with the difference being,
where there used to be module functions, there will now be the values returned by those functions.

Lets see what this looks like in action:

To get started we need to expose our dependencies so the cli can find our dependency bundle.

A package can expose it's dependencies for the cli one of 3 ways:

-> Either the 'main' file or 'index.js' file in the root of the package should exist and export an object with the shape:

```js
export default {
  dependencies:{
    //...your module functions
  }
}
```

->The `dependencies/index.js` file exports an object with all of your application modules.

```js
export default {
  //...your module functions
}
```

** the bmo cli will automatically run your code using `esm` so you should not need any extra setup to use ES6 modules even if you
are using older versions of node **

## Adding dependencies

For this tutorial we will just create an index.js file and export the dependencies, with one
 basic module:

```js
export default {
  dependencies:{
    helloWorld:()=>console.log('hello world')
  }
}
```

Now if we run the application we will see this:

```sh
hello world
(node:46524) UnhandledPromiseRejectionWarning: Error: No run dependency found. Please add one to your bundle!
```

This is because our console.log() happens during the module creation step, it does not happen when we 'run' our application.
In addition to that we also get an error about a missing dependency called run.

This is because the run extension works by looking at your manifest for a 'run' function and invoking it.

We can do that simply by adding a run function to our dependencies, and lets fix our hello world log while we are at it.

Notice how the module functions RETURN a function


```js
{
  dependencies:{
    helloWorld: ()=> ()=> console.log('hello world'),
    run: ()=> ()=> {
      console.log('Running....')
    }
  }
}

```

Now when we run this we will see:

```sh
Running....
```


In the terminal, but no hello world. This is because we have yet to invoke the helloWorld dependency.

## Using dependencies

To do this we just need to declare the hello world module as a dependency of the run module. We do this simply
by destructuring the value off of the manifest passed to the module function like so:

```js
{
  dependencies:{
    helloWorld: ()=> ()=> console.log('hello world'),
    run: ({
      dependencies:{
        helloWorld
      }
    }) => ()=> {
      console.log('Running....')
      helloWorld()
    }
  }
}
```

And now we should see both of our log messages!


## Next steps

This example is trivial, but there are many advantages to using this pattern.
Unit testing becomes a breeze since we have constructor level injection on our modules.

Pair it with our [mocker framework](/packages/mocker/) and getting 100% unit test coverage has never been easier.

You can easily swap out or compose functionality together at runtime:

```js
{
  config:{
    isProd: process.NODE_ENV === 'production'
  },
  dependencies: {
    logger: ({
      config:{
        isProd
      }
    })  => isProd ? () => {} : console.log,
    helloWorld: ({ dependencies:{ logger } })=> ()=> logger('hello world'),
    run: ({
      dependencies:{
        logger,
        helloWorld
      }
    }) => ()=> {
      logger('Running....')
      helloWorld()
    }
  }
}
```

In addition to that module functions may also return promises or be async functions.
The framework will wait for those dependencies to resolve before continuing,
but be aware many async functions will delay application startup, especially since module instantiation is a serial process.
