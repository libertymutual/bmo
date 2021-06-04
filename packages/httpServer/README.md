# @b-mo/http-server

BMO HTTP SERVER is a server side framework, focused at enabling developers to quickly implement high quality Restful services,
but it can be used to implement any kind of http server.
Aims to reduce boiler plate code by bundling common http server functionality as a bundle of dependencies
that can be extended with your own functionality.

## Setting up your project

To get started using this dependency bundle:

- ensure that you have node.js >= 10.16 installed.

- create an empty directory for your application and initialize your package using `npm init`

- Once you have completed the prompts use your favorite package manager to install the bmo cli and the run extension.

```sh
yarn add @b-mo/cli @b-mo/extension-run
```

```sh
npm install @b-mo/cli @b-mo/extension-run
```

after that lets add some scripts and config values to the package.json:

```json
{
  "scripts":{
    "start":"bmo run",
    "dev":"bmo run -d"
  },
  //...
  "bmo":{
    "extends":["@b-mo/http-server"]
  }
}
```
Then in either the root index.js, or the 'main' file in the package.json file we will create the default export for our projects dependencies:
```
export default { dependencies:{} }
```


and thats it! Now when you do npm start/dev the cli will add all the http server dependencies to your
available dependencies. From here all you need to do is add a 'routes' dependency and the framework will mount
the declared routes to the http server's router.

## Adding Routes
For routes to be added all you need to do is have a dependency called routes defined in your project's manifest.
too add it as a dependency simply add the module to your root dependencies export.

```
import routes from './routes'
export default { dependencies:{routes} }
```

### Defining routes
Your route dependency can be defined one of two ways:

An array of modules OR a module that returns an array of routes.

Array of modules:
```
import fooRoute from './fooRoute'
export default [fooRoute]
```

Module that returns an array:
```
import route from './route'
export default () => [route]
```

The difference between the two is how the dependency injector resolves the modules.

In the second case where you have 1 module that returns an array, the dependency injector will NOT
run on each of the routes, it will only run on the top most module.
You will either have to manually pass dependencies down to the routes or forgo dependency injection
on your route definitions and handlers.

Defining your routes as an array of modules lets the dependency injector run the injection process on each route module.

All examples below assume that you are using the array of modules approach.

### Example route module:

Below is an example route module that returns a route object:

```
// fooRoute.js
export default async ({config, dependencies}) => ({
  path:'api/things/v1/',
  method:'post',
  schema:{
    requestBody,
    responseBody
  },
  handler:async(ctx,next)=>{}
})
```
- `path` - indicates what the path to the handers should be.
- `method` - is the http method that the handler is for.
- `schema`- an optional schema takes in two sub objects, these objects should be [joi](https://www.npmjs.com/package/@hapi/joi) schemas that are then used to
generate OpenAPI documentation for the resources. These are optional and will be ignored if not supplied.
-- if request body is supplied then incoming requests will be validated against the schema.
- `handler`- Is an async function that is invoked when a request is received with the given path and method.

### Adding Custom Middleware

In some cases you may want to add middleware to your http routing. You can add middleware at both the route
and the application level.

To do this at the application level you add a key to your dependencies called middleware, and
add your module to an array under it.

```
// dependencies.js
import fooMiddleware from './fooMiddleware'
export default {
  middleware:[
    fooMiddleware
  ]
}

```

```
// fooMiddlware.js
export default async ({config, dependencies})=>(ctx,next)=>{}
```

To add middleware at the route level create a module and add it to your dependencies as normal

Then in your route handler instead of a function use an array with your handler as the last entry in the router:

```
export default async ({config, dependencies:{ fooMiddleware } }) => ({
  path:'api/things/v1/',
  method:'post',
  schema:{
    requestBody,
    responseBody
  },
  handler:[fooMiddlware, async(ctx,next)=>{}]
})
```

### Error Handling

The framework includes an error handeling middleware. All of the handlers are wrapped so you can
throw errors from your handler and the framework will log and send the message back to the user.
If you have a custom status mapped for the error type the response will have the status, otherwise it defaults to 500.

Below is an example of how to use the errors, errorMap and built in error handling

```
//customErrors.js

export default ({ dependencies:{ errorMap, errors:{ ExtendableError } } })=>{
  class CustomError extends ExtendableError
  errorMap.addError(CustomError, 420)
}
//SomeRoute
export default async ({ config, dependencies:{ errors:CustomError } }) => ({
  path:'api/things/v1/',
  method:'post',
  schema:{
    requestBody,
    responseBody
  },
  handler:async(ctx,next)=>{
    throw new CustomError('Custom Error')
    }
})
// The http status of the call would be 420 and the message would be custom error
```


### Built-in modules

By default bmo ships with some built-in modules.

#### errorMap

The error map module is useful for mapping error types to http status codes.
The error map controls which status is returned when a handler throws a specific type of error.

#### errors

This module houses errors used by the framework. It exposes an ExtendableError for use in your custom errors

#### events

This is a shared instance of an event emitter. You can use it like any other event emitter.
The following is an example of a module that listens for the shutdown event.
It is recommended that you keep your event names in the config to avoid typos!

```
//dbShutdown.js
export default ({ config:{ events:{ shutdown } }, dependencies:{ events, db }) => {
  events.on(shutdown,()=>db.pool.close())
}

```

the Shutdown config value is provided as a default config value.

#### gracefulShutdown

This module pairs with the events module. It broadcasts the shutdown event when the process is about to exit.

#### health

This module implements a health check for the application at /health.

#### logger

This is a simple string logging module. It provides an info(msg) warn(msg) and error(msg) with some color.

#### middleware

Some middleware is included by default.
- [Body parsing](https://github.com/koajs/bodyparser)
- [request logging](https://github.com/pinojs/koa-pino-logger)
- [helmet](https://www.npmjs.com/package/koa-helmet)
and a top level error handling middleware are all provided by default.

#### requestValidator

This is used internally by the framework to validate your incoming requests if a requestBody schema is provided

#### serveStatic

This middleware can be used to create other middleware to serve your static files.
```
//customStaticFiles.js
export default ({config:{staticFolder}, dependencies:{serveStatic}})=>serveStatic(staticFolder)

//dependencies.js
import customStaticFiles from './'
export default {
  middleware:[customStaticFiles]
}
```

Additionally any entries in `config.server.staticFiles` will be mounted for serving.

#### swagger

This module creates routes for your app to have open api documentation. This is all based off of the schemas
that you pass to your route handlers.

Path parameters will be calculated from the path field in your route object.
```
path:'api/things/v1/:id', //parameter is id
```

Query parameters are calculated from the Joi schema assigned to `schema.queryParams` in the route object
```
schema:{
  queryParams: joiSchema
},
```

Request/response samples are calculated from the Joi schema assigned to `schema.responseBody` and `schema.requestBody`
in the route object
```
schema:{
  requestBody: joiSchema //ignored for GET methods
  responseBody: joiSchema
},
```
