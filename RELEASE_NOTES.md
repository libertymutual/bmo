# RELEASE NOTES

## v0.7.0

### Updates

All packages have been updated to the latest versions. Mostly transparent changes that should not affect end users. Highlights include

#### Http server:
- Helmet Updated to latest version, there may be some breaking config changes based on application: You can view their change log here: https://github.com/helmetjs/helmet/blob/main/CHANGELOG.md
- Fixed issue where the status code was being logged before being set.

#### Injector:
- Espree has been updated so newer es6 syntax should be working now.

#### Other notable changes:
- Joi has been changed in multiple places to 'joi' instead of '@hapi/joi'
- Commander has been updated to the latest version. Some option handling has changed.

### New features:

#### Injector:
- @b-mo/injector has been updated and now allows you to pull built in nodejs modules off of the dependencies without explicitly including them in your dependency bundle.

#### Run Extension:
- @b-mo/extension-run allows users to 'run' their package by defining a 'run' dependency in their application. This acts as an entry point for your application.

#### Bundle:
- @b-mo/bundle encapsulates the module resolution and loading logic. So you can use it in other places outside of the 'run' extension.
-  Extendable dependency loading, your package can declare that it 'extends' another package of dependencies, and the bundler will resolve and load the full dependency context.
- The resolver uses a merge strategy on the dependencies so that your can override modules by declaring one of your own with the same name and interface.

### Breaking Changes
- `bmo start` has now been fully deprecated. You can install and use @b-mo/extension-run and use the 'run' command instead. You will have to follow the directions below to update your
project format to continue working.

#### Breaking application format changes:
##### Route Loading
- Routes are no longer loaded from the root of the project. It is treated just like any other dependency.
- To update just explicitly include the routes as a dependency in your application.

##### HTTP server harness
- The new run command does not assume you want to start an http server. It just loads and resolves a dependency bundle in the working directory.
- First install @b-mo/http-server into your project's dependencies.
- Then you will need to declare that your application extends the bmo http server dependency context. You can do this by adding the following to your package.json

```
{
  "bmo":{
    "extends":"@b-mo/http-server"
  }
}
```
The extends field takes a package name as a string, or an array of strings each with a package name.

### Known Issues

- The http server has two modules that conflict with built in modules. The injector logs a warning, it can be safely ignored.



