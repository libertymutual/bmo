export default ({
  config,
  dependencies: {
    routes = [],
    swagger: {
      createSwaggerDefinition
    }
  }
}) => {
  const { description, version, name: title, author: contact } = config.pkg
  return createSwaggerDefinition([ ...routes ], { title, description, contact, version })
}

