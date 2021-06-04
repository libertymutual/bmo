import joi from 'joi'
import loadRoute from '.'
class MockRouter {}
MockRouter.prototype.get = jest.fn()
MockRouter.prototype.use = jest.fn()
const schema = joi
  .object()
  .keys({
    name: joi.string().alphanum().required()
  })
const mockRoute = () => ({
  path: '/api/test/v1',
  method: 'get',
  handler: () => {}
})
const mockValidator = jest.fn()
const mockMw = jest.fn()
describe('Load route', () => {
  describe('Load single handler', () => {
    it('Should load the route', () => {
      const r = mockRoute()
      const router = loadRoute(r, mockValidator, MockRouter)
      expect(router.get).toHaveBeenCalledWith(r.path, r.handler)
    })
    it('Should create a request validator if the schema is populated', () => {
      const r = mockRoute()
      r.schema = {
        requestBody: schema
      }
      loadRoute(r, mockValidator, MockRouter)
      expect(mockValidator).toHaveBeenCalledWith(schema)
    })
    it('Should use request validator if the schema is populated', () => {
      const r = mockRoute()
      r.schema = {
        requestBody: schema
      }
      const validatorMw = jest.fn()
      mockValidator.mockImplementation(() => validatorMw)
      const router = loadRoute(r, mockValidator, MockRouter)
      expect(router.use).toHaveBeenCalledWith(validatorMw)
    })
  })
  describe('Middleware with the handler', () => {
    it('Should create a request validator if the schema is populated', () => {
      const r = mockRoute()
      r.schema = {
        requestBody: schema
      }
      r.handler = [ mockMw, r.handler ]
      loadRoute(r, mockValidator, MockRouter)
      expect(mockValidator).toHaveBeenCalledWith(schema)
    })
    it('Should use request validator if the schema is populated', () => {
      const r = mockRoute()
      r.schema = {
        requestBody: schema
      }
      r.handler = [ mockMw, r.handler ]
      const validatorMw = jest.fn()
      mockValidator.mockImplementation(() => validatorMw)
      const router = loadRoute(r, mockValidator, MockRouter)
      expect(router.use).toHaveBeenCalledWith(validatorMw)
    })
    it('Should load the route', () => {
      const r = mockRoute()
      r.handler = [ mockMw, r.handler ]
      const router = loadRoute(r, mockValidator, MockRouter)
      expect(router.get).toHaveBeenCalledWith(r.path, r.handler[1])
    })
    it('Should use the middleware', () => {
      const r = mockRoute()
      r.handler = [ mockMw, r.handler ]
      const router = loadRoute(r, mockValidator, MockRouter)
      expect(router.use).toHaveBeenCalledWith(r.path, mockMw)
    })
  })
})
