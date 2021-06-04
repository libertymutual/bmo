import http from '../../../http'
import path from 'path'
import docsHandler from '.'

const definition = { foo: 'bar' }
const httpModule = http()
describe('swagger > handlers > redoc', () => {
  let readStream
  let set
  let mod
  let ctx
  let exists
  let version = 'some.version.js'
  const redocBaseDir = 'path/to/redoc/dir'
  const createModule = () => docsHandler({
    config: {
      swagger: {
        redoc: {
          baseDir: redocBaseDir
        }
      }
    },
    dependencies: {
      swagger: { definition },
      http: httpModule,
      path,
      fs: {
        existsSync: exists,
        createReadStream: () => readStream
      }
    }
  })

  const setup = () => {
    readStream = {}
    set = jest.fn()
    exists = jest.fn(() => true)
    mod = createModule()
    ctx = { set, params: { version }}
  }

  describe('File exists', async () => {
    beforeEach(async () => {
      setup()
      await mod(ctx)
    })
    it('Should set the read stream and status if the file exists', async () => {
      expect(ctx).toEqual(expect.objectContaining({
        body: readStream,
        status: httpModule.status.OK
      }))
    })
    it('Should set content type', async () => {
      expect(set).toHaveBeenCalledWith('Content-Type', 'text/javascript;charset=UTF-8')
    })
    it('Should use the version param to look for the file', async () => {
      expect(exists).toHaveBeenCalledWith(`${redocBaseDir}/${version}`)
    })
  })

  describe('File does not exist', () => {
    it('Should return a not found status', async () => {
      setup()
      exists.mockImplementation(() => false)
      await mod(ctx)
      expect(ctx).toEqual(expect.objectContaining({
        body: 'NOT_FOUND',
        status: httpModule.status.NOT_FOUND
      }))
    })
  })
})
