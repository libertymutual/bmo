export default ({
  config: {
    swagger: {
      urls, redoc
    }
  },
  dependencies: {
    routes = [],
    swagger: {
      handlers: {
        redoc: redocHandler,
        ui: uiHandler,
        docs: docsHandler
      }
    },
    http: {
      methods: {
        GET
      }
    }
  }
}) => {
  const docsRoute = {
    path: urls.docs,
    method: GET,
    handler: docsHandler
  }

  const uiRoute = {
    path: urls.ui,
    method: GET,
    handler: uiHandler
  }

  const redocRoute = {
    path: `${redoc.route}/:version`,
    method: GET,
    handler: redocHandler
  }

  routes.push(docsRoute, uiRoute, redocRoute)
}
