import http from '../../http'
import routes from '.'

const docsPath = '/api/docs'
const uiPath = '/docs'
const redocRoute = '/redoc'

const manifest = () => ({
  config: {
    swagger: {
      urls: {
        docs: docsPath,
        ui: uiPath
      },
      redoc: {
        route: redocRoute
      }
    }
  },
  dependencies: {
    routes: [],
    swagger: {
      handlers: {
        redoc: () => {},
        ui: () => {},
        docs: () => {}
      }
    },
    http: http()
  }
})
describe('swagger', () => {
  it('Should inject a route with the api docs path', () => {
    const m = manifest()
    routes(m)
    expect(m.dependencies.routes.some(r => r.path === docsPath)).toBeTruthy()
  })
  it('Should inject a route with the docs ui path', () => {
    const m = manifest()
    routes(m)
    expect(m.dependencies.routes.some(r => r.path === uiPath)).toBeTruthy()
  })
  it('Should inject a route with the redoc path', () => {
    const m = manifest()
    routes(m)
    expect(m.dependencies.routes.some(r => r.path.match(redocRoute))).toBeTruthy()
  })
})
