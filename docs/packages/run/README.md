# @b-mo/extension-run

This is an extension for the bmo cli, its purpose it to provide a simple interface to run your project as dependency bundle.


You can install it either as a global dependency, or in your local project:

`npm install @b-mo/extension-run`

This will allow you to use `bmo run` to start your application bundle.

Your bundle must include a 'run' function at the root of the graph. The extension will load the bundle
using the bundle package, and attempt to invoke the run function. Thats it!

Supported flags:

|Flag      | Description                                                                         |
|----------|-------------------------------------------------------------------------------------|
|-d  --dev | Runs your application in a dev loop, changes will cause the application to restart. |
