export default ({
  dependencies: {
    swagger: { definition },
    http: {
      status: { OK }
    }
  }
}) => ctx => {
  ctx.body = definition
  ctx.status = OK
}
