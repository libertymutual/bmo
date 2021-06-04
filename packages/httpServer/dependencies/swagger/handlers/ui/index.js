export default ({
  config: {
    swagger: { urls }
  },
  dependencies: {
    swagger: { ui },
    http: { status: { OK }}
  }
}) => ctx => {
  ctx.body = ui({ ...urls })
  ctx.status = OK
}
