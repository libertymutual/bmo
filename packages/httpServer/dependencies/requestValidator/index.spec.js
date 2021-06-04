import joi from 'joi'
import validator from '.'

const schema = joi
  .object()
  .keys({
    name: joi.string().alphanum().required()
  })

describe('Request validator', () => {
  it('Should error when the request body does not match the schema', () => {
    const testValidator = validator()(schema)
    const ctx = { request: { body: { notName: 'test' }}}
    try {
      testValidator(ctx, () => {})
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
  it('Should error when the schema cannot be validated', () => {
    try {
      validator()({})
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
  it('Should call next when the body is valid', () => {
    const testValidator = validator()(schema)
    const next = jest.fn()
    testValidator({ request: { body: { name: 'test' }}}, next)
    expect(next).toHaveBeenCalled()
  })
})
