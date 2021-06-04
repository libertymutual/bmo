# Testing

It is recommended that you have some understanding of the BMO module structure before reading this.
Checkout the [modules](/recipes/modules/) documentation if you have not already done so.

One of the key benefits of using dependency injection is enhancing the testability of your codebase, but
sometimes setting up the tests can become cumbersome and overly verbose, especially if your module
has more than a few dependencies, and you only need to mock one or two of the modules. For this we have provided a
mocker framework that works with the existing project structure to allow you to specifically target
modules for mocking.

Lets take a look at how to use it.

First install the mocking framework

```sh
npm install -d @b-mo/mocker
```

From here you can use the mocker with your testing framework of choice.

Lets say we have the following module:

```js
// repositories/thing.js
export default ({ dependencies:{ dbConnection, thingFactory } }) =>({
  list:async (params) => {
    const docs = dbConnection.query(params);
    return docs.map(thingFactory)
  }
})
```
In our spec file we want to test that our list function returns a list of properly mapped things.
We want to mock the dbConnection but import the thingFactory dependency we are using in our project the mocker helps us
accomplish this easily.

```js
//repositories/thing.spec.js
import mocker from '@b-mo/mocker'
import module from 'thing'
let repository;
beforeEach(() => {
  const container = mocker()
  .extend('@b-mo/http-server') // pulls in the dependencies and configuration provided by the http server
  .mock('dbConnection',()=>[{
    foo:'bar',
    secret:'field'
  }])
  repository = await container.build(mod)
})

it('Should return a thing with no secret fields', async () => {
  const expected = [{ foo:'bar' }]
  const result = await repository.list()
  expect(repository.list()).toEqual(expected)
})
```

This is just an example but the mocker provides an interface to modify your DI context for all your testing needs!
Read the full documentation for the mocker [here](/packages/mocker/)
