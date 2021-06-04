# CHANGELOG

v0.7.0
- [CHORE] update dependencies. Align version numbers.
- [FIX] Bug where a dependency with the same name as a built in module would not be loaded.

v0.6.1
- [ADD] Ensure the bmo modules are run through the normal DI process.

v0.6.0
- [ADD] Package dependencies and node built-in modules are now added by the dependency injector automatically

v0.5.1
- [FIX] Return the context for building after inherit is called.
- [FIX] Issue where the expose function would not hide keys.

v0.5.0
- [UPDATE] Change package name

v0.2.2
- [CHANGE] context module to throw an error if a dependency key doesn't exist
