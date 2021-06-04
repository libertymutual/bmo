# @b-mo/cli

BMO CLI is an  extensible command line interface for improving your work flow.
Using its extensions you can easily startup a BMO http server, or even generate new projects and components.

## Setup

install the bmo cli with your package manager of choice:

`npm install -g @b-mo/cli`

`yarn global add @b-mo/cli`

This will make the `bmo` command available in your terminal. From there you can use any commands you need.
When using bmo in a npm module it is suggested that you install it locally to that project so you do not need
any globally installed dependencies. Its more convenient to use the global `bmo` command to generate
new resources and dependencies,

## Commands

### Start **[DEPRECATED]**

Use `bmo run` instead.

`bmo start`

|Option          | Description                                              |
|----------------|----------------------------------------------------------|
|-d              | Start the server in dev mode, changes restart the server |
|-s <dir>        | Add a directory to be served as static assets            |
|-c <dir>        | Set the base directory where BMO looks for the config    |
|--baseDir <dir> | Set the base directory for BMO's entry point.            |

This command starts up a bmo http server in the current directory.

### Create

`bmo create <template> <name>`

This command runs the given template

Some templates are included but more can be added by using extensions

|Option          | Description                                              |
|----------------|----------------------------------------------------------|
|service         | Creates a BMO http server project                        |
|resource        | Creates a restful resource with the given name           |
|dependency      | Creates a new dependency for BMO dependency injection    |

### Add

`bmo add <pkg@version> [as <alias>]`

This will add the given package as a dependency and include it in your manifest automatically.


|Option          | Description                                              |
|----------------|----------------------------------------------------------|
|as <alias>      | When injected into the manifest it will use this instead |
|                | of the module name.                                      |


## Extensions

BMO cli allows users to extend its functionality through extensions.
During startup BMO will search your global node_modules, and if using yarn global modules/links for
any packages with bmo-extension in it. If found it will attempt to load the extension into the cli.
Currently the CLI supports two types of extensions.
`commands` and `templates`

### Extension commands

BMO uses [commander](https://github.com/tj/commander.js/) to implement it's cli.
When creating an command extension you can define it one of two ways. As either an action or an external file.

A basic extension looks like this. Your module should export something like:

```
import path from 'path'
export default {
  commands: {
    myCommand:{
      format: 'myCommand [params]',
      description: 'my command that does some stuff'
      action: (params)=>{}
    },
    myOtherCommand:{
      format: 'myOtherCommand [params]',
      description: 'my command that does some stuff'
      file: path.resolve(__dirname,'./myCommand')
    }
  }
};
```

If any conflicts between modules are found, then you just need to append a namespace to the command: `myModule.myCommand`


### Extension templates

During development you may find that you have to write the same boilerplate code over and over again.
BMO provides you the ability to create new templates and add them to the `create` commands arsenal.
You can add new templates to the create command by exporting something like the example below from your module.

```
import path from 'path'
export default {
  templates: {
    customTemplate: async () => ({
      questions: [//array of [inquirer](https://github.com/SBoudrias/Inquirer.js/) questions],
      preProcess:({files, answers})=>{
        //process files and answers
        //return modified files/answers
        return {files, answers}
      },
      postProcess:async ({files,answers})=>{
        // do any clean up or post create actions like install new dependencies
      },
      files: {
        //These are files that will be generated.
        foo: (answers)=>`some file content`,
        bar: (answers)=>`some file content`
      }
    })
  }
};
```
After installing your extension somewhere where BMO can find it you can use `bmo create customTemplate`
to invoke the newly created template.



