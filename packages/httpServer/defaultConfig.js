import os from 'os'
import ip from 'ip'
import path from 'path'
export default {
  di: {
    namespace: 'dependencies'
  },
  pino: {
    redact: [ 'req.headers.authorization' ]
  },
  server: {
    port: process.env.PORT || 3000,
    ip: ip.address(),
    hostname: os.hostname(),
    staticFiles: []
  },
  swagger: {
    urls: {
      docs: '/api/docs',
      ui: '/docs',
      redoc: '/redoc/redoc.standalone.js'
    },
    redoc: {
      route: '/redoc',
      baseDir: path.dirname(require.resolve('redoc'))
    }
  },
  events: {
    shutdown: 'app.shutdown'
  },
  eureka: {
    enabled: true,
    loggerLevel: 'debug'
  }
}
