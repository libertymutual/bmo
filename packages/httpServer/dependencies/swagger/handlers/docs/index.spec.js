import http from '../../../http'
import docsHandler from '.'

const definition = { foo: 'bar' }
const httpModule = http()
describe('swagger > handlers > docs', () => {
  it('Should set the body and status to the expected values', () => {
    const mod = docsHandler({
      dependencies: {
        swagger: { definition },
        http: httpModule
      }
    })
    let ctx = {}
    mod(ctx)
    expect(ctx).toEqual({
      body: definition,
      status: httpModule.status.OK
    })
  })
})
