export default () => async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    if (e.message) {
      ctx.body = {
        message: e.message
      }
    }
  }

  return ctx
}
