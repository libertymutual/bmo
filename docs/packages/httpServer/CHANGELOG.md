# CHANGELOG

v0.7.1
- [Update] Redoc is entirely served from within the framework now. This should resolve any content policy issues with helmet.

v0.7.0
- [CHORE] update dependencies. Align version numbers.
- [FIX] Issue where status code would be logged as 404 before being set by the error handler.

v0.6.0-beta.2
- [CHANGE] Add responses to delete method in swagger definition creation to generate valid OpenAPI specs.

v0.6.0-beta.1
- [CHANGE] Update package to support new composable bmo module pattern
- [REMOVE] app.js in favor of new bundle running paradigm.

v0.5.2
- [Fix] bodyparser should be a part of the server configuration.

v0.5.1
- [Change] Allow configuration of the body parser middleware.

v0.5.0
- [CHANGE] Update version

v0.4.3
- [CHANGE] Add serializers dependency using pino default serializers

v0.4.2
- [CHANGE] Add `healthy` value to `/health` endpoint

v0.4.1
- [ADD] Export for dependencies so it can be used with the mocker
- [CHANGE] Use new bmo module loader

v0.4.0
- [ADD] Http to default dependencies
- [ADD] Joi to default dependencies
- [UPDATE] joi, joi-to-swagger and other dependencies
- [BREAKING CHANGES] Applications will have to update their schemas to use the supplied joi dependency
