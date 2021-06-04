import http from '../../../http'
import uiHandler from '.'

const httpModule = http()
describe('swagger > handlers > ui', () => {
  let urls
  let result
  let ui
  let mod
  let ctx
  const setup = () => {
    urls = {
      foo: 'bar'
    }
    result = {}
    ui = jest.fn(() => result)
    mod = uiHandler({
      config: {
        swagger: {
          urls
        }
      },
      dependencies: {
        swagger: { ui },
        http: httpModule
      }
    })
    ctx = {}
  }

  beforeEach(() => {
    setup()
    mod(ctx)
  })
  it('Should set the body and status to the expected values', () => {
    expect(ctx).toEqual({
      body: result,
      status: httpModule.status.OK
    })
  })
  it('Should call the ui function with the swagger urls', () => {
    expect(ctx).toEqual({
      body: result,
      status: httpModule.status.OK
    })
  })
})
