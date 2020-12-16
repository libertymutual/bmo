# @b-mo/mongodb


This module wraps the [mongodb]() module into a bmo module. It provides several dependencies out of the box.

## installation

Install the module with your package manager of choice

`npm install @b-mo/mongodb`

then include the dependency in your project's dependencies.

```
//dependencies.js
import bmoMongodb from '@b-mo/mongodb'
export default {
  // other dependencies
  bmoMongodb
}
```
this package will provide the following public modules:
  - db
  - collections
  - mongodb

access the modules in your other dependencies
```
({ bmoMongodb:{ db, collections, mongodb } })
```
## mongodb
This is a module that provides an interface with mongo databases [mongodb](https://github.com/mongodb/node-mongodb-native/).

## db
This module instantiates/connects to all of the databases.
It depends on the gracefulShutdown, events, logger, and mongodb modules.
It expects the following config values:
```
config: {
  mongodb: {
		user,
		password,
		url,
		databases: {
			<database-name>: {
				<collection-name>: '<collection-name>'
			}
		}
  },
```

### collections

This module uses the db module to setup each database's collections to be defined and associates them to their respective database.

```
 export default ({ dependencies:{ bmoMongodb: { collections } } })=> {
	const collection = collections[<dbName>][<collectionName>]
	return {
			getUsers(){
				const data = collection.find({});
				return data;
			}
		}
 }
```
