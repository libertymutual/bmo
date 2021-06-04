import { has, each, set, get } from 'lodash'
import joi2Swagger from 'joi-to-swagger'
import httpStatus from 'http-status-codes'

const PATH_DELIMITER = '/'
const PARAM_DELIMITER = ':'
const SCHEMA_TYPES = {
  QUERY_PARAMS: 'queryParams',
  RESPONSE_BODY: 'responseBody',
  REQUEST_BODY: 'requestBody'
}
const { REQUEST_BODY, RESPONSE_BODY, QUERY_PARAMS } = SCHEMA_TYPES
const {
  OK,
  CREATED,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  NO_CONTENT,
  ACCEPTED
} = httpStatus

const OPEN_API_VERSION = '3.0.0'
export default () => (routes, { title, description, contact, version }) => {
  const components = getComponents(routes, '', {})
  const paths = getPaths(routes, components)
  return {
    openapi: OPEN_API_VERSION,
    info: {
      title,
      description,
      contact,
      version
    },
    paths,
    components
  }
}

const simplePathParam = name => ({
  name,
  in: 'path',
  description: `${name} path param`,
  required: true,
  style: 'simple',
  schema: {
    type: 'string'
  }
})

const getPathParams = path => {
  const params = []
  const parts = path.split(PATH_DELIMITER)
  parts.forEach(part => {
    if (part[0] === PARAM_DELIMITER) {
      params.push(part.substring(1))
    }
  })
  return params.map(simplePathParam)
}

const formatPathParams = path => {
  return path
    .split(PATH_DELIMITER)
    .map(part => part[0] === PARAM_DELIMITER ? `{${part.substring(1)}}` : part)
    .join(PATH_DELIMITER)
}

const simpleQueryParam = name => ({
  name,
  in: 'query',
  description: `${name} query param`,
  required: false,
  style: 'simple',
  schema: {
    type: 'string'
  }
})

const getQueryParams = route => {
  const params = []
  if (has(route.schema, QUERY_PARAMS)) {
    const queryParams = Object.keys(route.schema[QUERY_PARAMS].describe().keys)
    queryParams.forEach(paramName => params.push(simpleQueryParam(paramName)))
  }

  return params
}

const jsonSchema = (schema, description) => ({
  description,
  content: {
    'application/json': {
      schema: {
        $ref: `#/components/schemas/${schema}`
      }
    }
  }
})

const requestBody = schema => `${schema}-${REQUEST_BODY}`

const responseBody = schema => `${schema}-${RESPONSE_BODY}`
const statusDescriptions = {
  [OK]: 'OK',
  [CREATED]: 'Created',
  [ACCEPTED]: 'Accepted',
  [NO_CONTENT]: 'No Content'
}
const DEFAULT_RESPONSES = {
  [BAD_REQUEST]: jsonSchema(`${responseBody('error')}`, 'Bad Request'),
  [UNAUTHORIZED]: jsonSchema(`${responseBody('error')}`, 'Unauthorized'),
  [INTERNAL_SERVER_ERROR]: jsonSchema(`${responseBody('error')}`, 'Internal Server Error')
}

const defaultHttpResponse = (schemaName, successStatusCode) => ({
  [successStatusCode]: jsonSchema(`${responseBody(schemaName)}`, statusDescriptions[successStatusCode]),
  ...DEFAULT_RESPONSES
})
const successStatus = 'successStatus'
const formatters = {
  delete: (schemaName, route = {}) => ({
    responses: {
      ...defaultHttpResponse(schemaName, get(route, successStatus, OK))
    }
  }),
  get: (schemaName, route) => ({
    responses: {
      ...defaultHttpResponse(schemaName, get(route, successStatus, OK))
    }
  }),
  put: (schemaName, route) => ({
    requestBody: jsonSchema(`${requestBody(schemaName)}`),
    responses: {
      ...defaultHttpResponse(schemaName, get(route, successStatus, OK))
    }
  }),
  patch: (schemaName, route) => ({
    requestBody: jsonSchema(`${requestBody(schemaName)}`),
    responses: {
      ...defaultHttpResponse(schemaName, get(route, successStatus, OK))
    }
  }),
  post: (schemaName, route) => ({
    requestBody: jsonSchema(`${requestBody(schemaName)}`),
    responses: {
      ...defaultHttpResponse(schemaName, get(route, successStatus, CREATED))
    }
  })
}

const formatRequestParams = (schemaName, httpMethod, route) => {
  if (formatters[httpMethod]) {
    return formatters[httpMethod](schemaName, route)
  }
}

const getPathDefinition = route => {
  const { path } = route
  const pathParams = getPathParams(path)
  const queryParams = getQueryParams(route)
  const parameters = pathParams.concat(queryParams)
  const formattedPath = formatPathParams(path)
  const schemaName = getComponentName(route)
  const method = route.method.toLowerCase()
  let schemaDef = {}
  if (route.schema) {
    schemaDef = formatRequestParams(schemaName, method, route)
  }

  return {
    key: `${formattedPath}.${method}`,
    value: {
      summary: `${schemaName}`,
      description: route.description,
      parameters,
      ...schemaDef
    }
  }
}

const getPaths = (routes, components) => {
  const paths = {}
  routes.forEach(route => {
    routes[route.path] = routes[route.path] || {}
    const definition = getPathDefinition(route, route.path, components)
    set(paths,
      definition.key,
      definition.value)
  })
  return paths
}

const getComponentName = route => {
  return route.name ? route.name : `${route.method}-${route.path.replace(/\//gi, '-')}`
}

const getComponents = (routes, parentPath, aggregate = {}) => {
  each(routes, route => {
    if (route.schema) {
      const componentName = getComponentName(route)
      each(route.schema, (schema, type) => {
        const { swagger } = joi2Swagger(schema, aggregate)
        set(aggregate, `schemas.${componentName}-${type}`, swagger)
      })
    }
  })
  return aggregate
}
