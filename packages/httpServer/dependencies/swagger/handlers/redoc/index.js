export default ({
  config: {
    swagger: {
      redoc: {
        baseDir: redocBaseDir
      }
    }
  },
  dependencies: {
    fs,
    http: {
      status: {
        OK,
        NOT_FOUND
      }
    }
  }
}) => async ctx => {
  const { version } = ctx.params
  const redocVersion = `${redocBaseDir}/${version}`
  if (fs.existsSync(redocVersion)) {
    ctx.body = fs.createReadStream(redocVersion)
    ctx.status = OK
    ctx.set('Content-Type', 'text/javascript;charset=UTF-8')
  } else {
    ctx.body = 'NOT_FOUND'
    ctx.status = NOT_FOUND
  }
}
